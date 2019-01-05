from flask import Flask, jsonify, request
from flask_restful import Resource, Api, reqparse, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *
from sqlalchemy.sql import select
from html import unescape
import json
import datetime
import requests
from functools import wraps

from BullpenTrackerServer.api import loginManager
from BullpenTrackerServer.api.bptDatabase import bptDatabase
from BullpenTrackerServer import app


"""
bptAPI.py

Contains all routes for BullpenTrackerAPI. API routes are hosted with Flask-restful.
Database queries are processed through the bptDatabase class.

"""


api = Api(app)


# Wrapper for required pitcher to be authorized to use http method
def requires_pitcher_auth(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		p_token = request.cookies.get('p_token')
		if not p_token or p_token == '':
			abort(401, message="not logged in")
		args = list(args)
		args.insert(1, p_token)
		return f(*args, **kwargs)
	return decorated

def get_pid(p_token):
	return bptDatabase().select_where_first(['pitchers'], *('p_id', ), **{'p_token': p_token})['p_id']


# Creates JSON response object with variable status code
def respond(data, status=200, cookies={}):
	response = jsonify(data)
	response.status_code = status

	for key, val in cookies.items():
		print(key, val)
		response.set_cookie(key, value=val)

	return response


# Resource for account password management
class Password(Resource):

	def put(self):
		parser = reqparse.RequestParser()
		parser.add_argument('email', type=str, help='Account email')
		parser.add_argument('pass_old', type=str, help='Account old password')
		parser.add_argument('pass_new', type=str, help='Account new password')

		data = parser.parse_args()
		email = data['email']

		if loginManager.verify_login(email, data['pass_old']):
			r = bptDatabase().update('pitchers', data, **{'email', email})
			return jsonify({'message': 'updated password for account -- {}'.format(email)})

		return abort(403, message= 'invalid credentials')


# Resource for processing login POSTs
class LoginHelp(Resource):

	def post(self):
		parser = reqparse.RequestParser()
		parser.add_argument('email', type=str, help='Account email')
		parser.add_argument('pass', type=str, help='Account password')
		data = parser.parse_args()

		if loginManager.verify_login(data['email'], data['pass']):
			fields = ('email', 'p_token', 'firstname', 'lastname', 'throws')

			# t = loginManager.create_token(8)
			# if not bptDatabase().update('pitchers', {'p_token': t}, **{'email': data['email']}):
			# 	print("Could not create new p_token")
			# else:
			# 	print("successfully created new p_token")

			r = bptDatabase().select_where_first(['pitchers'], *fields, **{'email': data['email']})

			return respond(r, cookies={'p_token': r['p_token']})

		return respond({'message': 'invalid login credentials'}, 403)


# Resource for managing pitcher accounts
class Pitcher(Resource):
	
	# Get details of pitcher account
	@requires_pitcher_auth
	def get(self, p_token):
		filters = {'p_token': p_token}
		fields = ('p_token', 'throws', 'email', 'firstname', 'lastname')
		return respond(bptDatabase().select_where_first(['pitchers'], *fields, **filters))


	# Create new pitcher account
	def post(self):
		parser = reqparse.RequestParser()
		#parser.add_argument('p_token', type=str, help='Pitcher access token')
		parser.add_argument('throws', type=str, help='Pitcher throwing side')
		parser.add_argument('email', type=str, help='Pitcher email')
		parser.add_argument('firstname', type=str, help='Pitcher first name')
		parser.add_argument('lastname', type=str, help='Pitcher last name')
		parser.add_argument('pass', type=str, help='Pitcher password')
		data = parser.parse_args()

		if 'email' in bptDatabase().select_where_first('pitchers', *('email', ), **{'email': data['email']}):
			return abort(409, message='email address already linked to existing account')

		token = loginManager.create_token(8)
		while not loginManager.valid_token(token, 'pitchers', 'p_token'):
			token = loginManager.create_token(8)
	
		data = {'p_token': token, 'name': '', **data}
		ins = bptDatabase().insert('pitchers', **data)

		if ins:
			return respond({'message': 'added new pitcher successfully', 'p_token': token}, 201)
		else:
			abort(401, message='failed to add new pitcher with email {}'.format(data['email']))


	# Update pitcher account information
	@requires_pitcher_auth
	def put(self, p_token):
		parser = reqparse.RequestParser()
		parser.add_argument('throws', type=str, help='Pitcher throwing side')
		parser.add_argument('email', type=str, help='Pitcher email')
		parser.add_argument('firstname', type=str, help='Pitcher first name')
		parser.add_argument('lastname', type=str, help='Pitcher last name')
		#parser.add_argument('pass', type=str, help='Pitcher password')
		data = parser.parse_args()

		filters = {'p_token': p_token}


		if bptDatabase().update('pitchers', filters, **data):
			return respond({'message': 'successfully updated pitcher profile'}, 201)
		else:
			return respond({'message': 'failed to update pitcher profile'}, 304)


# Resource for managing bullpens for the logged in pitcher
class PitcherBullpens(Resource):

	@requires_pitcher_auth
	def get(self, p_token):
		parser = reqparse.RequestParser()
		parser.add_argument('date', type=lambda d: datetime.strptime(d, '%Y%m%d %I%M%p %Z'), help='Pen date') # needs formatting?
		parser.add_argument('type', type=str, help='Pen type')
		parser.add_argument('team', type=str, help='Pen team') 

		data = parser.parse_args()

		fields = ('id', 'date', 'type', 'pitch_count', 'team', 'b_token')
		output = bptDatabase().select_where(['bullpens', 'pitchers'], *fields, **{'p_token': p_token})
		filtered_output = []
		for d in output:
			include = True
			for key, val in data.items():
				if val is None:
					continue
				if d[key] != val:
					include = False
					break
			if include:
				filtered_output.append(d)

		return respond(filtered_output)


	# Create new bullpen for logged in pitcher
	@requires_pitcher_auth
	def post(self, p_token):
		parser = reqparse.RequestParser()

		# TODO: Fix join loading
		#parser.add_argument('pitch_count', type=int, help='Pen pitch count')
		parser.add_argument('type', type=str, help='Pen type')
		parser.add_argument('team', type=str, help='Pen team') 


		data = parser.parse_args()
		data['pitch_count'] = 0

		pid = get_pid(p_token)

		b_token = loginManager.create_token(8)
		while not loginManager.valid_token(b_token, 'bullpens', 'b_token'):
			b_token = loginManager.create_token(8)

		if bptDatabase().insert('bullpens', **{'b_token': b_token, 'p_id': pid, 'date': datetime.datetime.now(), **data}):
			return respond({'message': 'New bullpen successfully created', 'b_token': b_token})
		else:
			abort(401, message="bullpen creation failed")


# Resource for retrieving all teams current logged in pitcher is part of
class PitcherTeams(Resource):

	@requires_pitcher_auth
	def get(self, p_token):

		teams = bptDatabase().raw_query('SELECT t_id, team_name, team_info, team_number, tp_token_private, tp_token_public, perms \
			FROM team_player TP \
			JOIN team T ON TP.t_id=T.id \
			JOIN pitchers P ON TP.p_id=P.p_id \
			WHERE p_token=\"{}\";'.format(p_token))

		return respond(teams)


class JoinTeam(Resource):

	@requires_pitcher_auth
	def post(self, p_token):
		parser = reqparse.RequestParser()
		parser.add_argument('team_name', type=str, help='Pen type')
		parser.add_argument('team_access_code', type=str, help='Pen team') 
		parser.add_argument('team_number', type=str, help='Pen team') 
		data = parser.parse_args()

		bptDB = bptDatabase()

		teams = bptDB.select_where('team', ('id', 'team_access_code'), {'team_name': data['team_name']})
		if len(teams) > 1:
			abort(401, message="more than one team with name found")
		elif len(teams) == 0:
			abort(401, message="found no teams with name \'{}\''".format(data['team_name']))
		
		if data['team_access_code'] != teams[0]['team_access_code']:
			abort(401, message="invalid access code for team \'{}\'".format(data['team_name']))

		pid = get_pid(p_token)

		pub_token = loginManager.create_token(8)
		priv_token = loginManager.create_token(8)

		d = {'t_id': teams[0]['id'], 'p_id': pid, 
			'tp_token_private': priv_token, 'tp_token_public': pub_token,
			'perms': 0, 'team_number': data['team_number']}

		r = bptDB.insert('team_player', d)
		return respond(r)


# Resource for managing team instances
class Team(Resource):
	parser = reqparse.RequestParser()
	#parser.add_argument('team_name', type=str, help='Team name')
	
	def get(self, t_name):
		#filters = self.parser.parse_args(strict=True)
		n = unescape(t_name)

		filters = {'team_name': n}
		fields = ('id', 'team_name', 'team_info')

		return respond(bptDatabase().select_where_first(['team'], *fields, **filters))


class CreateTeam(Resource):

	def post(self):
		parser = reqparse.RequestParser()
		parser.add_argument('team_name', type=str, help='Team name')
		parser.add_argument('team_info', type=str, help='Team info')
		parser.add_argument('team_access_code', type=str, help='Team access code')

		data = parser.parse_args(strict=True)

		r = bptDatabase().insert('team', **data)

		return respond(r)


class TeamPitchers(Resource):
	
	@requires_pitcher_auth
	def post(self, p_token):

		parser = reqparse.RequestParser()
		parser.add_argument('priv_token', type=str, help='Pitcher private token')
		data = parser.parse_args(strict=True)
		#filters = self.parser.parse_args(strict=True)
		r = bptDatabase.raw_query('SELECT A.p_id, team_number, tp_token_public, firstname, lastname, email \
			FROM team_player AS A JOIN pitchers AS B ON A.p_id=B.p_id \
			WHERE t_id=(SELECT t_id FROM team_player WHERE tp_token_private=\'{}\');'.format(data['priv_token']))

		return respond(r)




# Resource for management of a specific bullpen instance
class Bullpen(Resource):

	# Get information on one or more bullpens from input b_token(s) (separated by +)
	@requires_pitcher_auth
	def get(self, p_token, b_token):
		b_token_list = b_token.split('+')
		pid = bptDatabase().select_where_first(['pitchers'], *('p_id', ), **{'p_token': p_token})['p_id']
		bid_list = []

		bptDB = bptDatabase()
		for token in b_token_list:
			b = bptDB.select_where_first(['bullpens'], *('id', ), **{'b_token': token, 'p_id': pid})
			if 'id' in b:
				bid_list.append(b['id'])

		ret_fields = ('id', 'bullpen_id', 'pitch_type', 'ball_strike', 'vel', 'result', 'pitchX', 'pitchY', 'ab', 'hard_contact')
		pitches = []
		for bid in bid_list:
			pitches += bptDB.select_where(['pitches'], *ret_fields, **{'bullpen_id': bid})
		bptDB.close()

		pitches_reform = []
		for pitch in pitches:
			if pitch['vel'] != "":
				pitch['vel'] = float(pitch['vel'])
			pitches_reform.append(pitch)

		return respond(pitches_reform)


	# Create a new bullpen instance
	@requires_pitcher_auth
	def post(self, p_token, b_token):
		#p_token = request.cookies.get('p_token')
		pid = bptDatabase().select_where_first(['pitchers'], *('p_id', ), **{'p_token': p_token})['p_id']
		bid = bptDatabase().select_where_first(['bullpens'], *('id', ), **{'b_token': b_token, 'p_id': pid})['id']

		parser = reqparse.RequestParser()
		parser.add_argument('pitch_type', type=str, help='Pitch type')
		parser.add_argument('ball_strike', type=str, help='Ball or Strike / Executed or Not Executed') 
		parser.add_argument('vel', type=float, help='Pitch velocity') 
		parser.add_argument('result', type=str, help='Pitch result code') 
		parser.add_argument('pitchX', type=float, help='Pitch X location') 
		parser.add_argument('pitchY', type=float, help='Pitch Y location') 
		parser.add_argument('ab', type=str, help='At bat ID for this pitch') 
		parser.add_argument('hard_contact', type=bool, help='Pitch resulted in hard contact by batter') 

		data = parser.parse_args()
		data['bullpen_id'] = bid

		if bptDatabase().insert('pitches', **data):	
			r = bptDatabase().raw_query('UPDATE bullpens SET \
				pitch_count=(SELECT COUNT(*) FROM pitches WHERE bullpen_id={}) WHERE id={};'.format(bid, bid))
			return respond({'message': 'successfully created new pitch'}, commit=True)
		else:
			return respond({'message': 'failed to create new pitch'}, 401)





# Test resource for easily executing test API requests
class Test(Resource):

	def get(self):

		# ids = bptDatabase().select_where('team_player', *('t_id', 'p_id'), **{})

		# print(ids)

		# for pid in ids:
		# 	t1 = loginManager.create_token(8)
		# 	t2 = loginManager.create_token(8)

		# 	try:
		# 		bptDatabase().update('team_player', {'tp_token_private': t1, 'tp_token_public': t2}, **{'p_id': pid['p_id'], 't_id': pid['t_id']})
		# 	except:
		# 		return jsonify({'message': 'failed'})

		# return jsonify({})

		pass


###################
# Resource Routes #
###################
api.add_resource(Test, '/api/test')
api.add_resource(LoginHelp, '/api/login')
api.add_resource(Password, '/api/password')
api.add_resource(Bullpen, '/api/bullpen/<string:b_token>')
api.add_resource(PitcherBullpens, '/api/pitcher/bullpens')
api.add_resource(PitcherTeams, '/api/pitcher/teams')
api.add_resource(Pitcher, '/api/pitcher')
api.add_resource(Team, '/api/team/<string:t_name>')
api.add_resource(JoinTeam, '/api/team/join')
api.add_resource(CreateTeam, '/api/team/create')
api.add_resource(TeamPitchers, '/api/team/pitchers')



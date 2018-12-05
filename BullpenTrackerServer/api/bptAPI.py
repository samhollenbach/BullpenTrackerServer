from flask import Flask, jsonify, request
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *
from sqlalchemy.sql import select
from html import unescape
import json
import datetime
import requests

from BullpenTrackerServer.api import loginManager
from BullpenTrackerServer.api.bptDatabase import bptDatabase
from BullpenTrackerServer import app

api = Api(app)

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

		return jsonify({'message': 'invalid credentials'})


class LoginHelp(Resource):

	def post(self):
		parser = reqparse.RequestParser()
		parser.add_argument('email', type=str, help='Account email')
		parser.add_argument('pass', type=str, help='Account password')
		data = parser.parse_args()

		if loginManager.verify_login(data['email'], data['pass']):
			fields = ('email', 'p_token', 'firstname', 'lastname', 'throws')

			return jsonify(bptDatabase().select_where_first(['pitchers'], *fields, **{'email': data['email']}))

		return jsonify({'message': 'invalid login credentials'})


class Pitcher(Resource):
	
	def get(self, p_token=None):

		if not p_token:
			return jsonify({'message': 'must append access token (/api/pitcher/<token>) to view pitcher'})

		#parser = reqparse.RequestParser()
		#parser.add_argument('p_token', type=str, help='Pitcher access token')
		#filters = parser.parse_args(strict=True)
		filters = {'p_token': p_token}
		fields = ('p_token', 'throws', 'email', 'firstname', 'lastname')
		return jsonify(bptDatabase().select_where_first(['pitchers'], *fields, **filters))


	def post(self, p_token=None):
		parser = reqparse.RequestParser()
		#parser.add_argument('p_token', type=str, help='Pitcher access token')
		parser.add_argument('throws', type=str, help='Pitcher throwing side')
		parser.add_argument('email', type=str, help='Pitcher email')
		parser.add_argument('firstname', type=str, help='Pitcher first name')
		parser.add_argument('lastname', type=str, help='Pitcher last name')
		parser.add_argument('pass', type=str, help='Pitcher password')
		data = parser.parse_args()

		if 'email' in bptDatabase().select_where_first('pitchers', *('email', ), **{'email': data['email']}):
			return jsonify({'message': 'email address already linked to existing account'})

		token = loginManager.create_token(8)
		while not loginManager.valid_token(token, 'pitchers', 'p_token'):
			token = loginManager.create_token(8)

		
		data = {'p_token': token, **data}

		return jsonify(bptDatabase().insert('pitchers', **data))

	def put(self, p_token=None):

		if not p_token:
			return jsonify({'message': 'must append access token (/api/pitcher/<token>) to update pitcher'})

		parser = reqparse.RequestParser()
		#parser.add_argument('p_token', type=str, help='Pitcher access token')
		parser.add_argument('throws', type=str, help='Pitcher throwing side')
		parser.add_argument('email', type=str, help='Pitcher email')
		parser.add_argument('firstname', type=str, help='Pitcher first name')
		parser.add_argument('lastname', type=str, help='Pitcher last name')
		#parser.add_argument('pass', type=str, help='Pitcher password')
		data = parser.parse_args()

		filters = {'p_token': p_token}

		return jsonify(bptDatabase().update('pitchers', filters, **data))

class PitcherBullpens(Resource):

	def get(self, p_token):

		parser = reqparse.RequestParser()

		# TODO: Fix join loading
		parser.add_argument('date', type=lambda d: datetime.strptime(d, '%Y%m%d'), help='Pen date') # needs formatting?
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

		return jsonify(filtered_output)


	def post(self, p_token):
		parser = reqparse.RequestParser()

		# TODO: Fix join loading
		parser.add_argument('pitch_count', type=int, help='Pen pitch count')
		parser.add_argument('type', type=str, help='Pen type')
		parser.add_argument('team', type=str, help='Pen team') 


		data = parser.parse_args()

		pid = bptDatabase().select_where_first(['pitchers'], *('p_id', ), **{'p_token': p_token})['p_id']

		b_token = loginManager.create_token(8)
		while not loginManager.valid_token(b_token, 'bullpens', 'b_token'):
			b_token = loginManager.create_token(8)

		return jsonify(bptDatabase().insert('bullpens', **{'b_token': b_token, 'p_id': pid, 'date': datetime.datetime.now(), **data}))



class Team(Resource):
	parser = reqparse.RequestParser()
	#parser.add_argument('team_name', type=str, help='Team name')
	
	def get(self, t_name):
		#filters = self.parser.parse_args(strict=True)
		n = unescape(t_name)

		filters = {'team_name': n}
		fields = ('id', 'team_name', 'team_info')

		return jsonify(bptDatabase().select_where_first(['team'], *fields, **filters))


class Test(Resource):

	def get(self):
		pass_in = 'pass'

		# data = {'throws': 'R',
		# 		'firstname': 'PostT323est',
		# 		'lastname': 'B4IG',
		# 		'email': 'tes4rt@test.test',
		# 		'pass': loginManager.create_pass_hash(pass_in),
		# 		}

		data = {'email': 'shollenb@macalester.edu', 'pass': 'pass'}

		url = 'http://bullpentracker.com/api/login'

		r = requests.post(url, data=data)

		return jsonify(r.text)

api.add_resource(Test, '/api/test')

api.add_resource(LoginHelp, '/api/login')
api.add_resource(Password, '/api/password')
api.add_resource(PitcherBullpens, '/api/pitcher/<string:p_token>/bullpens')
api.add_resource(Pitcher, '/api/pitcher/<string:p_token>', '/api/pitcher')
api.add_resource(Team, '/api/team/<string:t_name>')



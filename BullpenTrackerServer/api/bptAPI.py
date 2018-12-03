from flask import Flask, jsonify, request
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy import *
from sqlalchemy.sql import select

from BullpenTrackerServer.api.bptDatabase import bptDatabase

from BullpenTrackerServer import app

api = Api(app)


class Pitcher(Resource):
	
	def get(self, p_token):
		#parser = reqparse.RequestParser()
		#parser.add_argument('p_token', type=str, help='Pitcher access token')
		#filters = parser.parse_args(strict=True)
		filters = {'p_token': p_token}
		fields = ('p_token', 'throws', 'email', 'firstname', 'lastname')
		return bptDatabase().select_where_first('pitchers', *fields, **filters)


	def post(self, *args, **kwargs):
		parser = reqparse.RequestParser()
		parser.add_argument('p_token', type=str, help='Pitcher access token')
		parser.add_argument('throws', type=str, help='Pitcher throwing side')
		parser.add_argument('email', type=str, help='Pitcher email')
		parser.add_argument('firstname', type=str, help='Pitcher first name')
		parser.add_argument('lastname', type=str, help='Pitcher last name')
		parser.add_argument('pass', type=str, help='Pitcher password')
		data = parser.parse_args()
		print(data)

		return bptDatabase().insert('pitchers', **data)


class Team(Resource):
	parser = reqparse.RequestParser()
	#parser.add_argument('team_name', type=str, help='Team name')
	
	def get(self, t_name):
		#filters = self.parser.parse_args(strict=True)
		filters = {'team_name': t_name}
		fields = ('id', 'team_name', 'team_info')

		return bptDatabase().select_where('team', *fields, **filters)


api.add_resource(Pitcher, 'api/pitcher/<string:p_token>')
api.add_resource(Team, 'api/team/<string:t_name>')



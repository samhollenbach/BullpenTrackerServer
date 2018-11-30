from flask import Flask, jsonify
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy import *
from sqlalchemy.sql import select

from BullpenTrackerServer.api.bptDatabase import bptDatabase

from BullpenTrackerServer import app

api = Api(app)


class Pitcher(Resource):
	parser = reqparse.RequestParser()
	parser.add_argument('p_token', type=str, help='Pitcher access token')
	
	def get(self):
		filters = self.parser.parse_args(strict=True)
		fields = ('p_token', 'throws', 'email', 'firstname', 'lastname')
		return bptDatabase().select_where_single('pitchers', *fields, **filters)


class Team(Resource):
	parser = reqparse.RequestParser()
	parser.add_argument('team_name', type=str, help='Team name')
	
	def get(self):
		filters = self.parser.parse_args(strict=True)

		fields = ('id', 'team_name', 'team_info')

		return bptDatabase().select_where('team', *fields, **filters)


api.add_resource(Pitcher, '/pitcher')
api.add_resource(Team, '/team')
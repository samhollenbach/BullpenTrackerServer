from flask import Flask
from flask_restful import Resource, Api

from BullpenTrackerServer import app

api = Api(app)

class Pitcher(Resource):
	def get(self):
		return {'test': 'Test'}


api.add_resource(Pitcher, '/pitcher')
from flask import Flask
from flask_restful import Resource, Api

class BullpenTrackerAPI(object):

	def make_routes(self, application):
		@application.route('/pitchers', methods=['GET'])
		def test():
			return 'welkgnae'

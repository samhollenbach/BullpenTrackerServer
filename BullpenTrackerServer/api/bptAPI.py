from flask import Flask, jsonify
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy import *
from sqlalchemy.sql import select

from BullpenTrackerServer import app

api = Api(app)


class Pitcher(Resource):

	#parser = reqparse.RequestParser()
	#parser.add_argument('token', type=str, help='Pitcher access token')
	#args = parser.parse_args()


	def get(self, p_token):
		db = create_engine('mysql+pymysql://macbaseball:macalester@main-bpt-db.cds8eiszpipe.us-east-1.rds.amazonaws.com:3306/macbullpens')

		print(db.table_names())

		metadata = MetaData(db)

		conn = db.connect()

		pitchers = Table('pitchers', metadata, autoload=True)
		s = select([pitchers]).where(pitchers.c.p_token == p_token)
		res = conn.execute(s)
		r = [dict(row) for row in res][0]

		j = jsonify(r)
		return j


api.add_resource(Pitcher, '/pitcher/<p_token>')
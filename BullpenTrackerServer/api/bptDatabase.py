from sqlalchemy import *
from sqlalchemy.sql import select
from sqlalchemy.orm import sessionmaker, load_only
from sqlalchemy.orm.strategy_options import Load
from flask import jsonify

class bptDatabase(object):

	Session = sessionmaker()
	db = create_engine('mysql+pymysql://macbaseball:macalester@main-bpt-db.cds8eiszpipe.us-east-1.rds.amazonaws.com:3306/macbullpens')
	metadata = MetaData(db)
	#conn = db.connect()
	Session.configure(bind=db)
	session = Session()

	# pitchers = Table('pitchers', metadata, autoload=True)
	# bullpens = Table('bullpens', metadata, autoload=True)
	# atbats = Table('atbats', metadata, autoload=True)
	# pitches = Table('pitches', metadata, autoload=True)
	# teams = Table('team', metadata, autoload=True)
	# team_players = Table('team_player', metadata, autoload=True)

	def select_where(self, table, *fields, **kwargs):
		t = Table(table, self.metadata, autoload=True)
		quer = self.session.query(t).filter_by(**kwargs).all()
		resp = [{k: d._asdict()[k] for k in fields} if fields else d._asdict() for d in quer]
		return jsonify(resp)

	def select_where_single(self, table, *fields, **kwargs):
		t = Table(table, self.metadata, autoload=True)
		d = self.session.query(t).filter_by(**kwargs).first()._asdict()
		resp = {k: d[k] for k in fields } if fields else d
		return jsonify(resp)
	






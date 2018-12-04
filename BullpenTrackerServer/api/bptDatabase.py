from sqlalchemy import *
from sqlalchemy.sql import select
from sqlalchemy.orm import sessionmaker, load_only
from flask import jsonify

import BullpenTrackerServer.instance.config as config

class bptDatabase(object):

	Session = sessionmaker()

	db = create_engine('{}://{}:{}@{}:{}/{}'.format(
		config.DB_DRIVER, config.DB_USER, config.DB_PASS, config.DB_ADDRESS, config.DB_PORT, config.DB_DB))

	metadata = MetaData(db)
	#conn = db.connect()
	Session.configure(bind=db)
	session = Session()


	def select_where(self, table, *fields, **filters):
		t = Table(table, self.metadata, autoload=True)
		q = self.session.query(t).filter_by(**filters).all()
		resp = [{k: d._asdict()[k] for k in fields} if fields else d._asdict() for d in q]
		return resp

	def select_where_first(self, table, *fields, **filters):
		t = Table(table, self.metadata, autoload=True)
		q = self.session.query(t).filter_by(**filters).first()
		if q is None:
			return {}
		d = q._asdict()
		resp = {k: d[k] for k in fields} if fields else d
		return resp

	def insert(self, table, **values):
		t = Table(table, self.metadata, autoload=True)
		i = t.insert().values(**values)
		r = self.session.execute(i)
		self.session.commit()
		return dict(r)

	def update(self, table, values_dict, **filters):
		t = Table(table, self.metadata, autoload=True)
		u = self.session.query(t).filter_by(**filters).update(values_dict, synchronize_session=False)
		#r = self.session.execute(u)
		self.session.commit()
		return {'message': '{} rows updated'.format(u)}




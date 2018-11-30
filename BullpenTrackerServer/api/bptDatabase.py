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
		return jsonify(resp)

	def select_where_first(self, table, *fields, **filters):
		t = Table(table, self.metadata, autoload=True)
		q = self.session.query(t).filter_by(**filters).first()
		if q is None:
			return jsonify({})

		d = q._asdict()
		resp = {k: d[k] for k in fields } if fields else d
		return jsonify(resp)

	def insert(self, table, **values):
		t = Table(table, self.metadata, autoload=True)
		i = t.insert().values(**values)
		self.session.execute(i)
		self.session.commit()
		return jsonify({})

	def update(self, table, filters, **values): # TODO: double kwargs
		t = Table(table, self.metadata, autoload=True)
		u = t.update().where(filters).values(**values)
		return self.session.execute(u)




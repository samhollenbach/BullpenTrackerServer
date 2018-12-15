from sqlalchemy import *
from sqlalchemy.sql import select
from sqlalchemy.orm import sessionmaker, load_only, selectinload, joinedload
from flask import jsonify

import BullpenTrackerServer.instance.config as config

class bptDatabase(object):

	def __init__(self):
		self.Session = sessionmaker()

		if config.DEBUG:
			self.db = create_engine('{}:///{}?check_same_thread=False'.format(config.DB_DRIVER, config.DB_ADDRESS))
		else:
			self.db = create_engine('{}://{}:{}@{}:{}/{}'.format(
				config.DB_DRIVER, config.DB_USER, config.DB_PASS, config.DB_ADDRESS, config.DB_PORT, config.DB_DB))

		self.metadata = MetaData(self.db)
		#conn = db.connect()
		self.Session.configure(bind=self.db)
		self.session = self.Session()


	def select_where(self, tables, *fields, **filters):
		
		if type(tables) is list:
			l = len(tables)
			t = Table(tables[0], self.metadata, autoload=True)
		else:
			l = 1
			t = Table(tables, self.metadata, autoload=True)
		
		if l > 1:
			t2 = Table(tables[1], self.metadata, autoload=True)
			q = self.session.query(t).join(t2).filter_by(**filters).all()
		else:
			q = self.session.query(t).filter_by(**filters).all()


		resp = [{k: d._asdict()[k] for k in fields} if fields else d._asdict() for d in q]
		return resp

	def select_where_first(self, tables, *fields, **filters):
		if type(tables) is list:
			l = len(tables)
			t = Table(tables[0], self.metadata, autoload=True)
		else:
			l = 1
			t = Table(tables, self.metadata, autoload=True)

		if l == 2:
			t2 = Table(tables[1], self.metadata, autoload=True)
			q = self.session.query(t).join(t2).filter_by(**filters).first()
		else:
			q = self.session.query(t).filter_by(**filters).first()
		
		if q is None:
			return {}
		d = q._asdict()
		resp = {k: d[k] for k in fields} if fields else d
		return resp

	def insert(self, table, **values):
		try:
			t = Table(table, self.metadata, autoload=True)
			print(t)
			i = t.insert().values(**values)
			print(i)
			r = self.session.execute(i)
			print(r)
			self.session.commit()
			
		except Exception as e:
			print(str(e))
			return False 
		return True
		

	def update(self, table, values_dict, **filters):
		try:
			t = Table(table, self.metadata, autoload=True)
			u = self.session.query(t).filter_by(**filters).update(values_dict, synchronize_session=False)
			self.session.commit()
		except:
			return False
		return True





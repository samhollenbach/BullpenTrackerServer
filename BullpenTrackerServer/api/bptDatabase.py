from sqlalchemy import *
from sqlalchemy.sql import select
from sqlalchemy.orm import sessionmaker, load_only, selectinload, joinedload
from flask import jsonify

import BullpenTrackerServer.instance.config as config


"""
bptDatabase.py

Driver for database connection with SQLalchemy. Generalized SELECT, INSERT, UPDATE statements.

TODO: DELETE statement / more flexibility

"""


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

	def __del__(self):
		self.close()

	def close(self):
		self.session.close()
		self.db.dispose()


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

		#self.close()
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
		
		#self.close()
		if q is None:
			return {}
		d = q._asdict()
		resp = {k: d[k] for k in fields} if fields else d
		return resp

	def insert(self, table, **values):
		try:
			t = Table(table, self.metadata, autoload=True)
			i = t.insert().values(**values)
			r = self.session.execute(i)
			self.session.commit()
		except Exception as e:
			print(str(e))
			self.close()
			return False 
		#self.close()
		return True
		

	def update(self, table, values_dict, **filters):
		try:
			t = Table(table, self.metadata, autoload=True)
			u = self.session.query(t).filter_by(**filters).update(values_dict, synchronize_session=False)
			self.session.commit()
		except Exception as e:
			print(str(e))
			self.close()
			return False 
		#self.close()
		return True


	def raw_query(self, query, commit=False):
		res = self.session.execute(query)
		if commit:
			self.session.commit()

		res_list = []
		for row in res:
			res_list.append(dict(row))
			
		return res_list





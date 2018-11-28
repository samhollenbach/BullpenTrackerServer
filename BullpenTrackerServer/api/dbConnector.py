from sqlalchemy import *

class dbConnector(object):


	db = create_engine('mysql+pymysql://macbaseball:macalester@main-bpt-db.cds8eiszpipe.us-east-1.rds.amazonaws.com:3306/macbullpens')

	print(db.table_names())

#metadata = BoundMetaData(db)

#pitchers = Table('pitchers', metadata, autoload=True)

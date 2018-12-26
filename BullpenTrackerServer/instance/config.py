import configparser
from os import path

# Main Config
DEBUG = False

DB_DRIVER = 'sqlite'
DB_ADDRESS = 'db.sqlite'

conf = configparser.ConfigParser()

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "config.ini"))
conf.read(filepath)

if not DEBUG:
	dbConf = conf['DATABASE']
	DB_DRIVER = dbConf['DB_DRIVER']
	DB_ADDRESS = dbConf['DB_ADDRESS']
	DB_PORT = dbConf['DB_PORT']
	DB_USER = dbConf['DB_USER']
	DB_PASS = dbConf['DB_PASS']
	DB_DB = dbConf['DB_DB']

# Login Config
PASS_SALT = conf['LOGIN']['PASS_SALT']


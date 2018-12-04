from passlib.hash import sha256_crypt
from secrets import token_hex
import json
from flask import jsonify

import BullpenTrackerServer.instance.config as config
from BullpenTrackerServer.api.bptDatabase import bptDatabase


def create_pass_hash(raw_pass):
	salted_pass = raw_pass + config.PASS_SALT
	return sha256_crypt.encrypt(salted_pass)


def verify_pass_hash(raw_pass, hashed_pass):
	salted_pass = raw_pass + config.PASS_SALT
	return sha256_crypt.verify(salted_pass, hashed_pass)

def get_account_hash(email):
	return bptDatabase().select_where_first('pitchers', *('pass', ), **{'email': email})['pass']


def verify_login(email, raw_pass):
	pass_hash = get_account_hash(email)
	return verify_pass_hash(raw_pass, pass_hash)


def create_token(length):
	length //= 2  # Char to byte
	return token_hex(length)


def valid_token(token, table, field):
	#fields = [field]
	#filters = {field: token}
	#resp = bptDatabase().select_where_first(table, *fields, **filters)
	#d = json.loads(resp)
	#if field in d:
	#	return False
	return True

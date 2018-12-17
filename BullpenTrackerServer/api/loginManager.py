from passlib.hash import sha256_crypt
from secrets import token_hex
import json
from flask import jsonify

import BullpenTrackerServer.instance.config as config
from BullpenTrackerServer.api.bptDatabase import bptDatabase

"""
loginManager.py

Functions for managing login setup and verification

"""

# Take a raw password and return encrypted password hash
def create_pass_hash(raw_pass):
	salted_pass = raw_pass + config.PASS_SALT
	return sha256_crypt.encrypt(salted_pass)


# Verify raw pass by comparing it to hashed password
def verify_pass_hash(raw_pass, hashed_pass):
	salted_pass = raw_pass + config.PASS_SALT
	return sha256_crypt.verify(salted_pass, hashed_pass)


# Queries the database for the given account's encrypted password
def get_account_hash(email):
	return bptDatabase().select_where_first(['pitchers'], *('pass', ), **{'email': email})['pass']


# Verifies an email and raw password
def verify_login(email, raw_pass):
	pass_hash = get_account_hash(email)
	return verify_pass_hash(raw_pass, pass_hash)


# Creates a hex string token of specified length
def create_token(length):
	length //= 2  # Char to byte
	return token_hex(length)


# Assures that given token is not already present in database (to prevent collisions)
def valid_token(token, table, field):
	fields = (field, )
	filters = {field: token}
	resp = bptDatabase().select_where_first(table, *fields, **filters)

	if field in resp:
		return False
	return True

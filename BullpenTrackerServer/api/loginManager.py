from passlib.hash import sha256_crypt
from secrets import token_hex

import BullpenTrackerServer.instance.config as config


def create_pass_hash(raw_pass):
	salted_pass = raw_pass + config.PASS_SALT
	return sha256_crypt.encrypt(raw_pass)


def verify_pass_hash(raw_pass, hashed_pass):
	salted_pass = raw_pass + config.PASS_SALT
	return ha256_crypt.verify(salted_pass, hashed_pass)


def create_token(length):
	return token_hex(length)
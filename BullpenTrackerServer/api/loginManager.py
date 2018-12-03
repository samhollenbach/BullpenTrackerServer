from passlib.hash import sha256_crypt
from secrets import token_hex

import BullpenTrackerServer.instance.config as config
from BullpenTrackerServer.api.bptDatabase import bptDatabase


def create_pass_hash(raw_pass):
	salted_pass = raw_pass + config.PASS_SALT
	return sha256_crypt.encrypt(raw_pass)


def verify_pass_hash(raw_pass, hashed_pass):
	salted_pass = raw_pass + config.PASS_SALT
	return ha256_crypt.verify(salted_pass, hashed_pass)


def create_token(length):
	length //= 2  # Char to byte
	return token_hex(length)
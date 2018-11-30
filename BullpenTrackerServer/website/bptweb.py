from flask import Flask, render_template, jsonify
import requests
import json

from BullpenTrackerServer import app
from BullpenTrackerServer.api import loginManager

from BullpenTrackerServer.instance import config


@app.route('/', methods=['GET'])
def home():
	return render_template('index.html')


@app.route('/about', methods=['GET'])
def about():
	return render_template('about.html')


@app.route('/login', methods=['GET'])
def login():

	db_auth = (config.DB_USER, config.DB_PASS)

	pass_in = 'pass'

	#headers = {'Content-Type': 'application/json'}

	data = {'throws': 'R',
			'firstname': 'PutTest',
			'lastname': 'Pls',
			'email': 'test@test.test',
			'pass': loginManager.create_pass_hash(pass_in),
			'p_token': loginManager.create_token(4)}

	url = 'http://127.0.0.1:5000/pitcher'

	#r = requests.post(url, auth=db_auth, data=data)

	#print(r.text)

	return render_template('login.html')


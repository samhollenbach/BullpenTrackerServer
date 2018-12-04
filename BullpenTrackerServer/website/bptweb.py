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

	pass_in = 'pass'

	data = {'throws': 'R',
			'firstname': 'PostT323est',
			'lastname': 'B4IG',
			'email': 'tes4rt@test.test',
			'pass': loginManager.create_pass_hash(pass_in),
			}

	url = 'http://127.0.0.1:5000/api/password'

	#r = requests.put(url, data=data)

	#print(r.text)

	return render_template('login.html')


from flask import Flask, render_template, jsonify, request, redirect
import requests
import json
from functools import wraps

from BullpenTrackerServer import app
from BullpenTrackerServer.api import loginManager

from BullpenTrackerServer.instance import config


def requires_pitcher_auth(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		p_token = request.cookies.get('p_token')
		if not p_token:
			return redirect('/login', code=302)
		return f(*args, **kwargs)
	return decorated



@app.route('/', methods=['GET'])
@requires_pitcher_auth
def home(p_token=None):
	return render_template('home.html', p_token=p_token)


@app.route('/about', methods=['GET'])
def about():
	return render_template('about.html')

@app.route('/login', methods=['GET'])
def login():
	return render_template('login.html')


@app.route('/data_entry', methods=['GET'])
@requires_pitcher_auth
def data_entry():
	return render_template('data_entry.html')

@app.route('/data_viz', methods=['GET'])
@requires_pitcher_auth
def data_viz():
	return render_template('data_viz.html')


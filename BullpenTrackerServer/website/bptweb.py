from flask import Flask, render_template, jsonify, request, redirect, make_response, send_from_directory
import requests
import json
from functools import wraps
import os

from BullpenTrackerServer import app
from BullpenTrackerServer.api import loginManager

from BullpenTrackerServer.instance import config

"""
bptweb.py

Contains all routes for the user-facing web pages. 

"""


def requires_pitcher_auth(f):
	"""
	Decorator which indicated a pitcher token is required (stored as cookie) to view this page
	"""
	@wraps(f)
	def decorated(*args, **kwargs):
		p_token = request.cookies.get('p_token')
		if not p_token  or p_token == '':
			return redirect('/login', code=302)
		return f(*args, **kwargs)
	return decorated



@app.route('/', methods=['GET'])
@requires_pitcher_auth
def home():
	return render_template('home.html')


@app.route('/about', methods=['GET'])
def about():
	return render_template('about.html')

@app.route('/login', methods=['GET'])
def login():
	redirect_login = render_template('login.html')
	resp = make_response(redirect_login)
	resp.set_cookie('p_token', '', expires=0)
	return resp
	

@app.route('/signup', methods=['GET'])
def signup():
	redirect_login = render_template('sign_up.html')
	resp = make_response(redirect_login)
	resp.set_cookie('p_token', '', expires=0)
	return resp


@app.route('/logout', methods=['GET'])
def logout():	
	redirect_login = redirect('/login')
	resp = make_response(redirect_login)
	resp.set_cookie('p_token', '', expires=0)
	return resp


@app.route('/track', methods=['GET'])
@requires_pitcher_auth
def data_entry():
	return render_template('data_entry.html')

@app.route('/stats', methods=['GET'])
@requires_pitcher_auth
def data_viz():
	return render_template('data_viz.html')


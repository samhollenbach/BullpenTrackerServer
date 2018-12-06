from flask import Flask, render_template, jsonify, request, redirect
import requests
import json

from BullpenTrackerServer import app
from BullpenTrackerServer.api import loginManager

from BullpenTrackerServer.instance import config

@app.route('/', methods=['GET'])
def home():
	if request.cookies.get('p_token'):
		return render_template('home.html')
	return redirect("/login", code=302)


@app.route('/about', methods=['GET'])
def about():
	return render_template('about.html')


@app.route('/login', methods=['GET'])
def login():
	return render_template('login.html')


@app.route('/data_entry', methods=['GET'])
def data_entry():
	return render_template('data_entry.html')


@app.route('/data_viz', methods=['GET'])
def data_viz():
	return render_template('data_viz.html')


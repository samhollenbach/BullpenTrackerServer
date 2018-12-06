from flask import Flask, render_template, jsonify
import requests
import json

from BullpenTrackerServer import app
from BullpenTrackerServer.api import loginManager

from BullpenTrackerServer.instance import config

@app.route('/', methods=['GET'])
@app.route('/<p_token>', methods=['GET'])
def home(p_token=None):
	return render_template('home.html', p_token=p_token)


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


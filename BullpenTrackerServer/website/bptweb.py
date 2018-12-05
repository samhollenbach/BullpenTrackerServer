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
	return render_template('login.html')


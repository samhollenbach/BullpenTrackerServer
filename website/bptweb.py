from flask import Flask, render_template


class BullpenTrackerWebsite(object):

	def make_routes(self, application):

		@application.route('/', methods=['GET'])
		def home():
			return render_template('index.html')


		@application.route('/about', methods=['GET'])
		def about():
			return render_template('about.html')


		@application.route('/login', methods=['GET'])
		def login():
			return render_template('login.html')
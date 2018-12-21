from flask import Flask, url_for
from flask_cors import CORS

"""
__init__.py 

Initialize the flask server

Imports at the bottom allow routes to be instantiated from other files

"""


app = Flask(__name__, template_folder='website/templates', static_folder='website/static')
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.debug = False

import BullpenTrackerServer.api.bptAPI as api
import BullpenTrackerServer.website.bptweb as web

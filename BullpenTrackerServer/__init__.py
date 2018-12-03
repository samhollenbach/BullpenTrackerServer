from flask import Flask
from flask_cors import CORS

app = Flask(__name__, template_folder='website/templates', static_folder='website/static')
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.debug = True

import BullpenTrackerServer.api.bptAPI as api
import BullpenTrackerServer.website.bptweb as web

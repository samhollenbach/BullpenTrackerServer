from flask import Flask

app = Flask(__name__, template_folder='website/templates', static_folder='website/static')
app.debug = True

import BullpenTrackerServer.api.bptAPI as api
import BullpenTrackerServer.website.bptweb as web

from flask import Flask

import api.bptAPI as api
import website.bptweb as web

application = Flask(__name__, template_folder='website/templates', static_folder='website/static')
application.debug = True


web.BullpenTrackerWebsite().make_routes(application)

api.BullpenTrackerAPI().make_routes(application)


if __name__ == "__main__":
	application.run()
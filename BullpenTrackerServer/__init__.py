from flask import Flask

app = Flask(__name__, template_folder='website/templates', static_folder='website/static')
app.debug = True

import BullpenTrackerServer.api.bptAPI
import BullpenTrackerServer.website.bptweb



#web.BullpenTrackerWebsite().make_routes(app)

#api.make_api(app)


#if __name__ == "__main__":
#	app.run()

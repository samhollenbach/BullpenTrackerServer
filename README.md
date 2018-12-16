# BullpenTracker


BullpenTracker is a website and mobile app for recording and analysing baseball pitching data.

[Website](bullpentracker.com)

Mobile (WIP)


## Setup

Clone this repository to desired location. Navigate to the outer BullpenTrackerServer folder in your command line. 

```bash
git clone https://github.com/samhollenbach/BullpenTrackerServer
cd BullpenTrackerServer

# if using python virtual env
python -m venv venv
. venv/bin/activate

```

In your desired Python environment, run the setup script to install all necessary packages.

```bash
python setup.py
```


Next, indicate to Flask what project we want to run. Optionally, run the project in debug mode to enable auto-reloading on file changes.

```bash
export FLASK_APP=BullpenTrackerServer
export FLASK_DEBUG=True  # optional
```

Finally, run the flask server.

```bash
flask run
```

Flask should display the host and port you are now running the project on (most likely http://127.0.0.1:5000/), which you can enter into your browser to access the website. 


# BullpenTracker


BullpenTracker is a website and mobile app for recording and analysing baseball pitching data.

[Website](bullpentracker.com)

Mobile (WIP)


## Requirements

Python 3.5+ with [setuptools](https://pypi.org/project/setuptools/) installed



## Setup


Clone this repository to desired location. Navigate to the outer BullpenTrackerServer folder in your command line. 

```bash
git clone https://github.com/samhollenbach/BullpenTrackerServer
cd BullpenTrackerServer

# if using python virtual env
python -m venv venv
. venv/bin/activate

```


### IMPORTANT

This repository does not include the `config.py` file (required to run the project) because it contains database access information. For Shilad -- we've included this file in an email to you. Please place it in `BullpenTrackerServer/BullpenTrackerServer/instance/config.py`. If you are reading this and you are not Shilad, you can email [shollenb@macalester.edu](shollenb@macalester.edu) for the file.

If you examine this config file, there is also an option to switch off of DEBUG mode, which will store all data on a remote server. 



### After adding the config.py file


In your desired Python environment, run the setup script to install all necessary packages.

```bash
python setup.py install
```
If any of the packages fail to install, try to install them directly with pip.


Next, indicate to Flask what project we want to run. Optionally, run the project in debug mode to enable auto-reloading on file changes.

```bash
export FLASK_APP=BullpenTrackerServer
export FLASK_DEBUG=True  # optional
```
NOTE: use `set` instead of `export` if using Windows


Finally, run the flask server.

```bash
flask run
```

Flask should display the host and port you are now running the project on (most likely http://127.0.0.1:5000/), which you can enter into your browser to access the website. 


### 


## Technical Details

Website Hosting: [Flask](http://flask.pocoo.org/)

API Hosting: [Flask-restful](https://flask-restful.readthedocs.io/en/latest/)

Database Access: [SQLAlchemy](https://www.sqlalchemy.org/)

Password Hashing: [Passlib](https://passlib.readthedocs.io/en/stable/)




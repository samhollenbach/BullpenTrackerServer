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

Included is a  `config.py` file that controls configuration variables for the project. However to avoid including private keys and passwords, interally we use a `config.ini` file in the same folder. If you examine the `config.py` file you will see that (if not in `DEBUG` mode) the `.ini` variables will override the ones in the `.py` file.



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

Database Access: [SQLAlchemy](https://www.sqlalchemy.org/) + [pymysql](https://github.com/PyMySQL/PyMySQL)

Password Hashing: [Passlib](https://passlib.readthedocs.io/en/stable/)


## Known Issues

### Home / Login
-- Needs better formatting


### Data Entry 
-- Hard Contact field always inputs 1 into database

-- Should include additional form field for Ball/Strike instead of being based off of strike zone picture


### Visualization 
-- Occasional issues with refreshing while loading 

-- Mystery dots?






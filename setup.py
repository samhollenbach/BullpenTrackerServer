from setuptools import setup

setup(
    name='BullpenTrackerServer',
    version='1.0'
    packages=['BullpenTrackerServer'],
    include_package_data=True,
    install_requires=[
        'Flask', 
        'Flask-restful', 
        'Flask-sqlalchemy',
        'Flask_cors',
        'sqlalchemy', 
        'pymysql',
        'requests', 
        'passlib',
        
    ],
)
from setuptools import setup

setup(
    name='BullpenTrackerServer',
    packages=['BullpenTrackerServer'],
    include_package_data=True,
    install_requires=[
        'flask', 
        'flask-restful', 
        'flask-sqlalchemy',
        'flask_cors' 
        'sqlalchemy', 
        'requests', 
        'passlib',
        
    ],
)
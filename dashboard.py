from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os


app = Flask(__name__)
MONGO_DB_URI = os.environ.get('MONGO_DB_URI')
MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME')
MONGO_COLLECTION_NAME = os.environ.get('MONGO_COLLECTION_NAME')

FIELDS = {'': True,'ID': True, 'Name': True, 'Date': True,'Time': True, 'Event': True, 'Status': True,'Latitude':True,'Longitude':True,'MaximumWind':True,'MAX_CAT':True, '_id':False}





@app.route("/")
def get_home_page():
    return render_template('index.html')
    
@app.route("/methodology")
def get_methodology():
    return render_template('methodology.html')
    
@app.route("/code")
def get_code():
    return render_template('code.html')
    
@app.route("/dashboard")
def get_dashboard():
    return render_template('dashboard.html')    

@app.route("/data")
def get_data():
    with MongoClient(MONGO_DB_URI) as conn:
        collection = conn[MONGO_DB_NAME][MONGO_COLLECTION_NAME]
        landfallsdata = collection.find(projection=FIELDS)
        return json.dumps(list(landfallsdata))


    
if __name__ == "__main__":
    app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))
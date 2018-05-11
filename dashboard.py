from flask import Flask
from flask import render_template
import os


app = Flask(__name__)
@app.route("/")
def get_home_page():
    return render_template('index.html')


    
if __name__ == "__main__":
    app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))
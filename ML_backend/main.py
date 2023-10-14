from flask import Flask,render_template
import os
app = Flask(__name__,template_folder='../frontend/src/')

@app.route("/")
def hello_world():
    absolute_path = os.path.dirname(__file__)
    print(absolute_path)
    return render_template('index.html')
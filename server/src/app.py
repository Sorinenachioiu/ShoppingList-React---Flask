from flask import Flask, jsonify
import csv
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

data_dir = os.path.join(os.path.dirname(__file__), 'data')
csv_path = os.path.join(data_dir, 'groceries.csv')

with open(csv_path, 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    groceries = [row for row in reader]

@app.route('/api/groceries')
def get_groceries():
    return jsonify(groceries)

if __name__ == '__main__':
    app.run(debug=True)

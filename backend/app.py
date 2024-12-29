from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows frontend to communicate with backend

# Mock database
users = []
playlists = {}

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    for user in users:
        if user['username'] == data['username']:
            return jsonify({'message': 'User already exists'}), 400
    users.append({'username': data['username'], 'password': data['password']})
    return jsonify({'message': 'User registered successfully'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    for user in users:
        if user['username'] == data['username'] and user['password'] == data['password']:
            return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid username or password'}), 400

if __name__ == '__main__':
    app.run(debug=True)
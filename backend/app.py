from flask import Flask, request, jsonify
import sqlite3
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)

# CORS Configuration
CORS(app)

# Spotify credentials
CLIENT_ID = "8f3a06ca367a478f8da3afe6e4819c20"
CLIENT_SECRET = "3497f9fb43674a798eb8c05ffb5c3a0b"
REDIRECT_URI = "http://localhost:3000/callback"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope="playlist-read-private,playlist-read-collaborative,playlist-modify-public,playlist-modify-private"
))

# SQLite Database Setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///haru.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Mood(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    mood = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Initialize database
with app.app_context():
    db.create_all()

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Username, email, and password are required'}), 400

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'error': 'Username or email already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({'message': 'Login successful'}), 200

@app.route('/save_moods', methods=['POST'])
def save_moods():
    data = request.get_json()
    username = data.get('username')
    moods = data.get('moods')

    if not username or not moods:
        return jsonify({'error': 'Username and moods are required'}), 400

    for mood in moods:
        new_mood = Mood(username=username, mood=mood)
        db.session.add(new_mood)

    db.session.commit()
    return jsonify({'message': 'Moods saved successfully'}), 200

@app.route('/spotify/search', methods=['GET'])
def search_songs_or_playlists():
    query = request.args.get('query', '')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    try:
        results = sp.search(q=query, type='track', limit=20)
        songs = [{
            'name': track['name'],
            'artist': ', '.join([artist['name'] for artist in track['artists']]),
            'url': track['external_urls']['spotify']
        } for track in results['tracks']['items']]

        return jsonify(songs), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
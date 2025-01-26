import os
import requests
import base64
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Secure configuration
app.secret_key = os.getenv("APP_SECRET_KEY", "fallback_secret_key")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///haru.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Spotify credentials
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI", "http://localhost:3000/callback")

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope="playlist-read-private user-library-read"
))

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class Mood(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    mood = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mood = db.Column(db.String, nullable=True)


# Initialize database
with app.app_context():
    db.create_all()

# Mood features mapping
mood_features = {
    "Happy": {"danceability": 0.8, "energy": 0.7, "valence": 0.9},
    "Sad": {"danceability": 0.2, "energy": 0.3, "valence": 0.2},
    "Angry": {"danceability": 0.7, "energy": 0.9, "valence": 0.3},
    "Calm": {"danceability": 0.4, "energy": 0.3, "valence": 0.5},
    "Excited": {"danceability": 0.9, "energy": 0.9, "valence": 0.8},
    "Fear": {"danceability": 0.3, "energy": 0.8, "valence": 0.2},
    "Anxiety": {"danceability": 0.4, "energy": 0.8, "valence": 0.3},
    "Romantic": {"danceability": 0.6, "energy": 0.5, "valence": 0.7},
    "Bored": {"danceability": 0.3, "energy": 0.2, "valence": 0.4},
}

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 409

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
        return jsonify({'error': 'All fields are required'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    session['user_id'] = user.id
    return jsonify({'message': 'Login successful'}), 200


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'}), 200


@app.route('/spotify/search', methods=['GET'])
def search_songs_or_playlists():
    query = request.args.get('query', '')
    if not query:
        return jsonify({'error': 'Query is required'}), 400

    try:
        results = sp.search(q=query, type='track', limit=15)
        songs = [{
            'name': track['name'],
            'artist': ', '.join([artist['name'] for artist in track['artists']]),
            'url': track['external_urls']['spotify'],
            'album_cover': track['album']['images'][0]['url'] if track['album']['images'] else None
        } for track in results['tracks']['items']]

        return jsonify(songs), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/spotify/recommend_by_mood', methods=['POST'])
def recommend_by_mood():
    data = request.get_json()
    mood = data.get('mood')

    if not mood or mood not in mood_features:
        return jsonify({"error": "Invalid or missing mood"}), 400

    try:
        recommendations = sp.recommendations(
            seed_genres=["pop", "folk", "rock", "relax", "house", "ambient"],
            limit=10,
            target_danceability=mood_features[mood]['danceability'],
            target_energy=mood_features[mood]['energy'],
            target_valence=mood_features[mood]['valence']
        )

        tracks = [{
            'name': track['name'],
            'artist': ', '.join([artist['name'] for artist in track['artists']]),
            'url': track['external_urls']['spotify']
        } for track in recommendations['tracks']]

        return jsonify(tracks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
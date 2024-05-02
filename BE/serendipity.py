import os
import json
from spotipy.cache_handler import FlaskSessionCacheHandler
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, session, request, redirect, Response
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SECRET_KEY'] = os.urandom(64)

cred = credentials.Certificate("./serendipity-0-firebase-adminsdk-14fzt-004a797afa.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

cid = '9411dc2624284ba9a4ca325dc63ce651'
secret = 'fa29270bc22048819b99c43147af4db0'
redirect_uri = 'http://localhost:5000/callback'
scope = 'user-top-read playlist-modify-public'

cache_handler = FlaskSessionCacheHandler(session)
sp_oauth = SpotifyOAuth(
    client_id=cid,
    client_secret=secret,
    scope=scope,
    redirect_uri=redirect_uri,
    cache_handler=cache_handler,
    show_dialog=True)
sp = Spotify(auth_manager=sp_oauth)

def delete_old_songs():
    # Eski şarkıları Firestore'dan sil
    old_songs = db.collection('songs').stream()
    for song in old_songs:
        song.reference.delete()

@app.route('/')
def home():
    delete_old_songs()  # Her uygulama başladığında eski kayıtları temizle
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    return redirect('/get_songs')

@app.route('/callback')
def callback():
    sp_oauth.get_access_token(request.args['code'])
    return redirect('/get_songs')

@app.route('/get_songs')
def get_songs():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)

    delete_old_songs()  # Her uygulama başladığında eski kayıtları temizle

    results = sp.current_user_top_tracks(limit=5, offset=0, time_range='long_term')
    song_data = []
    for i, song in enumerate(results['items']):
        song_info = {'id': i, 'name': song['name'], 'year': song['album']['release_date'][:4]}

        # Sanatçı bilgilerini al
        artists = [artist['name'] for artist in song['artists']]
        song_info['artists'] = artists


        audio_features = sp.audio_features(song['id'])[0]
        song_info.update(audio_features)

        song_info['popularity'] = song['popularity']

        song_info['url'] = song['external_urls']['spotify']

        song_data.append(song_info)

        doc_ref = db.collection('songs').document()
        doc_ref.set(song_info)
    
    json_data = json.dumps(song_data, ensure_ascii=False)
    return Response(json_data, content_type='application/json; charset=utf-8')


if __name__ == '__main__':
    app.run(debug=True)

import os
import json
from spotipy.cache_handler import FlaskSessionCacheHandler
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, session, request, redirect, Response
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SECRET_KEY'] = os.urandom(64)

cred = credentials.Certificate("./serendipity-0-firebase-adminsdk-14fzt-004a797afa.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://serendipity-0-default-rtdb.europe-west1.firebasedatabase.app/'
})
ref = db.reference('songs')

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

@app.before_request
def before_first_request():
    if not hasattr(app, 'has_run_before'):
        clear_database()
        app.has_run_before = True

def clear_database():
    # Her uygulama başladığında veritabanını temizle
    ref.delete()

@app.route('/')
def home():
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

    results = sp.current_user_top_tracks(limit=5, offset=0, time_range='long_term')
    song_data = []
    for i, song in enumerate(results['items']):
        song_info = {'id': i, 'name': song['name'], 'year': song['album']['release_date'][:4]}
        song_data.append(song_info)
        
        # Şarkıyı Firebase'e ekle
        ref.push(song_info)
    
    json_data = json.dumps(song_data, ensure_ascii=False)
    return Response(json_data, content_type='application/json; charset=utf-8')

@app.route('/get_songs/<int:song_index>')
def get_song(song_index):
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)

    results = sp.current_user_top_tracks(limit=5, offset=0, time_range='long_term')
    if 0 <= song_index < len(results['items']):
        song = results['items'][song_index]
        song_info = {'id': song_index, 'name': song['name'], 'year': song['album']['release_date'][:4]}
        json_data = json.dumps(song_info, ensure_ascii=False)
        return Response(json_data, content_type='application/json; charset=utf-8')
    else:
        return "Invalid song index"

@app.route('/get_all_songs')
def get_all_songs():
    # Tüm şarkıları Firebase'den çek
    all_songs = ref.get()
    if all_songs:
        song_data = list(all_songs.values())
    else:
        song_data = []

    json_data = json.dumps(song_data, ensure_ascii=False)
    return Response(json_data, content_type='application/json; charset=utf-8')

if __name__ == '__main__':
    app.run(debug=True)

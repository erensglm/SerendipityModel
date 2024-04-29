import os
from spotipy.cache_handler import FlaskSessionCacheHandler
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
import spotipy.util as util
from flask import Flask, session, url_for, request, redirect, jsonify, Response
import json
app =Flask(__name__)
app.config['SECRET_KEY']= os.urandom(64)

cid = '9411dc2624284ba9a4ca325dc63ce651'
secret = 'fa29270bc22048819b99c43147af4db0'
redirect_uri='http://localhost:5000/callback'
scope = 'user-top-read playlist-modify-public '

cache_handler= FlaskSessionCacheHandler(session)
sp_oauth= SpotifyOAuth(
    client_id=cid,
    client_secret=secret,
    scope=scope,
    redirect_uri=redirect_uri,
    cache_handler=cache_handler,
    show_dialog=True) 
sp=Spotify(auth_manager=sp_oauth)
@app.route('/')
def home():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url=sp_oauth.get_authorize_url()
        return redirect(auth_url)
    return redirect(url_for('get_songs'))
@app.route('/callback')
def callback():
    sp_oauth.get_access_token(request.args['code'])
    return redirect(url_for('get_songs'))

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
    json_data = json.dumps(song_data, ensure_ascii=False)
    return Response(json_data, content_type='application/json; charset=utf-8')

if __name__=='__main__':
    app.run(debug=True)
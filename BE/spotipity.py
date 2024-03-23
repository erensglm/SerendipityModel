import os
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util

cid ="b962e9a2dfd84b49b1fb8be051f51580" 
secret = "abc4a22b37584663b76de6f37bb5dfcd"

os.environ['SPOTIPY_CLIENT_ID']= cid
os.environ['SPOTIPY_CLIENT_SECRET']= secret
os.environ['SPOTIPY_REDIRECT_URI']='http://localhost:8888/callback'
username = ""


client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret) 
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)


scope = 'user-top-read playlist-modify-public'

# Önceki json dosyasını sil(eğer varsa):
if os.path.exists('top50_data.json'):
    os.remove('top50_data.json')

# Önceki kullanıcı oturumunu temizle(eğer varsa):
if os.path.exists('.cache'):
    os.remove('.cache')

token = util.prompt_for_user_token(username, scope, client_id=cid, client_secret=secret, redirect_uri='http://localhost:8888/callback')

if token:
    sp = spotipy.Spotify(auth=token)
    results = sp.current_user_top_tracks(limit=5, offset=0, time_range='long_term')
    
    top_tracks_list = [] 
    
    for song in results['items']: 
        top_tracks_list.append(song) 
    
    # Yeni json dosyası oluşturmak için:
    with open('top50_data.json', 'w', encoding='utf-8') as f:
        json.dump(top_tracks_list, f, ensure_ascii=False, indent=4)  

else:
    print("Can't get token for", username)

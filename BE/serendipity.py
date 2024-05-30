import os
from collections import defaultdict
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from scipy.spatial.distance import cdist
from spotipy.cache_handler import FlaskSessionCacheHandler
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, session, request, redirect
import pickle
import time
app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(64)

# Firebase bağlantısı
cred = credentials.Certificate("./serendipity-0-firebase-adminsdk-14fzt-004a797afa.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Spotify kimlik bilgileri ve yetkilendirme ayarları
client_id = '9411dc2624284ba9a4ca325dc63ce651'
client_secret = 'fa29270bc22048819b99c43147af4db0'
redirect_uri = 'http://localhost:5000/callback'
scope = 'user-top-read playlist-modify-public playlist-modify-private user-read-email user-read-private '

# Spotify OAuth ve Spotify bağlantısı
cache_handler = FlaskSessionCacheHandler(session)
sp_oauth = SpotifyOAuth(
    client_id=client_id,
    client_secret=client_secret,
    scope=scope,
    redirect_uri=redirect_uri,
    cache_handler=cache_handler,
    show_dialog=True)
sp = Spotify(auth_manager=sp_oauth)
data = pd.read_csv("C:/Users/mteks/OneDrive/Masaüstü/python/SerendipityModel/Model/birlesmis_data.csv")
genre_data = pd.read_csv('C:/Users/mteks/OneDrive/Masaüstü/python/SerendipityModel/Model/data_by_genres.csv')
year_data = pd.read_csv('C:/Users/mteks/OneDrive/Masaüstü/python/SerendipityModel/Model/data_by_year.csv')

# KMeans ve PCA modellerinin yüklenmesi
with open('C:/Users/mteks/OneDrive/Masaüstü/python/SerendipityModel/Model/kmeans_model.sav', 'rb') as f:
    kmeans_model = pickle.load(f)

with open('C:/Users/mteks/OneDrive/Masaüstü/python/SerendipityModel/Model/pca_model.sav', 'rb') as f:
    pca_model = pickle.load(f)

# Eskimiş şarkıları silen fonksiyon
def delete_old_songs():
    songs_ref = db.collection('songs')
    if songs_ref.get():
        old_songs = db.collection('songs').stream()
        for song in old_songs:
            song.reference.delete()

    recommended_ref = db.collection('recommended')
    if recommended_ref.get():
        recommended_songs = db.collection('recommended').stream()
        for song in recommended_songs:
            song.reference.delete()


def find_song(name, year):
    song_data = defaultdict()
    results = sp.search(q=f'track:{name} year:{year}', limit=1)
    if results['tracks']['items'] == []:
        return None

    results = results['tracks']['items'][0]
    track_id = results['id']
    audio_features = sp.audio_features(track_id)[0]

    song_data['name'] = [name]
    song_data['year'] = [year]
    song_data['duration_ms'] = [results['duration_ms']]
    song_data['popularity'] = [results['popularity']]

    for key, value in audio_features.items():
        song_data[key] = value

    return pd.DataFrame(song_data)
number_cols = ['valence', 'year', 'acousticness', 'danceability', 'duration_ms', 'energy',
               'instrumentalness', 'key', 'liveness', 'loudness', 'mode', 'popularity', 'speechiness', 'tempo']
def get_song_data(song, spotify_data):
    try:
        song_data = spotify_data[(spotify_data['name'] == song['name'])
                                 & (spotify_data['year'] == song['year'])].iloc[0]
        if 'popularity' not in song_data:
            print('Warning: {} does not have "popularity" data'.format(song['name']))
            return None
        return song_data

    except IndexError:
        return find_song(song['name'], song['year'])

def get_mean_vector(song_list, spotify_data):
    song_vectors = []

    for song in song_list:
        song_data = get_song_data(song, spotify_data)
        if song_data is None:
            print('Warning: {} does not exist in Spotify or in the database'.format(song['name']))
            continue
        song_vector = song_data[number_cols].values
        if len(song_vector) != len(number_cols):
            print('Warning: {} has missing or incorrect features'.format(song['name']))
            continue
        song_vectors.append(song_vector)

    song_matrix = np.array(song_vectors)
    return np.mean(song_matrix, axis=0)

def flatten_dict_list(dict_list):
    flattened_dict = defaultdict()
    for key in dict_list[0].keys():
        flattened_dict[key] = []

    for dictionary in dict_list:
        for key, value in dictionary.items():
            flattened_dict[key].append(value)

    return flattened_dict

def recommend_songs(song_list, spotify_data, n_songs=100):
    metadata_cols = ['name', 'year', 'artists']
    song_dict = flatten_dict_list(song_list)

    song_center = get_mean_vector(song_list, spotify_data)
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(spotify_data[number_cols])
    scaled_song_center = scaler.transform(song_center.reshape(1, -1))
    distances = cdist(scaled_song_center, scaled_data, 'cosine')
    index = list(np.argsort(distances)[:, :n_songs][0])

    rec_songs = spotify_data.iloc[index]
    rec_songs = rec_songs[~rec_songs['name'].isin(song_dict['name'])]
    return rec_songs[metadata_cols].to_dict(orient='records')

# Ana sayfa ve yetkilendirme
@app.route('/')
def home():
    delete_old_songs()  # Her uygulama başladığında eski kayıtları temizle
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    return redirect('/get_songs')

# Firestore'dan önerilen şarkıları alıp Spotify çalma listesi oluşturma
@app.route('/create_playlist')
def create_playlist():
    collection_ref = db.collection('recommended')  # Firestore'daki koleksiyon adı
    track_uris = []
    playlist_name = 'Serendipity'

    # Firestore'dan belirli alanları içeren belgeleri çekme
    docs = collection_ref.get()

    for doc in docs:
        url = doc.to_dict().get('url')
        track_uris.append(url)
    
    # Spotify kullanıcı çalma listesi oluşturma
    playlist = sp.user_playlist_create(sp.current_user()['id'], playlist_name, public=False)
    sp.playlist_add_items(playlist['id'], track_uris)
    
    return("Playlist created and tracks added successfully!")

# Spotify yetkilendirme geri dönüşü
@app.route('/callback')
def callback():
    sp_oauth.get_access_token(request.args['code'])
    return redirect('/get_songs')

# En sevilen şarkıları alma ve Firestore'a kaydetme
@app.route('/get_songs')
def get_songs():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)

    results = sp.current_user_top_tracks(limit=10, offset=0, time_range='long_term')
    song_data = []
    for i, song in enumerate(results['items']):
        song_info = {'id': i, 'name': song['name'], 'year': song['album']['release_date'][:4]}
        
        # Sanatçı bilgilerini al
        artists = [artist['name'] for artist in song['artists']]
        song_info['artists'] = artists

        # Spotify API'den ses özelliklerini al
        audio_features = sp.audio_features(song['id'])[0]
        song_info.update(audio_features)

        song_info['popularity'] = song['popularity']
        song_info['url'] = song['external_urls']['spotify']

        song_data.append(song_info)

        doc_ref = db.collection('songs').document()
        doc_ref.set(song_info)
       
    time.sleep(2)
    return redirect('/predict')

# Öneri algoritması
@app.route('/predict')
def predict():
    all_song_list = []  # Tüm şarkıların listesi
    docs = db.collection('songs').limit(10).stream()
    for doc in docs:
        song_data = doc.to_dict()
        yearD = song_data.get('year')
        nameD = song_data.get('name')
        yearD = int(yearD)

        # Her bir döngü adımında şarkıyı all_song_list'e ekleyin
        all_song_list.append({'name': nameD, 'year': yearD})
    request_data = all_song_list
    def get_song_url(name, year):
    # Şarkıyı Spotify'da arayın
        query1 = f"track:{name} year:{year}"
        results1 = sp.search(q=query1, limit=1)

    # Sonuçlar varsa, ilk sonucu alın
        if results1['tracks']['items']:
            track_info1 = results1['tracks']['items'][0]
            track_url1 = track_info1['external_urls']['spotify']
            return track_url1
        else:
            return None
    # Tüm şarkıları tek seferde recommend_songs fonksiyonuna gönderin
    recommendations = recommend_songs(all_song_list, data)

    recommended_names = set()  # Tekrar eden isimleri izlemek için bir küme oluştur
    id_counter = 0  # id değerlerini izlemek için bir sayaç oluştur
    for recommendation in recommendations:
        song_url = get_song_url(recommendation['name'], recommendation['year'])
        if recommendation['name'] not in recommended_names and song_url is not None:
            song_info = {'id': id_counter,
                         'name': recommendation['name'],
                         'year': recommendation['year'],
                         'url': song_url}
            recommended_names.add(recommendation['name'])  # Tekrar eden isimleri izleme
            doc_ref = db.collection('recommended').document(str(id_counter))  # 'id' değeri olarak id_counter kullanılıyor
            doc_ref.set(song_info)
            id_counter += 1  # Bir sonraki id için sayaçı artır
    return "Prediction Completed"   

# Uygulamayı çalıştırma
if __name__ == '__main__':
    delete_old_songs()
    app.run(debug=True)

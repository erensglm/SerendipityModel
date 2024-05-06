import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDOtvven2KQD9e1pb9mgQUU1qtZsj9TwHM",
    authDomain: "serendipity-0.firebaseapp.com",
    databaseURL: "https://serendipity-0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "serendipity-0",
    storageBucket: "serendipity-0.appspot.com",
    messagingSenderId: "308753367961",
    appId: "1:308753367961:web:1c668fbaae58963f1c0908",
    measurementId: "G-7L3GY2TL5K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

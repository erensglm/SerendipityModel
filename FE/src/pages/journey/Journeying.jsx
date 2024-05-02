import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

function Journeying() {
  const [data, setData] = useState([]);

  useEffect(() => {
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

    const fetchData = async () => {
      const songsCollectionRef = collection(db, 'songs');
      const snapshot = await getDocs(songsCollectionRef);
      const songsData = snapshot.docs.map(doc => doc.data());
      setData(songsData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="result-title">The result of your journey</div>
      <Link className="left-arrow" to="/">
        <FontAwesomeIcon icon={faLongArrowAltLeft} />
      </Link>
      <ol>
        {data.map((item, index) => (
          <li key={index}>
            <a className="arrow" href={item.url} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLongArrowAltRight} />
              {item.artists.join(', ')} - {item.name} ({item.year})
            </a>
          </li>
        ))}
      </ol>
      <ol>
        <li>
          <br />
          <Link className="arrow" to={`/`}>
            Click to create playlist with more.
            <FontAwesomeIcon icon={faLongArrowAltRight} />
          </Link>
        </li>
      </ol>
    </div>
  );
}

export default Journeying;

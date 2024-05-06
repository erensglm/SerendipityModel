import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { db } from "./firebase";

function Journeying() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const songsCollectionRef = collection(db, 'recommended');
      const snapshot = await getDocs(songsCollectionRef);
      const songsData = snapshot.docs.slice(0, 5).map(doc => doc.data());
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
              {item.name} ({item.year})
            </a>
          </li>
        ))}
      </ol>
      <ol>
        <li>
          <br />
          <Link className="arrow" to={`http://127.0.0.1:5000/create_playlist`}>
            Click to create playlist with more.
            <FontAwesomeIcon icon={faLongArrowAltRight} />
          </Link>
        </li>
      </ol>
    </div>
  );
}

export default Journeying;

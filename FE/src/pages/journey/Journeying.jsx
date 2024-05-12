import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function LoadingAnimation() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots === '...') return '.';
        else if (prevDots === '..') return '...';
        else return '..';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <p>We are working on{dots}</p>;
}

function Journeying() {
  const [tryCount, setTryCount] = useState(0); 
  const [showMessage, setShowMessage] = useState(false);
  const intervalTime = 7000;

  const redirectToResultsPage = async () => {
    const songsCollectionRef = collection(db, 'recommended');
    const snapshot = await getDocs(songsCollectionRef);


    if (!snapshot.empty || tryCount >= 3) {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
      setShowMessage(true);
    } else {
      console.log('it will try again.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTryCount(prevCount => prevCount + 1); 
      console.log('Try count:', tryCount + 1);
      redirectToResultsPage(); 
    }, intervalTime);

    return () => clearInterval(interval); 
  }, [tryCount]); 

  useEffect(() => {
    if (showMessage) {
      const redirectTimeout = setTimeout(() => {
        console.log('Something happened.');
        window.location.href = '/results';
      }, 2000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [showMessage]);

  return (
    <div className='spotify'>
      {showMessage && <div className='spotify'>Something happened</div>}
      {!showMessage && <LoadingAnimation />}
    </div>
  );
}

export default Journeying;

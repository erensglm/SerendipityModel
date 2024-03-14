import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

function Journey() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  return (
    <div>
      <Link className="left-arrow" to="/">
        <FontAwesomeIcon icon={faLongArrowAltLeft} />
      </Link>
     
      <div className='spotify' onClick={handleClick}>
        {isLoading ? (
          <div className="loading-animation">
            Connecting
            <LoadingDots />
          </div>
        ) : (
          <>
            <FontAwesomeIcon icon={faLongArrowAltRight} /> 
            <span>Login with Spotify</span>
            <FontAwesomeIcon icon={faLongArrowAltLeft} />
          </>
        )}
      </div>
    </div>
  );
}

const LoadingDots = () => {
  const [dots, setDots] = useState('');

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setDots(prevDots => prevDots === '...' ? '' : prevDots + '.');
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return <span>{dots}</span>;
};

export default Journey;

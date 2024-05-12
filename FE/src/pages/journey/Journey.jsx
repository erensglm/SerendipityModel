import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from "@fortawesome/free-solid-svg-icons";

function Journey() {
  const [isLoading, setIsLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false); 

  const handleClick = async () => {
    setIsLoading(true);
    setTransitioning(true);

    const popup = window.open("http://localhost:5000/get_songs", "_blank");

    const intervalId = setInterval(() => {
      if (popup.closed) {
        clearInterval(intervalId);
        setIsLoading(false);
        setTransitioning(false); 
      }
    }, 2000);
  };

  return (
    <div>
      <Link className="left-arrow" to="/">
        <FontAwesomeIcon icon={faLongArrowAltLeft} />
      </Link>

      <div className="spotify" onClick={handleClick}>
        {isLoading && (
          <div className="loading-animation">
            Connecting
            <LoadingDots />
          </div>
        )}
        {!isLoading && !transitioning && ( 
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
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => (prevDots === "..." ? "" : prevDots + "."));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return <span>{dots}</span>;
};

export default Journey;

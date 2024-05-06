import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from "@fortawesome/free-solid-svg-icons";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from "./firebase";

function Journey() {
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      console.log("Deneme no:", retryCount);
      const recommendedRef = collection(db, 'recommended');
      const recommendedSnapshot = await getDocs(recommendedRef);
      if (!recommendedSnapshot.empty) {
        clearInterval(intervalId); // Stop the interval if data found
        window.location.href = "/journeying";
      } else {
        console.log("No recommended data found.");
        setRetryCount(prevRetryCount => prevRetryCount + 1); // Increment the retry count
      }
    }, 7000); // 7 seconds interval

    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  }, [retryCount]); // Dependency array includes retryCount to re-run effect when it changes

  const handleClick = async () => {
    setIsLoading(true);
    window.open("http://127.0.0.1:5000", "_blank");
  };

  return (
    <div>
      <Link className="left-arrow" to="/">
        <FontAwesomeIcon icon={faLongArrowAltLeft} />
      </Link>

      <div className="spotify" onClick={handleClick}>
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

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft, faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";

function Journey() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      const popup = window.open("http://localhost:5000/get_songs", "_blank");

      const checkPopup = () => {
        if (popup.closed) {
          setIsLoading(false);
          navigate("/journeying");
        }
      };

      const intervalId = setInterval(checkPopup, 2000);


      return () => {
        clearInterval(intervalId);
        popup.close();
      };
    }
  }, [isLoading, navigate]);

  return (
    <div>
      <Link className="left-arrow" to="/">
        <FontAwesomeIcon icon={faLongArrowAltLeft} />
      </Link>

      <div className="spotify" onClick={() => setIsLoading(true)}>
        {isLoading ? (
          <div className="loading-animation">
            Connecting<LoadingDots />
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

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => (prevDots === "..." ? "" : prevDots + "."));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return <span>{dots}</span>;
};

export default Journey;

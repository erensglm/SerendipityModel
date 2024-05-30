import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import "../../App.css"

const Home = () => {
  return (
    <div className="home-container">
      <div className="title">SERENDIPITY</div>
      <ol>
        <li>
          <Link className="arrow" to="/journey">
            <FontAwesomeIcon icon={faLongArrowAltRight} /> 
            Start the Journey
          </Link>
        </li>
        <li>
          <Link className="arrow" to="/serendipity">
            <FontAwesomeIcon icon={faLongArrowAltRight} /> 
            What is Serendipity?
          </Link>
        </li>
        <li>
          <Link className="arrow" to="/about">
            <FontAwesomeIcon icon={faLongArrowAltRight} /> 
            Who are we?
          </Link>
        </li>
      </ol>
    </div>
  );
}

export default Home;

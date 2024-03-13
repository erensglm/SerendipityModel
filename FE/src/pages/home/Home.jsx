import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import "../../App.css"

const Home = () => {
  return (
    <ol>
      <li>
        <Link className="arrow" to="/journey"> {/* Link componentini kullanarak "/journey" sayfasına yönlendirme */}
          <FontAwesomeIcon icon={faLongArrowAltRight} /> 
          Login with spotify
        </Link>
      </li>
      <li>
        <Link className="arrow" to="/serendipity"> {/* Link componentini kullanarak "/serendipity" sayfasına yönlendirme */}
          <FontAwesomeIcon icon={faLongArrowAltRight} /> 
          What is the Serendipity?
        </Link>
      </li>
      <li>
        <Link className="arrow" to="/about"> {/* Link componentini kullanarak "/about" sayfasına yönlendirme */}
          <FontAwesomeIcon icon={faLongArrowAltRight} /> 
          Who are we?
        </Link>
      </li>
    </ol>
  );
}

export default Home;

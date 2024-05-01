import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

function Journeying() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_all_songs');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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
            <a className="arrow" href={`http://localhost:5000/get_songs/${index}`}>
              <FontAwesomeIcon icon={faLongArrowAltRight} />
              
              {item.name} ({item.year})
            </a>
          </li>
          
        ))}
      </ol>
      <ol>
        <li>
          <br />
        <a className="arrow" href={`/`}> Click to create playlist with more.
              <FontAwesomeIcon icon={faLongArrowAltRight} />
            </a>
        </li>
      </ol>
    </div>
  );
}

export default Journeying;

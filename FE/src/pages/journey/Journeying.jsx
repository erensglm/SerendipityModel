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
        const responses = await Promise.all(
          Array.from({ length: 5 }, (_, index) =>
            axios.get(`http://localhost:3030/${index}`)
          )
        );

        const responseData = responses.map(response => response.data);
        setData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
        <div className="result-title"> the result of your journey</div>
      <Link className="left-arrow" to="/">
        <FontAwesomeIcon icon={faLongArrowAltLeft} />
      </Link>
      <ol>
        {data.map((item, index) => (
          <li key={index}>
            <a className="arrow" href={`http://localhost:3030/${index}`}>
              <FontAwesomeIcon icon={faLongArrowAltRight} />
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Journeying;

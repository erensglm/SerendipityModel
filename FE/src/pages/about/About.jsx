import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';


function About() {
  return (
<div>
      <Link className="left-arrow" to="/">
        <FontAwesomeIcon icon={faLongArrowAltLeft} />
      </Link>
      <ol>
        <li>
          <a className="arrow" href="https://github.com/m-ensr">
            <FontAwesomeIcon icon={faLongArrowAltRight} />
            Mustafa Ensar Özdemir
          </a>
        </li>
        <li>
          <a className="arrow" href="https://github.com/erensglm">
            <FontAwesomeIcon icon={faLongArrowAltRight} />
            Emin Eren Sağlam
          </a>
        </li>
        <li>
          <a className="arrow" href="https://github.com/mteksahin">
            <FontAwesomeIcon icon={faLongArrowAltRight} />
            Mehmet Emin Tekşahin
          </a>
        </li>
      </ol>
    </div>
  )
}

export default About
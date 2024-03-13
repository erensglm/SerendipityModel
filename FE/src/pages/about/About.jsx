import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';


function About() {
  return (
    
    <div>
    <Link className="left-arrow" to="/"> 
      <FontAwesomeIcon icon={faLongArrowAltLeft} />
    </Link>
    <div>bu sayfada bizden bahsedecek</div>
  </div>
  )
}

export default About
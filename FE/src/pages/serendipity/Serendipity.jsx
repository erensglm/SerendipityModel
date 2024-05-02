import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';


function Serendipity() {
  return (
    
    <div>
    <Link className="left-arrow" to="/"> 
      <FontAwesomeIcon icon={faLongArrowAltLeft} />
    </Link>
    <div className='serendipity_cssontent'> some info about project
    </div>
  </div>
  )
}

export default Serendipity
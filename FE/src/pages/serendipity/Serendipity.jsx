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
    <div>projenin çalışma prensibi açıklanacak vs. amaç, çalışma şekli blabla
    </div>
  </div>
  )
}

export default Serendipity
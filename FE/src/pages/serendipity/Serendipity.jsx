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
    <div className='serendipity_cssontent'> Serendipity is an AI model interface trained with a lot of data (we're talking about 1,000,000 songs).
As soon as you give permission, your most listened to songs are taken from Spotify and presented to this model.
The model, which we assume is sufficiently trained, takes these songs as parameters and finds song suggestions that we hope it has not heard before.
<br/>If you're a good enough listener, you can even create a playlist of these songs.
    </div>
  </div>
  )
}

export default Serendipity
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

function Journey() {
  return (
    <div>
      <Link className="left-arrow" to="/"> {/* left-arrow sınıfını kullanarak sol üst köşede bulunan ok */}
        <FontAwesomeIcon icon={faLongArrowAltLeft} />
      </Link>
      <div>projenin çalıştığı kısım, spotify yönlendirmesi falan yapılacak</div>
    </div>
  );
}

export default Journey;

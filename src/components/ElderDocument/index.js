import React from 'react';

import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './elder-document.scss';

const ElderDocument = (props) => {
  return (
    <button
      style={styles}
      className='elder-document'
      onClick={props.selectedOnClick}
    >
      <FontAwesomeIcon className='elder-document-icon' icon={faFile} />

      <span className='elder-document-text d-block'>
        {props.documentName.length < 15
          ? props.documentName
          : `${props.documentName.substr(0, 15)}...`}
      </span>
    </button>
  );
};

export default ElderDocument;

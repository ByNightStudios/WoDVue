import React from 'react';

import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './elder-directory.scss';

const ElderDirectory = (props) => {
  return (
    <button
      style={styles}
      className={
        props.selectedDirectory === props.directoryData.id
          ? 'elder-directory elder-directory--active'
          : 'elder-directory'
      }
      onClick={() =>
        props.selectedOnClick(
          props.directoryData.id,
          props.directoryData.name,
          props.directoryData.system
        )
      }
    >
      <FontAwesomeIcon className='elder-directory-icon' icon={faFolder} />
      <span className='elder-directory-text d-block text-center'>
        {props.directoryName.length < 15
          ? props.directoryName
          : `${props.directoryName.substr(0, 15)}...`}
      </span>
    </button>
  );
};

export default ElderDirectory;

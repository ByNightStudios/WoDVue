import React from 'react';

import styles from './sub-header.scss';

const SubHeader = props => {
  return (
    <div className='internal-header' style={styles}>
      <div className='internal-header-left'>{props.leftChildren}</div>
      <div className='internal-header-right'>{props.rightChildren}</div>
    </div>
  );
};

export default SubHeader;

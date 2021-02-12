import React from 'react';

import Loader from '../../assets/images/icons/loader.svg';

import styles from './page-loader.scss';

const PageLoader = props => {
  return (
    <div
      className='page-loader d-flex align-items-center justify-content-center'
      style={styles}
    >
      <div className='flex-wrapper text-center'>
        <img src={Loader} className='page-loader-asset' alt='Loading' />
        <h5 className='page-loader-text'>Loading. Please wait...</h5>
      </div>
    </div>
  );
};

export default PageLoader;

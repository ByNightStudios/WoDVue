/**
 *
 * Loader
 *
 */

import React from 'react';
import Lottie from 'react-lottie';
import * as animationData from '../../assests/31797-lost-animation.json';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import './style.css';

function Loader() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
      }}
    >
      <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100">
        <Lottie
          options={defaultOptions}
          height={300}
          width={300}
          isStopped={false}
          isPaused={false}
        />
      </div>
    </div>
  );
}

Loader.propTypes = {};

export default Loader;

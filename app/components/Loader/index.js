/**
 *
 * Loader
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import './style.css';

function Loader() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ width: '100vw', height: '100vh' }}
    >
      <div id="loading" />
    </div>
  );
}

Loader.propTypes = {};

export default Loader;

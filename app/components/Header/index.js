/* eslint-disable jsx-a11y/anchor-has-content */
/**
 *
 * Header
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function Header() {
  return (
    <div id="nav" className="navbar" style={{ width: '100%' }}>
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <a href="/vampire" className="btn-vampire">
          Vampire the Masquerade
        </a>
        <a href="/" className="logo" active="" />
      </div>
    </div>
  );
}

Header.propTypes = {};

export default Header;

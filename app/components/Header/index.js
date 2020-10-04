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
      <div className="container">
        <a href="/WoDVue/monsters/vampire" className="btn-vampire">
          Vampire the Masquerade
        </a>
        <a href="/WoDVue/monsters/werewolf" className="btn-werewolf">
          Werewolf the Apocalypse
        </a>
      </div>
    </div>
  );
}

Header.propTypes = {};

export default Header;

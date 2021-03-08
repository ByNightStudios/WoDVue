/* eslint-disable jsx-a11y/anchor-has-content */
/**
 *
 * Footer
 *
 */

import React from 'react';
// import FooterLogo from '../../images/logoNS.png';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function Footer() {
  return (
    <footer className="page-footer font-small blue pt-4 w-100  d-flex align-items-center justify-content-center">
      <div id="wrapper-footer" style={{ width: '100%' }}>
        <div id="menu-footer" className="navbar">
          <div className="container w-100">
            <a href="/" className="logo logoNS router-link-active" active="" />
            <a href="/" className="router-link-active btn-vampire">
              Vampire the Masquerade
            </a>
            <a href="/werewolf" className="btn-werewolf">
              Werewolf the Apocalypse
            </a>
          </div>
        </div>
        <div className="footer-copyright text-center">
          <div className="container">
            <a href="https://www.bynightstudios.com/">By Night Studios</a> |{' '}
            <span>Worldofdarkness - 2020</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {};

export default Footer;

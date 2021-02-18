/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * Header_1
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { includes } from 'lodash';
import history from 'utils/history';
import LogoWOD from 'images/LogoWOD.svg';
import VampireLogo from 'images/VampireLogo.svg';

function Header_1() {
  const {
    location: { pathname },
  } = history;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top navbarHeader">
      <div className="container">
        <div className="row">
          <div className="col-md-3 boxLogos">
            <a className="navbar-brand" href="/">
              <img src={LogoWOD} />
            </a>
            <a className="navbar-brand brand-section" href="#">
              <img src={VampireLogo} />
            </a>
          </div>
          <div className="col-md-9">
            <div className="navbar navbarUpper" id="navbarUpper">
              <ul className="navbar-nav ml-auto navbarSocial">
                <li className="nav-item">
                  <a
                    className="nav-link fa fa-facebook-square"
                    href="#"
                    title="Facebook"
                  />
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link fa fa-twitter-square"
                    href="#"
                    title="Twitter"
                  />
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link fa fa-camera-retro"
                    href="#"
                    title="Instagram"
                  />
                </li>
              </ul>

              <ul className="navbar-nav ml-0 navbarAccount">
                <li className="nav-item active">
                  <a className="nav-link" href="#">
                    Sign In
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Register
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-12">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse navbarBottom"
              id="navbarResponsive"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      includes([pathname], '/WoDVue/monsters/vampire/clan')
                        ? 'active'
                        : null
                    }`}
                    href="/WoDVue/monsters/vampire/clan/Baali"
                  >
                    Clans & Bloodlines
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/Disciplines' ? 'active' : null
                    }`}
                    href="/Disciplines"
                  >
                    Disciplines
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Techniques
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/Skills' ? 'active' : null
                    }`}
                    href="/Skills"
                  >
                    Skills
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/Merits' ? 'active' : null
                    }`}
                    href="/Merits"
                  >
                    Merits
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/Flaws' ? 'active' : null
                    }`}
                    href="/Flaws"
                  >
                    Flaws
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/Attributes' ? 'active' : null
                    }`}
                    href="/Attributes"
                  >
                    Attributes
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/Backgrounds' ? 'active' : null
                    }`}
                    href="/Backgrounds"
                  >
                    Backgrounds
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

Header_1.propTypes = {};

export default memo(Header_1);

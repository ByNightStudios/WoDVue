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
import Search from 'containers/Search';
// import LogoWOD from 'images/LogoWOD.svg';
import VampireLogo from 'images/VampireLogo.svg';
import LogoWOD from '../../images/newLogo.png';
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
              <img src={LogoWOD} alt="nightStudio" />
            </a>
          </div>
          <div className="col-md-9">
            <div className="navbar navbarUpper" id="navbarUpper">
              <ul className="navbar-nav ml-auto mr-auto navbarExtra hideMobile">
                <li className="nav-item">
                  <a className="nav-link" href="/QuickStart" title="QuickStart">
                    QuickStart
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Backers" title="Backers">
                    Backers
                  </a>
                </li>
                {/* <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/Contributors"
                    title="Contributors"
                  >
                    Contributors
                  </a>
                </li> */}
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/SupportUs"
                    title="Contributors"
                  >
                    Support Us
                  </a>
                </li>
              </ul>
              <ul className="navbar-nav navbarSocial">
                <li className="nav-item">
                  <a
                    className="nav-link fa fa-facebook-square"
                    href="https://www.facebook.com/ByNightStudios"
                    title="Facebook"
                  />
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link fa fa-twitter-square"
                    href="https://twitter.com/ByNightStudios"
                    title="Twitter"
                  />
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link fa fa-camera-retro"
                    href="https://www.instagram.com/bynightstudios/"
                    title="Instagram"
                  />
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
              <ul className="navbar-nav ml-auto mr-auto navbarExtra showMobile">
                <li className="nav-item">
                  <a className="nav-link" href="/QuickStart" title="QuickStart">
                    QuickStart
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Backers" title="Backers">
                    Backers
                  </a>
                </li>
                {/* <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/Contributors"
                    title="Contributors"
                  >
                    Contributors
                  </a>
                </li> */}
              </ul>
              <ul className="navbar-nav ml-auto">
                {/* <li>
                  <Search />
                </li> */}
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      includes([pathname], '/vampire/clan/') ? 'active' : null
                    }`}
                    href="/vampire/clan/"
                  >
                    Clans
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/vampire/Disciplines/' ? 'active' : null
                    }`}
                    href="/vampire/Disciplines/"
                  >
                    Disciplines
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/vampire/Rituals' ? 'active' : null
                    }`}
                    href="/vampire/Rituals"
                  >
                    Rituals
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/vampire/Techniques/' ? 'active' : null
                    }`}
                    href="/vampire/Techniques/"
                  >
                    Techniques
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/vampire/Skills' ? 'active' : null
                    }`}
                    href="/vampire/Skills"
                  >
                    Skills
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/vampire/Merits' ? 'active' : null
                    }`}
                    href="/vampire/Merits"
                  >
                    Merits
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/vampire/Flaws' ? 'active' : null
                    }`}
                    href="/vampire/Flaws"
                  >
                    Flaws
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/vampire/Library' ? 'active' : null
                    }`}
                    href="/vampire/Library"
                  >
                    Library
                  </a>
                </li>
                {/* <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/vampire/Attributes' ? 'active' : null
                    }`}
                    href="/vampire/Attributes"
                  >
                    Attributes
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      pathname === '/vampire/Backgrounds' ? 'active' : null
                    }`}
                    href="/vampire/Backgrounds"
                  >
                    Backgrounds
                  </a>
                </li> */}
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

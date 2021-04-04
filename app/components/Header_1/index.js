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
import { NavLink } from 'react-router-dom';

import Search from 'containers/Search';
import LogoWOD from '../../images/newLogo.png';
function Header_1() {
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
                <li>
                  <Search />
                </li>
                <li className="nav-item">
                  <NavLink
                    activeClassName="nav-link active"
                    to="/vampire/clan/"
                    className="nav-link"
                  >
                    Clans
                    <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    activeClassName="nav-link active"
                    to="/vampire/Disciplines/"
                    className="nav-link"
                  >
                    Disciplines
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    activeClassName="nav-link active"
                    to="/vampire/Rituals"
                    className="nav-link"
                  >
                    Rituals
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    activeClassName="nav-link active"
                    to="/vampire/Techniques/"
                    className="nav-link"
                  >
                    Techniques
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    activeClassName="nav-link active"
                    to="/vampire/Skills"
                    className="nav-link"
                  >
                    Skills
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    activeClassName="nav-link active"
                    to="/vampire/Merits"
                    className="nav-link"
                  >
                    Merits
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    activeClassName="nav-link active"
                    to="/vampire/Flaws"
                    className="nav-link"
                  >
                    Flaws
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    activeClassName="nav-link active"
                    to="/vampire/Library"
                    className="nav-link"
                  >
                    Library
                  </NavLink>
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

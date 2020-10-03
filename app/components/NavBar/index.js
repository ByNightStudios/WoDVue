/**
 *
 * NavBar
 *
 */

import React from 'react';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg" id="monsterContentTypesNav">
      <a className="navbar-brand" href="/demo">
        Navbar
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
    </nav>
  );
}

NavBar.propTypes = {};

export default NavBar;

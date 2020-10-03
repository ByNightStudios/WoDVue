/**
 *
 * NavBar
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function NavBar() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

NavBar.propTypes = {};

export default NavBar;

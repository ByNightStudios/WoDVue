/**
 *
 * Footer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Footer() {
  return (
    <footer className="page-footer font-small blue pt-4">
      <FormattedMessage {...messages.header} />
    </footer>
  );
}

Footer.propTypes = {};

export default Footer;

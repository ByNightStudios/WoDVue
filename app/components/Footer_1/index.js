/**
 *
 * Footer_1
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Footer_1() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

Footer_1.propTypes = {};

export default memo(Footer_1);

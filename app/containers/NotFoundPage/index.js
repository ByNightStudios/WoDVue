/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import history from 'utils/history';
import messages from './messages';

export default function NotFound() {
  useEffect(() => {
    history.push('/');
  }, []);
  return (
    <h1>
      <FormattedMessage {...messages.header} />
    </h1>
  );
}

/*
 * DemoApiSaga Messages
 *
 * This contains all the text for the DemoApiSaga container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.DemoApiSaga';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the DemoApiSaga container!',
  },
});

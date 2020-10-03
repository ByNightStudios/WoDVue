/*
 * Monster Messages
 *
 * This contains all the text for the Monster container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Monster';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Monster container!',
  },
});

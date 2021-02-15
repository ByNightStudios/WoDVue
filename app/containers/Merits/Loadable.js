/**
 *
 * Asynchronously loads the component for Merits
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

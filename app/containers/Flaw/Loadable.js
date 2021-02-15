/**
 *
 * Asynchronously loads the component for Flaw
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

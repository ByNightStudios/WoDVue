/**
 *
 * Asynchronously loads the component for QuickStart
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

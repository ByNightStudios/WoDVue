/**
 *
 * Asynchronously loads the component for OpsContainer
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

/**
 *
 * Asynchronously loads the component for Disciplines
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

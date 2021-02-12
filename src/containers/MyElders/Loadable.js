/**
 *
 * Asynchronously loads the component for MyElders
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

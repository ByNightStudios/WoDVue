/**
 *
 * Asynchronously loads the component for SocialTab
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

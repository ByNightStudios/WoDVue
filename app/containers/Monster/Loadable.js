/**
 *
 * Asynchronously loads the component for Root
 *
 */

import React from 'react';
import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "Root" */ './index'),
  loading: () => <div />,
  render: (loaded, props) => {
    const Component = loaded.default;
    return <Component {...props} />;
  },
});

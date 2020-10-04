/**
 *
 * Asynchronously loads the component for Root
 *
 */

import React from 'react';
import Loadable from 'react-loadable';
import LoadableLoading from 'components/Loader';

export default Loadable({
  loader: () => import(/* webpackChunkName: "Root" */ './index'),
  loading: () => <LoadableLoading />,
  render: (loaded, props) => {
    const Component = loaded.default;
    return <Component {...props} />;
  },
});

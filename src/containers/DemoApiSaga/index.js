/**
 *
 * DemoApiSaga
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectDemoApiSaga from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { demoAction } from './actions';

export function DemoApiSaga({ apiCall, demoApiSaga: { loading, demo } }) {
  useInjectReducer({ key: 'demoApiSaga', reducer });
  useInjectSaga({ key: 'demoApiSaga', saga });

  useEffect(() => {
    apiCall();
  }, []);

  return (
    <div>
      <Helmet>
        <title>DemoApiSaga</title>
        <meta name="description" content="Description of DemoApiSaga" />
      </Helmet>
      {demo.title}
      <FormattedMessage {...messages.header} />
    </div>
  );
}

DemoApiSaga.propTypes = {
  dispatch: PropTypes.func.isRequired,
  apiCall: PropTypes.func,
  demoApiSaga: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  demoApiSaga: makeSelectDemoApiSaga(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    apiCall: () => dispatch(demoAction()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
)(DemoApiSaga);

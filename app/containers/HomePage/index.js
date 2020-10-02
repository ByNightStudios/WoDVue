/**
 *
 * HomePage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { groupBy } from 'lodash';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import Loader from 'components/Loader';
import { getData } from 'containers/App/actions';

import makeSelectHomePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function HomePage({ onRequestData, homePage }) {
  useInjectReducer({ key: 'homePage', reducer });
  useInjectSaga({ key: 'homePage', saga });

  const {
    contentful: { hasMore, loading, data },
  } = homePage;

  useEffect(() => {
    if (hasMore) {
      onRequestData();
    }
  });

  if (loading && hasMore) {
    return <Loader />;
  }

  console.log(groupBy(data, 'technique'));
  return (
    <div>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="Description of HomePage" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

HomePage.propTypes = {
  onRequestData: PropTypes.func,
  homePage: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onRequestData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HomePage);

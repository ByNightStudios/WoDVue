/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * HomePage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import Loader from 'components/Loader';
import { getData } from 'containers/App/actions';

import Header from 'components/Header/Loadable';
import Footer from 'components/Footer/Loadable';

import makeSelectHomePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.css';

export function HomePage({ onRequestData, homePage }) {
  useInjectReducer({ key: 'homePage', reducer });
  useInjectSaga({ key: 'homePage', saga });

  const {
    contentful: { hasMore, loading },
  } = homePage;

  useEffect(() => {
    if (hasMore) {
      onRequestData();
    }
  });

  if (loading && hasMore) {
    return <Loader />;
  }

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-between w-100"
      style={{ height: '100vh' }}
    >
      <Helmet>
        <title>{`World of Darkness - MET - Vampire`}</title>
        <meta name="description" content="Description of HomePage" />
      </Helmet>
      <Header />
      <div className="container d-flex flex-column align-items-start justify-content-center w-100 h-100">
        <div data-v-59e17c94="" className="welcome">
          Welcome
        </div>
        <a
          role="button"
          tabIndex="0"
          href="#"
          target="_self"
          className="btn btn-primary"
        >
          Learn More
        </a>
      </div>
      <Footer />
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
    // onRequestData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HomePage);

/**
 *
 * ClanPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Header from 'components/Header_1';
import Footer from 'components/Footer_1';

import makeSelectClanPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function ClanPage() {
  useInjectReducer({ key: 'clanPage', reducer });
  useInjectSaga({ key: 'clanPage', saga });

  return (
    <div>
      <Helmet>
        <title>ClanPage</title>
        <meta name="description" content="Description of ClanPage" />
      </Helmet>
      <Header />
      <FormattedMessage {...messages.header} />
      <Footer />
    </div>
  );
}

ClanPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  clanPage: makeSelectClanPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClanPage);

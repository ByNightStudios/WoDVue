/**
 *
 * Monster
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import Header from 'components/Header';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';

import makeSelectMonster from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { getDropDownItems } from './actions';

export function Monster({ OnRequestDropDownItems, monster }) {
  useInjectReducer({ key: 'monster', reducer });
  useInjectSaga({ key: 'monster', saga });

  const { loading, data } = monster;

  return (
    <div className="d-flex flex-column align-items-center justify-content-between w-100 h-100">
      <Helmet>
        <title>Monster</title>
        <meta name="description" content="Description of Monster" />
      </Helmet>
      <div style={{ width: '100% ' }}>
        <Header />
        <NavBar
          OnRequestDropDownItems={OnRequestDropDownItems}
          loading={loading}
          data={data}
        />
      </div>
      <FormattedMessage {...messages.header} />
      <Footer />
    </div>
  );
}

Monster.propTypes = {
  match: PropTypes.object,
  OnRequestDropDownItems: PropTypes.func,
  monster: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  monster: makeSelectMonster(),
});

function mapDispatchToProps(dispatch) {
  return {
    OnRequestDropDownItems: params => dispatch(getDropDownItems(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Monster);

/**
 *
 * App
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import Monster from 'containers/Monster/index';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import ClanPage from 'containers/ClanPage/Loadable';

import bgImage from '../../images/bg.4daf1f93.jpg';

import makeSelectApp from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getData } from './actions';

export function App() {
  useInjectReducer({ key: 'app', reducer });
  useInjectSaga({ key: 'app', saga });

  return (
    <div>
      <Helmet>
        <title>World of darkness</title>
        <meta name="description" content="Description of App" />
      </Helmet>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/WoDVue/monsters/vampire1" component={Monster} />
        <Route path="/WoDVue/monsters/vampire/" component={ClanPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

App.propTypes = {
  ...App,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
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

export default compose(withConnect)(App);

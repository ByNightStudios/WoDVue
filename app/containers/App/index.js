/**
 *
 * App
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { Switch, Route } from 'react-router-dom';

import WoVueHomePage from 'containers/WoVueHomePage/Loadable';
import Disciplines from 'containers/Disciplines/Loadable';
import DisciplinesDetails from 'containers/DisciplinesDetails/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import ClanPage from 'containers/ClanPage/Loadable';

import Header from 'components/Header_1';
import Footer from 'components/Footer_1';

import makeSelectApp from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getData } from './actions';

export function App() {
  useInjectReducer({ key: 'app', reducer });
  useInjectSaga({ key: 'app', saga });

  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={WoVueHomePage} />
        <Route exact path="/Disciplines" component={Disciplines} />
        <Route exact path="/Disciplines/:id" component={DisciplinesDetails} />
        <Route path="/WoDVue/monsters/vampire/clan/:id" component={ClanPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <Footer />
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

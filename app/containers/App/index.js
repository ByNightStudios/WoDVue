/**
 *
 * App
 *
 */

import React, { useEffect } from 'react';
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
import Flaw from 'containers/Flaw/Loadable';
import Merits from 'containers/Merits/Loadable';
import ClanPage from 'containers/ClanPage/Loadable';
import Attribute from 'containers/Attributes/Loadable';
import Backgrounds from 'containers/Backgrounds/Loadable';
import Skills from 'containers/Skills/Loadable';
import Techniques from 'containers/Techniques/Loadable';

import Header from 'components/Header_1';
import Footer from 'components/Footer_1';

import makeSelectApp from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getData } from './actions';

export function App({ app, onRequestData }) {
  useInjectReducer({ key: 'app', reducer });
  useInjectSaga({ key: 'app', saga });

  const {
    disciplines: { hasMore: disciplineHasMore },
  } = app;

  useEffect(() => {
    if (disciplineHasMore) {
      onRequestData();
    }
  }, []);

  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={WoVueHomePage} />
        <Route exact path="/Disciplines" component={Disciplines} />
        <Route exact path="/Disciplines/:id" component={DisciplinesDetails} />
        <Route exact path="/Flaws" component={Flaw} />
        <Route exact path="/Merits" component={Merits} />
        <Route exact path="/Attributes" component={Attribute} />
        <Route exact path="/Backgrounds" component={Backgrounds} />
        <Route exact path="/Skills" component={Skills} />
        <Route exact path="/Techniques" component={Techniques} />
        <Route
          exact
          path="/WoDVue/monsters/vampire/clan/:id"
          component={ClanPage}
        />
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

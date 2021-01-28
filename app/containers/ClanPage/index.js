/**
 *
 * ClanPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { map, find, get } from 'lodash';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Header from 'components/Header_1';
import Footer from 'components/Footer_1';
import homePageReducer from 'containers/HomePage/reducer';
import homePageSaga from 'containers/HomePage/saga';
import makeSelectHomePage from 'containers/HomePage/selectors';

import Loader from 'components/Loader';
import { getData } from 'containers/App/actions';

import ToDoReader from 'images/toreador.png';

import makeSelectClanPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { getDropDownItems } from './actions';
import './style.css';

export function ClanPage({
  onRequestData,
  homePage,
  OnRequestDropDownItems,
  clanPage,
}) {
  useInjectReducer({ key: 'clanPage', reducer });
  useInjectSaga({ key: 'clanPage', saga });

  useInjectReducer({ key: 'homePage', reducer: homePageReducer });
  useInjectSaga({ key: 'homePage', saga: homePageSaga });
  const [selectedClan, setSelectedClan] = useState('');

  const {
    contentful: { hasMore, loading },
  } = homePage;

  useEffect(() => {
    if (hasMore) {
      onRequestData();
    }
  });

  useEffect(() => {
    OnRequestDropDownItems('clans');
  }, []);

  if (loading && hasMore) {
    return <Loader />;
  }

  const { data: clanItems } = clanPage;

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(clanItems, { title: value });
      setSelectedClan(findClanData);
    }
  }

  console.log(selectedClan);

  return (
    <div className="clan-page">
      <Helmet>
        <title>ClanPage</title>
        <meta name="description" content="Description of ClanPage" />
      </Helmet>
      <Header />
      <FormattedMessage {...messages.header} />
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div className="header-single icon-Toreador">
              <h1>TOREADOR</h1>
              <h4>Degenerates</h4>
            </div>
            <div className="boxWhite">
              <div className="row">
                <div className="col-lg-6 col-md-12 order-lg-12 boxThumb">
                  <img className="thumbClan" src={ToDoReader} />
                </div>
                <div className="col-lg-6 col-md-12 order-lg-1">
                  <p>{get(selectedClan, 'description[0]', [])}</p>
                </div>
              </div>
              <br />
              {/* <p>{get(selectedClan, 'description[1]', [])}</p> */}
              <blockquote className="blockquote">
                <p className="mb-0">{get(selectedClan, 'quote', [])}</p>
              </blockquote>
              <p>
                {get(selectedClan, 'description[1]', [])}
                {get(selectedClan, 'description[2]', [])}
              </p>
              <h2>ORGANIZATION</h2>
              <p>
                {map(get(selectedClan, 'organization', []), item => (
                  <p>{item}</p>
                ))}
              </p>

              <h2>Disciplines</h2>
              <p>
                {map(get(selectedClan, 'disciplines', []), item => `${item},`)}
              </p>

              <h2>WEAKNESS</h2>
              <p>
                {map(get(selectedClan, 'weakness', []), item => (
                  <p>{item}</p>
                ))}
              </p>
              <h2>MERITS</h2>
              <p>
                {map(
                  get(selectedClan, 'merits', []),
                  item => `${item.split(':')[0]} , `,
                )}
              </p>
            </div>
          </div>
          <div className="col-md-4 order-md-1">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">
                    <span className="icon-skull">
                      <span className="path1" />
                      <span className="path2" />
                      <span className="path3" />
                      <span className="path4" />
                      <span className="path5" />
                      <span className="path6" />
                    </span>
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#">Clans & Bloodlines</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Toreador
                </li>
              </ol>
            </nav>

            <div className="boxWhite">
              <h3>CLANS & BLOODLINES</h3>
              <ul className="nav flex-column nav-clans">
                {map(clanItems, items => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.title}
                  >
                    {items.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

ClanPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onRequestData: PropTypes.func,
  homePage: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  clanPage: makeSelectClanPage(),
  homePage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onRequestData: () => dispatch(getData()),
    OnRequestDropDownItems: params => dispatch(getDropDownItems(params)),
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

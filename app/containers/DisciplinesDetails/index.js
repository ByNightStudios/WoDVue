/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 *
 * ClanPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Card, Row, Col, Typography } from 'antd';
import { map, filter, get, isEmpty } from 'lodash';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import homePageReducer from 'containers/HomePage/reducer';
import homePageSaga from 'containers/HomePage/saga';
import makeSelectHomePage from 'containers/HomePage/selectors';

import Loader from 'components/Loader';
import { getData } from 'containers/App/actions';

import makeSelectClanPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import { getDropDownItems } from './actions';
import './style.css';

export function ClanPage(props) {
  useInjectReducer({ key: 'clanPage', reducer });
  useInjectSaga({ key: 'clanPage', saga });

  useInjectReducer({ key: 'homePage', reducer: homePageReducer });
  useInjectSaga({ key: 'homePage', saga: homePageSaga });
  const [selectedClan, setSelectedClan] = useState('');
  const { onRequestData, homePage, OnRequestDropDownItems} = props;
  const {
    contentful: { hasMore, loading, data: clanItems },
  } = homePage;

  filter(clanItems, o => console.log(o));

  useEffect(() => {
    if (hasMore) {
      onRequestData();
    }
  });

  useEffect(() => {
    OnRequestDropDownItems('disciplines');
  }, []);

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;
    // const findClanData = find(clanItems, { title: id });
    // setSelectedClan(findClanData);
  }, [props]);

  if (loading && hasMore) {
    return <Loader />;
  }

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      // const findClanData = find(clanItems, { title: value });
      // setSelectedClan(findClanData);
    }
  }

  function getClassName(item) {
    if (item === 'Followers of Set') {
      return 'icon-FollowersofSet';
    }
    if (item === 'Daughters of Cacophony') {
      return 'icon-DaughtersofCacophony';
    }
    return `icon-${item}`;
  }

  function getClassHeaderName(item) {
    if (item === 'Followers of Set') {
      return 'icon-FollowersofSet';
    }
    if (item === 'Daughters of Cacophony') {
      return 'icon-DaughtersofCacophony';
    }
    return `icon-${item}`;
  }

  return (
    <div className="clan-page">
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div
              className={`header-single ${getClassHeaderName(
                selectedClan.title,
              )}`}
            >
              <h1>{get(selectedClan, 'title', '')}</h1>
              <h4>{get(selectedClan, 'nickname', '')}</h4>
            </div>
            <div className="boxWhite">
              <div className="row">
                <div className="col-lg-6 col-md-12 order-lg-12 boxThumb">
                  <img
                    className="thumbClan"
                    src={get(selectedClan, 'featuredLead[0].fields.file.url')}
                    alt="$"
                  />
                </div>
                <div className="col-lg-6 col-md-12 order-lg-1">
                  <p>{get(selectedClan, 'description[0]', [])}</p>
                </div>
              </div>
              <br />
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
                  <p key={item}>{item}</p>
                ))}
              </p>

              {!isEmpty(selectedClan.inClanDisciplines) ? (
                <div>
                  <h2>In Clan Discipline</h2>
                  <Row>
                    {map(
                      get(selectedClan, 'inClanDisciplines', []),
                      (item, index) => (
                        <Link to="/Disciplines" key={index}>
                          <Card
                            bordered={false}
                            bodyStyle={{ padding: 10 }}
                            hoverable
                          >
                            <Typography.Text>
                              {item.fields.title}
                            </Typography.Text>
                          </Card>
                        </Link>
                      ),
                    )}
                  </Row>
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(selectedClan.flaws) ? (
                <div>
                  <h2>Flaws</h2>
                  <Row gutter={[8, 8]}>
                    {map(get(selectedClan, 'flaws', []), item => (
                      <Link to="/#" key={item}>
                        {item}
                        {', '}
                      </Link>
                    ))}
                  </Row>
                </div>
              ) : (
                <div />
              )}

              <h2>WEAKNESS</h2>
              <p>
                {map(get(selectedClan, 'weakness', []), item => (
                  <p key={item}>{item}</p>
                ))}
              </p>

              {!isEmpty(selectedClan.inClanMerits) ? (
                <div>
                  <h2>IN CLAN MERITS</h2>
                  <Row>
                    {map(
                      get(selectedClan, 'inClanMerits', []),
                      (item, index) => (
                        <Link to="/#">
                          <Card
                            bordered={false}
                            bodyStyle={{ padding: 10 }}
                            hoverable
                            key={index}
                          >
                            <Typography.Text>
                              {item.fields.merit}
                            </Typography.Text>
                          </Card>
                        </Link>
                      ),
                    )}
                  </Row>
                </div>
              ) : (
                <div />
              )}
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
                  <a href="#">Disciplines</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {get(selectedClan, 'title', '')}
                </li>
              </ol>
            </nav>

            <div
              className="collapse navbar-collapse navbarBottom"
              id="navbarResponsive"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="#">
                    Clans & Bloodlines
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Disciplines
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Techniques
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Skills
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Merits
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Flaws
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Attributes
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Backgrounds
                  </a>
                </li>
              </ul>
            </div>
            <div className="boxWhite">
              <h3>DISCIPLINES</h3>
              <ul className="nav flex-column nav-clans">
                {map(clanItems, (items, index) => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.title}
                    key={index}
                  >
                    <Link
                      to={items.title}
                      className={`nav-link ${getClassName(items.title)}`}
                      value={items.title}
                    >
                      {items.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ClanPage.propTypes = {
  ...ClanPage,
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

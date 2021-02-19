/* eslint-disable jsx-a11y/no-static-element-interactions */
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
import { Row } from 'antd';
import { map, filter, get, isEmpty, find, sortBy, orderBy } from 'lodash';

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
  const [powerOfClans, setPowerOfClans] = useState('');
  const [direction, setDirection] = useState('asc');

  const { onRequestData, homePage, OnRequestDropDownItems } = props;

  const {
    contentful: { hasMore, loading, data: clanItems },
  } = homePage;

  const filterClans = sortBy(filter(clanItems, o => o.parent), 'title');

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
    const findClanData = find(filterClans, { power: id });
    setSelectedClan(findClanData);
  }, [props]);

  if (loading && hasMore) {
    return <Loader />;
  }

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(filterClans, { power: value });
      setSelectedClan(findClanData);
      const powerOfClansData = filter(clanItems, {
        power: get(findClanData, 'title'),
      });
      setPowerOfClans(powerOfClansData);
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

  function handleClanPower(sortByData) {
    const sortedByLevel = orderBy(powerOfClans, [sortByData], [direction]);
    setPowerOfClans(sortedByLevel);
    if (direction === 'asc') {
      setDirection('desc');
    } else {
      setDirection('asc');
    }
  }

  console.log(selectedClan);
  return (
    <div className="clan-page">
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div
              className={`header-single ${getClassHeaderName(
                get(selectedClan, 'title'),
              )}`}
            >
              <h1>
                {get(selectedClan, 'power', '')} -{' '}
                {get(selectedClan, 'title', '')}
              </h1>
              <h4>{get(selectedClan, 'nickname', '')}</h4>
            </div>
            <div className="boxWhite">
              <p>{get(selectedClan, 'summary[0]', [])}</p>
              {!isEmpty(get(selectedClan, 'quote')) ? (
                <blockquote className="blockquote">
                  <p className="mb-0">{get(selectedClan, 'quote', [])}</p>
                </blockquote>
              ) : null}
              <p>
                {get(selectedClan, 'summary[1]', [])}
                {get(selectedClan, 'summary[2]', [])}
                {get(selectedClan, 'summary[3]', [])}
                {get(selectedClan, 'summary[4]', [])}
                {get(selectedClan, 'summary[5]', [])}
                {get(selectedClan, 'summary[6]', [])}
              </p>

              {!isEmpty(get(selectedClan, 'foci')) ? (
                <div>
                  <h2>Flaws</h2>
                  <Row gutter={[8, 8]}>
                    {map(get(selectedClan, 'foci', []), item => (
                      <p>{item}</p>
                    ))}
                  </Row>
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'interactions')) ? (
                <div>
                  <h2>INTERACTIONS</h2>
                  {map(get(selectedClan, 'interactions'), item => (
                    <p>{item}</p>
                  ))}
                </div>
              ) : (
                <div />
              )}

              <p>
                {!isEmpty(get(selectedClan, 'testPool')) ? (
                  <div>
                    <h2>TEST POOL</h2>
                    {get(selectedClan, 'testPool')}
                  </div>
                ) : (
                  <div />
                )}
              </p>

              <p>
                <h2>SOURCE BOOK</h2>
                {!isEmpty(get(selectedClan, 'sourceBook')) ? (
                  <div>
                    {map(get(selectedClan, 'sourceBook'), item => (
                      <p>{item}</p>
                    ))}
                  </div>
                ) : (
                  <div> MET: VTM Source Book</div>
                )}
              </p>

              <div>
                <h2>POWERS</h2>
                <div className="header-disciplines">
                  <div
                    className="disc-cols3 sort-up"
                    style={{ color: 'black' }}
                  >
                    <span onClick={() => handleClanPower('title')}>NAME</span>
                  </div>
                  <div
                    className="disc-cols3 hideMobile"
                    style={{ color: 'black' }}
                  >
                    <span onClick={() => handleClanPower('level')}>Level</span>
                  </div>
                  <div
                    className="disc-cols3 hideMobile"
                    style={{ color: 'black' }}
                  >
                    <span onClick={() => handleClanPower('cost')}>Cost</span>
                  </div>
                  <div className="indicator" />
                </div>

                <div className="listing-body">
                  <div className="listing">
                    {map(powerOfClans, (item, index) => (
                      <p>
                        <div className={`item discipline-${index}`}>
                          <div className="disc-cols3">
                            <span>{item.title}</span>
                          </div>
                          <div className="disc-cols3 hideMobile">
                            <span>{item.level}</span>
                          </div>
                          <div className="disc-cols3 hideMobile">
                            <span>Varies</span>
                          </div>
                          <div className="disc-indicator">
                            <a
                              className="btn btn-primary collapsed"
                              data-toggle="collapse"
                              href={`#discipline-${index}`}
                              role="button"
                              aria-expanded="false"
                              aria-controls={`discipline-${index}`}
                            >
                              <i className="fa" />
                            </a>
                          </div>
                        </div>
                        <div className="collapse" id={`discipline-${index}`}>
                          <div className="box-summary">
                            <div className="details">
                              <ul>
                                <li>
                                  <span>Level</span>
                                  {item.level}
                                </li>
                                <li>
                                  <span>Cost</span>Varies
                                </li>
                              </ul>
                            </div>
                            <h3>SUMMARY</h3>
                            {map(item.summary, d => (
                              <p>{d}</p>
                            ))}
                            <a
                              className="btn btn-primary"
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setSelectedClan(item);
                              }}
                            >
                              <span style={{ color: '#fff' }}>Details</span>
                            </a>
                          </div>
                        </div>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
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
                  <a
                    className="nav-link"
                    href="/WoDVue/monsters/vampire/clan/Baali"
                  >
                    Clans & Bloodlines
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Disciplines">
                    Disciplines
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Techniques">
                    Techniques
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Skills">
                    Skills
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Merits">
                    Merits
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Flaws">
                    Flaws
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Attributes">
                    Attributes
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Backgrounds">
                    Backgrounds
                  </a>
                </li>
              </ul>
            </div>
            <div className="boxWhite">
              <h3>DISCIPLINES</h3>
              <ul className="nav flex-column nav-clans">
                {map(filterClans, (items, index) => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.title}
                    key={index}
                  >
                    <Link
                      to={items.power}
                      className={`nav-link ${getClassName(items.power)}`}
                      value={items.power}
                    >
                      {items.power}
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

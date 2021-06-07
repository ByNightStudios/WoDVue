/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 *
 * ClanPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { map, get, isEmpty, find, trim } from 'lodash';
import { Typography } from 'antd';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import homePageReducer from 'containers/HomePage/reducer';
import homePageSaga from 'containers/HomePage/saga';
import makeSelectHomePage from 'containers/HomePage/selectors';
import { makeSelectApp } from 'containers/App/selectors';

import makeSelectClanPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import './style.css';

const { Paragraph } = Typography;
export function ClanPage(props) {
  useInjectReducer({ key: 'clanPage', reducer });
  useInjectSaga({ key: 'clanPage', saga });

  useInjectReducer({ key: 'homePage', reducer: homePageReducer });
  useInjectSaga({ key: 'homePage', saga: homePageSaga });
  const [selectedClan, setSelectedClan] = useState('');

  const { match } = props;


  const {
    app: {
      attributes: { data: clanItems },
    },
  } = props;

  const filterClans = clanItems;

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;

    const findClanData = find(clanItems, { attribute: trim(id) });
    setSelectedClan(findClanData);
  }, [match]);

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(filterClans, { attribute: value });
      setSelectedClan(findClanData);
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
      <Helmet>
        <title>{`
          World of Darkness - MET - Vampire - Attributes -
          ${get(selectedClan, 'attribute')}`}
        </title>
        <meta name="description" content="Description of QuickStart" />
      </Helmet>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div
              className={`header-single ${getClassHeaderName(
                get(selectedClan, 'attribute'),
              )}`}
              style={{ fontSize: 18 }}
            >
              <h1>{get(selectedClan, 'attribute', '')}</h1>
              {get(selectedClan, 'attribute', '') ?
                    <Paragraph
                      copyable={{
                        text: `${decodeURI(window.location.href)}`,
                      }}
                      style={{ marginLeft: 10, color: '#fff' }}
                    >
                      {' '}
                      <i>Share Link</i>
                    </Paragraph> : null}
            </div>
            <div className="boxWhite">
              {!isEmpty(get(selectedClan, 'description')) ? (
                <div>
                  <h2>DESCRIPTION</h2>
                  {map(get(selectedClan, 'description'), item => (
                    <p>{item}</p>
                  ))}
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'example')) ? (
                <div>
                  <h2>EXAMPLE</h2>
                  {map(get(selectedClan, 'example'), item => (
                    <p>{item}</p>
                  ))}
                </div>
              ) : (
                <div />
              )}

              <p>
                {!isEmpty(get(selectedClan, 'focus')) ? (
                  <div>
                    <h2>FOCUS</h2>
                    {get(selectedClan, 'focus')}
                  </div>
                ) : (
                  <div />
                )}
              </p>
              {!isEmpty(selectedClan) ? (
                <p>
                  <h2>SOURCE BOOK</h2>
                  {!isEmpty(get(selectedClan, 'sourceBook')) ? (
                    <div>
                      {map(get(selectedClan, 'sourceBook'), item => (
                        <p>
                          <p>{get(item, 'fields.bookTitle')}</p>
                          <p>{get(item, 'fields.system[0]')}</p>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div> MET: VTM Source Book</div>
                  )}
                </p>
              ) : (
                <p />
              )}
              {isEmpty(selectedClan) ? (
                <p>
                  <p>
                    Attributes quantify a character’s innate strengths and
                    weaknesses. Depending upon how a player allocates her
                    starting dots, the character might be strong and perceptive,
                    quick and intelligent, or witty and beautiful, based on
                    whether the character has high Physical, Social, or Mental
                    attributes. A character should also be weak in some
                    attributes.
                  </p>
                  <p>
                    Creating a character who is an imperfect individual makes
                    her more realistic, and gives the character weaknesses that
                    she can overcome during the course of the chronicle. Moments
                    of growth are good for a protagonist, and raising an
                    attribute can be a wonderful reward after a tense moment in
                    the story. It could indicate that the character learned from
                    her experiences, growing wiser, stronger, or more capable of
                    surviving in a dangerous social setting.
                  </p>{' '}
                  <p>
                    {' '}
                    Most characters have attribute ratings between 3 (poor) and
                    5 (average), though exceptionally gifted individuals may
                    have ratings of 7 (excellent) or even 10 (peak human
                    capacity). As vampires are supernatural creatures, their
                    players receive bonus points that they can add to their
                    potential attribute maximums. The number of points a vampire
                    character receives in this manner varies according to her
                    Generation, reflecting the potency of the vampire’s blood.
                  </p>
                </p>
              ) : (
                <p />
              )}
            </div>
          </div>
          <div className="col-md-4 order-md-1">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">
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
                  <a href="/vampire/Attributes">Attributes</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {get(selectedClan, 'attribute', '')}
                </li>
              </ol>
            </nav>

            <div
              className="collapse navbar-collapse navbarBottom"
              id="navbarResponsive"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/vampire/clan/">
                    Clans & Bloodlines
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/vampire/Disciplines">
                    Disciplines
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/vampire/Techniques">
                    Techniques
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/vampire/Skills">
                    Skills
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/vampire/Merits">
                    Merits
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/vampire/Flaws">
                    Flaws
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/vampire/Attributes">
                    Attributes
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/vampire/Backgrounds">
                    Backgrounds
                  </a>
                </li>
              </ul>
            </div>
            <div className="boxWhite">
              <h3>ATTRIBUTES</h3>
              <ul className="nav flex-column nav-clans">
                {map(filterClans, (items, index) => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.title}
                    key={index}
                  >
                    <Link
                      to={`/vampire/Attributes/${items.attribute}`}
                      className={`nav-link ${getClassName(items.attribute)}`}
                      value={items.attribute}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {items.attribute}
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
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // onRequestData: () => dispatch(getData()),
    // OnRequestDropDownItems: params => dispatch(getDropDownItems(params)),
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

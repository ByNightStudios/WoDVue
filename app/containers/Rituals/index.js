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

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { map, get, isEmpty, find } from 'lodash';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Select } from 'antd';
import homePageReducer from 'containers/HomePage/reducer';
import homePageSaga from 'containers/HomePage/saga';
import makeSelectHomePage from 'containers/HomePage/selectors';
import { makeSelectApp } from 'containers/App/selectors';

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

  const {
    app: {
      rituals: { data: clanItems },
    },
    match,
  } = props;

  const filterClans = clanItems;

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;

    const findClanData = find(clanItems, { title: id });
    setSelectedClan(findClanData);
    clevertap.event.push(window.location.pathname);
  }, [match]);

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(filterClans, { title: value });
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

  function getBooleanValue(item) {
    const { thaumaturgy, abyssal, necromancy } = item;
    if (thaumaturgy) {
      return 'Thaumaturgy';
    }
    if (abyssal) {
      return 'Abyssal';
    }
    if (necromancy) {
      return 'Necromancy';
    }
    return false;
  }

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
              <div className="header-single">
                <div className="row">
                  <div className="col-lg-7 col-md-12 order-lg-12">
                    <h1>{get(selectedClan, 'title', '')}</h1>
                  </div>
                  <div className="col-lg-5 col-md-12 order-lg-12">
                    <div className="info">
                    <div className="info-des" style={{ width: 130 }}>
                        Type<span>{getBooleanValue(selectedClan)}</span>
                      </div>
                      <div className="info-des">
                        Level<span>{get(selectedClan, 'level', '')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="boxWhite">
              <p>
                <div>
                  <h2>TYPE</h2>
                  {getBooleanValue(selectedClan)}
                </div>

                {!isEmpty(get(selectedClan, 'summary')) ? (
                  <div>
                    <h2>SUMMARY</h2>
                    {map(get(selectedClan, 'summary'), item => (
                      <p>{item}</p>
                    ))}
                  </div>
                ) : (
                  <div />
                )}
              </p>
              {!isEmpty(get(selectedClan, 'testPool')) ? (
                <div>
                  <h2>TEST POOL</h2>
                  {map(get(selectedClan, 'testPool'), item => (
                    <p>{item}</p>
                  ))}
                </div>
              ) : (
                <div />
              )}

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

              {!isEmpty(get(selectedClan, 'system')) ? (
                <div>
                  <h2>SYSTEM</h2>
                  {map(get(selectedClan, 'system'), item => (
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
              <p>
                {!isEmpty(get(selectedClan, 'focus')) ? (
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
              </p>

              {isEmpty(selectedClan) ? (
                <p>
                  Attributes represent your character’s raw potential, but
                  skills represent the experience and training she’s received
                  throughout her life — both mortal and immortal. A character
                  with high skills is well-educated or has a great deal of
                  knowledge about the world. A character with low skills might
                  be naive, sheltered, or uneducated. You can purchase up to 5
                  dots of each skill. It’s not normally possible to buy more
                  than 5 dots in a skill. Skills provide two kinds of bonuses to
                  your character. First, they allow a character to perform
                  certain actions that an untrained character simply cannot
                  attempt. Second, they augment a character’s attributes, making
                  certain actions easier because the character has experience or
                  education with a related skill. For example, a character with
                  a high Physical attribute rating who does not have the
                  Athletics skill might find it difficult to scale a wall or to
                  leap a series of hurdles. A character with a high Social
                  attribute who does not have the Intimidate skill might find it
                  difficult to bully her way past a security guard. You should
                  select your character’s skills based on that character’s
                  background, and then place (or purchase) more dots in the
                  skills with which the character should be most profi cient.
                  Skill levels range from novice to master, as follows: •
                  Novice: You have learned the fundamentals of this field of
                  knowledge. •• Practiced: You have mastered the basics of this
                  area of study. ••• Competent: You are good enough to earn a
                  professional living in this field. •••• Expert: You have
                  surpassed the majority of your peers and are considered an
                  expert. ••••• Master: You are world-class at this activity and
                  considered to be amongst the best in the field.
                </p>
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
                  <a href="/vampire/Rituals">Rituals</a>
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
              <h3>RITUALS</h3>
              <ul className="nav flex-column nav-clans">
                {map(filterClans, (items, index) => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.title}
                    key={index}
                  >
                    <Link
                      to={`/vampire/Rituals/${items.title}`}
                      className={`nav-link ${getClassName(items.title)}`}
                      value={items.title}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
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

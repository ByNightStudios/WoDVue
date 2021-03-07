/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable no-restricted-globals */
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
import { map, find, get, isEmpty, includes } from 'lodash';
import history from 'utils/history';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import homePageReducer from 'containers/HomePage/reducer';
import homePageSaga from 'containers/HomePage/saga';
import makeSelectHomePage from 'containers/HomePage/selectors';

import Loader from 'components/Loader';
import { makeSelectApp } from 'containers/App/selectors';

import Smoke_style_4_clans from 'images/Smoke_style_4_clans.png';

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
  const { app } = props;

  const {
    clans: { data: clanItems },
  } = app;

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;
    const findClanData = find(clanItems, { title: id });
    setSelectedClan(findClanData);
  }, [props]);

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(clanItems, { title: value });
      setSelectedClan(findClanData);
    }
  }

  function getClassName(item) {
    if (includes(item, 'Followers of Set')) {
      return 'icon-FollowersofSet';
    }
    if (includes(item, 'Daughters of Cacophony')) {
      return 'icon-DaughtersofCacophony';
    }
    if (includes(item, 'Assamite')) {
      return 'icon-Assamites';
    }
    return `icon-${item}`;
  }

  function getClassHeaderName(item) {
    if (includes(item, 'Followers of Set')) {
      return 'icon-FollowersofSet';
    }
    if (includes(item, 'Daughters of Cacophony')) {
      return 'icon-DaughtersofCacophony';
    }
    if (includes(item, 'Assamite')) {
      return 'icon-Assamites';
    }
    return `icon-${item}`;
  }

  console.log(selectedClan);

  return (
    <div className="clan-page">
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div className="header-single">
              <div style={{ display: 'flex' }}>
                <img
                  src={get(selectedClan, 'clanSymbol.file.url')}
                  alt=""
                  style={{
                    width: 45,
                  }}
                />
                <div className="col-md-8">
                <h1>{get(selectedClan, 'title', '')}</h1>
                <h4 style={{ fontSize: 18 }}>
                <i>{get(selectedClan, 'nickname', '')}</i>
              </h4>
                </div>
              </div>

            </div>
            <div className="boxWhite">
              <div className="row">
                <div className="col-lg-6 col-md-12 order-lg-12 boxThumb">
                  <img
                    className="thumbClan"
                    src={get(
                      selectedClan,
                      'featuredLead[0].fields.file.url',
                      Smoke_style_4_clans,
                    )}
                    alt="$"
                  />
                </div>
                <div className="col-lg-6 col-md-12 order-lg-1">
                  <p>
                    {get(
                      selectedClan,
                      'description[0]',
                      'Legend says that the first few generations of vampires did not suffer the divisions of clan, and that they were capable of performing miracle-like feats. As progenitors passed the Embrace down to their childer, and from there, to more childer, the powers inherent in vampiric vitae grew weaker.',
                    )}
                  </p>
                </div>
              </div>
              <br />
              {!isEmpty(get(selectedClan, 'quote')) ? (
                <blockquote className="blockquote">
                  <p className="mb-0">{get(selectedClan, 'quote', [])}</p>
                </blockquote>
              ) : null}
              <p>
                <p>{get(selectedClan, 'summary[1]', [])}</p>
                <p>{get(selectedClan, 'summary[2]', [])}</p>
              </p>
              {!isEmpty(get(selectedClan, 'organization')) ? (
                <>
                  <h2>ORGANIZATION</h2>
                  <p>
                    {map(get(selectedClan, 'organization', []), item => (
                      <p key={item}>{item}</p>
                    ))}
                  </p>
                </>
              ) : null}

              {!isEmpty(get(selectedClan, 'inClanDisciplines')) ? (
                <p>
                  <h2>In Clan Discipline</h2>
                  <Row>
                    {map(
                      get(selectedClan, 'inClanDisciplines', []),
                      (item, index) => (
                        <div
                          key={index}
                          className="anchorTag"
                          style={{ marginRight: 10 }}
                          onClick={() => {
                            history.push(
                              `/WoDVue/monsters/vampire/Disciplines/${
                                item.fields.title
                              }`,
                              item,
                            );
                          }}
                          role="button"
                        >
                          {item.fields.title}
                        </div>
                      ),
                    )}
                  </Row>
                </p>
              ) : (
                <div />
              )}
              {/*
              {!isEmpty(get(selectedClan, 'flaws')) ? (
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
              )} */}

              {!isEmpty(get(selectedClan, 'weakness')) ? (
                <p>
                  <h2>WEAKNESS</h2>
                  <Row>
                    {map(get(selectedClan, 'weakness', []), (item, index) => (
                      <p key={item}>{item}</p>
                    ))}
                  </Row>
                </p>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'inClanMerits')) ? (
                <p>
                  <h2>IN CLAN MERITS</h2>
                  <Row>
                    {map(
                      get(selectedClan, 'inClanMerits', []),
                      (item, index) => (
                        <Link
                          to={`/WoDVue/monsters/vampire/Merits/${
                            item.fields.merit
                          }`}
                          className="anchorTag"
                          style={{ marginRight: 10 }}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          {item.fields.merit}
                        </Link>
                      ),
                    )}
                  </Row>
                </p>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'flaws')) ? (
                <p>
                  <h2>IN CLAN FLAWS</h2>
                  <Row>
                    {map(get(selectedClan, 'flaws', []), (item, index) => (
                      <Link
                        to={`/WoDVue/monsters/vampire/Flaws/${
                          item.fields.flaw
                        }`}
                        className="anchorTag"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {item.fields.flaw}
                      </Link>
                    ))}
                  </Row>
                </p>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'sourceBook')) ? (
                <p>
                  <h2>SOURCE BOOK</h2>
                  <Row>
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
                  </Row>
                </p>
              ) : (
                <div />
              )}

              {isEmpty(selectedClan) ? (
                <p>
                  <p>
                    Powers belonging to vampires of the Third Generation (those
                    known as Antediluvians ) were narrower in scope than the
                    powers possessed by their Second Generation sires. The
                    predilections, aptitudes, and weaknesses of the
                    Antediluvians were more stable than their predecessors’.
                    These distinctions were passed down to the vampires they
                    Embraced, marking each one as belonging to a specific
                    lineage. Those lineages, known as clans, have defined
                    vampiric society throughout history. Each vampire clan has
                    certain characteristics. The supernatural powers carried in
                    the clan’s blood defines them, as does the specific curse
                    that afflicts members of that clan. These are passed down
                    from sire to childe until the blood is weakened by being so
                    many generations removed from the Antediluvians that it can
                    no longer support these distinctions. These thin-blooded
                    childer are known as Caitiff. They have no clan, and are
                    considered outcasts by vampiric society.
                  </p>
                  <p>
                    Once Embraced, a fledgling vampire is both physically and
                    spiritually altered. Her body dies and is brought back from
                    the dead, and her blood is replaced with vampiric vitae.
                    Many of these changes are specific to the clan into which
                    she is Embraced , making her more like the clan’s founder.
                    This effect is stronger in those with purer blood, and less
                    obvious in those vampires who are many generations removed.
                    The characteristics of the clan may appear as new quirks in
                    an individual’s personality, faults in her temperament, or
                    physical changes to her appearance. It also manifests in the
                    powers a vampire can learn through the intrinsic qualities
                    of her blood. Each clan has three disciplines that are
                    native to its blood (listed at the top of the clan’s
                    description). These disciplines, known as in-clan
                    disciplines, can be learned without a teacher. To learn a
                    discipline that is not one of her in-clan disciplines, a
                    vampire must find a teacher.
                  </p>
                  <p>
                    On rare occasions, the vitae of a small lineage will diverge
                    from the distinctive qualities of the parent clan. These
                    lineages, called bloodlines , still bear notable signs of
                    their progenitor Antediluvian, but may also carry
                    distinctive markers and predilections, different
                    supernatural powers, or a strange variant of the clan’s
                    curse. Like clans, bloodlines reproduce predictably. All
                    childer Embraced by a vampire of a particular bloodline will
                    also have the distinctive qualities of that bloodline. Such
                    childer cannot revert to their parent clan. By default, a
                    bloodline has the same weakness as its parent clan but some
                    bloodlines carry an alternate or additional weakness.
                  </p>
                  <p>
                    Some rare bloodlines, on the other hand, claim that they are
                    not descended from any of the clans. They have their own
                    distinctive markers and native disciplines, and are treated
                    as oddities and freaks by members of the more legitimate
                    clans. The descriptions given in this chapter define the
                    clans and bloodlines used in the World of Darkness. Your
                    Storyteller may use altered descriptions, more suitable to
                    her setting or to the history of her chronicle. Be sure to
                    speak with your Storyteller about any changes that may be in
                    play for her game before you choose your clan.
                  </p>
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
                  <a href="#">Clans & Bloodlines</a>
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
                  <a className="nav-link" href="/WoDVue/monsters/vampire/clan/">
                    Clans & Bloodlines
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/WoDVue/monsters/vampire/Disciplines"
                  >
                    Disciplines
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/WoDVue/monsters/vampire/Techniques"
                  >
                    Techniques
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/WoDVue/monsters/vampire/Skills"
                  >
                    Skills
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/WoDVue/monsters/vampire/Merits"
                  >
                    Merits
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/WoDVue/monsters/vampire/Flaws">
                    Flaws
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/WoDVue/monsters/vampire/Attributes"
                  >
                    Attributes
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/WoDVue/monsters/vampire/Backgrounds"
                  >
                    Backgrounds
                  </a>
                </li>
              </ul>
            </div>
            <div className="boxWhite">
              <h3>CLANS & BLOODLINES</h3>
              <ul className="nav flex-column nav-clans">
                {map(clanItems, (items, index) => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.title}
                    key={index}
                  >
                    <Link
                      to={`/WoDVue/monsters/vampire/clan/${items.title}`}
                      className="nav-link"
                      value={items.title}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <img
                        src={get(items, 'clanSymbol.file.url')}
                        alt={items.title}
                        style={{
                          width: 22,
                        }}
                      />{' '}
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
};

const mapStateToProps = createStructuredSelector({
  clanPage: makeSelectClanPage(),
  homePage: makeSelectHomePage(),
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
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

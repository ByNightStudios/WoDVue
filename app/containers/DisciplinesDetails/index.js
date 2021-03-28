/* eslint-disable jsx-a11y/interactive-supports-focus */
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
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Typography, Select, Button } from 'antd';
import {
  map,
  filter,
  get,
  isEmpty,
  sortBy,
  orderBy,
  isEqual,
  slice,
  trim,
  uniqBy,
  includes,
  uniq,
  without,
} from 'lodash';

import { find } from 'underscore';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import history from 'utils/history';

import { makeSelectApp } from 'containers/App/selectors';
import homePageReducer from 'containers/HomePage/reducer';
import homePageSaga from 'containers/HomePage/saga';
import makeSelectHomePage from 'containers/HomePage/selectors';

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import makeSelectClanPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import './style.css';

const { Paragraph } = Typography;
const { Option } = Select;

export function ClanPage(props) {
  useInjectReducer({ key: 'clanPage', reducer });
  useInjectSaga({ key: 'clanPage', saga });

  useInjectReducer({ key: 'homePage', reducer: homePageReducer });
  useInjectSaga({ key: 'homePage', saga: homePageSaga });

  const [selectedClan, setSelectedClan] = useState('');
  const [powerOfClans, setPowerOfClans] = useState([]);
  const [direction, setDirection] = useState('asc');
  const [powerClanIndex, setPowenClanIndex] = useState(-1);
  const [clanItemsList, setSelectedClanItemsList] = useState([]);

  const { app } = props;

  const {
    disciplines: { data: clanItems },
  } = app;

  useEffect(() => {
    setSelectedClanItemsList(clanItems);
  }, []);

  const filterClans = uniqBy(
    sortBy(filter(clanItems, o => o.parent), 'title'),
    'title',
  );

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;



    const findClanData = find(filterClans, o => o.power === trim(id));

    if (findClanData) {
      setSelectedClan(findClanData);
    }

    if (!findClanData) {
      const findClanData3 = find(filterClans, o => o.power === id);
      setSelectedClan(findClanData3);
    }

    const powerOfClansData = filter(
      clanItems,
      o => o.power === trim(get(findClanData, 'title')),
    );

    const uniqPowerOfClans = uniqBy(powerOfClansData, 'title');

    const sortedByLevel = orderBy(uniqPowerOfClans, 'level', [direction]);

    setPowerOfClans(sortedByLevel);
    setPowenClanIndex(-1);
  }, [props]);

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(filterClans, { power: value });
      setSelectedClan(findClanData);
      const powerOfClansData = filter(clanItemsList, {
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

  function getSummaryHtml(html) {
    if (html) {
      const mappedHtml = {
        ...html,
        content: slice(html.content, 1, 6),
      };
      return mappedHtml;
    }
    return false;
  }

  function getFilterPower(data) {
    return data;
  }

  const groupByData1 = filter(filterClans, o => o.thaumaturgy);
  const groupByData2 = filter(filterClans, o => o.necromancy);
  const groupByData3 = filter(
    filterClans,
    o =>
      !o.thaumaturgy &&
      !o.necromancy &&
      o.title !== 'Necromancy' &&
      o.title !== 'Thaumaturgy',
  );
  const filterClansByReduce = [
    { listName: '', data: groupByData3 },
    { listName: 'Necromancy', data: groupByData2 },
    { listName: 'Thaumaturgy', data: groupByData1 },
  ];

  function renderHelment() {
    return (
      <Helmet
        meta={[
          {
            name: `${get(selectedClan, 'power', '')}`,
            content: `${get(selectedClan, 'summary[0]', '')}`,
          },
        ]}
      >
        <title>
          {`
          World of Darkness - MET - Vampire - Disciplines`}
        </title>
        <meta
          name={`${get(selectedClan, 'power', '')}`}
          content={`${get(selectedClan, 'summary[0]', '')}`}
        />
      </Helmet>
    );
  }

  function renderLink(item) {
    const { title } = item;
    if (includes(title, 'Necromancy')) {
      return (
        <a
          className="btn btn-primary"
          onClick={() => {
            history.push(`/vampire/Rituals#Necromancy`);
          }}
        >
          <span style={{ color: '#fff' }}>Details</span>
        </a>
      );
    }

    if (includes(title, 'Thaumaturgy')) {
      return (
        <a
          className="btn btn-primary"
          onClick={() => {
            history.push(`/vampire/Rituals#Thaumaturgy`);
          }}
        >
          <span style={{ color: '#fff' }}>Details</span>
        </a>
      );
    }
    return (
      <a
        className="btn btn-primary"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          setSelectedClan(item);
          setPowenClanIndex(-1);
        }}
      >
        <span style={{ color: '#fff' }}>Details</span>
      </a>
    );
  }

  const sourceBook = map(clanItemsList, item =>
    get(item, 'sourceBook_html.fields.bookTitle', ''),
  );

  const uniqSourceBook = without(uniq(sourceBook), "");

  function handleChangeFilter(item) {
    setSelectedClanItemsList(clanItemsList);
    const filterClanItems = filter(
      clanItems,
      o => get(o, 'sourceBook_html.fields.bookTitle') === item,
    );
    setSelectedClanItemsList(filterClanItems);
  }

  return (
    <div className="clan-page">
      {renderHelment()}
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div
              className={`header-single ${getClassHeaderName(
                get(selectedClan, 'power'),
              )}`}
            >
              <h1>
                <div className="row" style={{ fontSize: 18 }}>
                  <h1>{get(selectedClan, 'power', '')}</h1>
                  {get(selectedClan, 'power', '') ? (
                    <Paragraph
                      copyable={{
                        text: `${window.location.href}`,
                      }}
                      style={{ marginLeft: 10, color: '#fff' }}
                    >
                      {' '}
                      <i>Share Link</i>
                    </Paragraph>
                  ) : null}
                </div>
                {!isEqual(
                  get(selectedClan, 'power', ''),
                  get(selectedClan, 'title', ''),
                ) ? (
                    <i>{get(selectedClan, 'title', '')} </i>
                  ) : (
                  <div />
                )}
              </h1>
              <h4>{get(selectedClan, 'nickname', '')}</h4>
            </div>
            <div className="boxWhite">
              <p>
                {isEmpty(selectedClan) ? (
                  <p>
                    <p>
                      Disciplines are supernatural powers granted by the
                      Embrace. Vampires cultivate these powers and bring them to
                      bear against foes and prey. Fueled by blood and will,
                      disciplines provide an incomparable, mystical edge and are
                      the hallmarks of a vampire’s clan or bloodline.
                    </p>
                    <p>
                      By using her disciplines, a vampire can exert the strength
                      of a dozen humans; trick an enemy into submission; force
                      her way into someone else’s mind; take the shape of a
                      wolf, bat, or hideous monstrosity — or numerous other
                      things. A recently Embraced vampire might have only a few
                      such powers at her command, while an ancient may have
                      mastered a fearsome breadth of potent feats. Elders can
                      learn awesome powers, fueled by the potency of their
                      blood. Neonates and Ancillae use the flexibility of their
                      thinner blood to combine two or more disciplines and
                      create new techniques that are a mélange of powers.
                    </p>
                    <p>
                      Each vampiric clan possesses innate powers of the blood:
                      disciplines that are native to that clan. A vampire can
                      learn those powers easily through experimentation and
                      personal study; this process requires you to spend 1
                      downtime action between game sessions. Learning other
                      clans’ disciplines is more difficult; it requires having a
                      knowledgeable teacher and drinking blood from a vampire
                      who innately possesses those disciplines. As drinking
                      blood causes a vampire to become partially bound to the
                      donor, learning disciplines from another vampire requires
                      a great deal of trust.
                    </p>
                  </p>
                ) : (
                  <div />
                )}
              </p>
              <p>{get(selectedClan, 'summary[0]', [])}</p>
              {!isEmpty(get(selectedClan, 'quote')) ? (
                <blockquote className="blockquote">
                  <div
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(selectedClan.quote_html),
                    }}
                  />
                </blockquote>
              ) : null}
              <p>
                <div
                  /* eslint-disable-next-line react/no-danger */
                  dangerouslySetInnerHTML={{
                    __html: documentToHtmlString(
                      getSummaryHtml(get(selectedClan, 'summary_html', '')),
                    ),
                  }}
                />
              </p>

              {!isEmpty(get(selectedClan, 'system')) ? (
                <div>
                  <h2>SYSTEM</h2>
                  <div
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(selectedClan.system_html),
                    }}
                  />
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'exceptional')) ? (
                <div>
                  <h2>Exceptional Success</h2>
                  <Row gutter={[8, 8]}>{get(selectedClan, 'exceptional')}</Row>
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'exceptionalLong')) ? (
                <div>
                  <h2>Exceptional Success</h2>
                  <Row gutter={[8, 8]}>
                    <div
                      /* eslint-disable-next-line react/no-danger */
                      dangerouslySetInnerHTML={{
                        __html: documentToHtmlString(
                          selectedClan.exceptionalLong_html,
                        ),
                      }}
                    />
                  </Row>
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'focusDescriptor')) ? (
                <div>
                  <h2>Focus</h2>
                  <Row type="flex" justify="start">
                    <u> {get(selectedClan, 'foci')}</u>
                    <span>&nbsp;{' : '}&nbsp;</span>
                    <div
                      style={{ width: '85%' }}
                      /* eslint-disable-next-line react/no-danger */
                      dangerouslySetInnerHTML={{
                        __html: documentToHtmlString(
                          selectedClan.focusDescriptor_html,
                        ),
                      }}
                    />
                  </Row>
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'interactions')) ? (
                <div>
                  <h2>INTERACTIONS</h2>
                  <div
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(
                        selectedClan.interactions_html,
                      ),
                    }}
                  />
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
                {!isEmpty(get(selectedClan, 'sourceBook')) ? (
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
                  <div />
                )}
              </p>

              <p>
                {!isEmpty(selectedClan) ? (
                  <div>
                    <div>
                      <h2>POWERS</h2>
                      <div className="header-disciplines">
                        <div
                          className="disc-cols3 sort-up"
                          style={{ color: 'black' }}
                        >
                          <span onClick={() => handleClanPower('title')}>
                            NAME
                          </span>
                        </div>
                        <div
                          className="disc-cols3 hideMobile"
                          style={{ color: 'black' }}
                        >
                          <span onClick={() => handleClanPower('level')}>
                            Level
                          </span>
                        </div>
                        <div
                          className="disc-cols3 hideMobile"
                          style={{ color: 'black' }}
                        >
                          <span onClick={() => handleClanPower('cost')}>
                            Cost
                          </span>
                        </div>
                        <div className="indicator" />
                      </div>

                      <div className="listing-body">
                        <div className="listing">
                          {map(getFilterPower(powerOfClans), (item, index) => (
                            <p>
                              <div className={`item discipline-${index}`}>
                                <div className="disc-cols3">
                                  <span>{item.title}</span>
                                </div>
                                <div className="disc-cols3 hideMobile">
                                  <span>{item.level}</span>
                                </div>
                                <div className="disc-cols3 hideMobile">
                                  <span>{item.cost}</span>
                                </div>
                                <div
                                  className="disc-indicator"
                                  onClick={() => setPowenClanIndex(index)}
                                >
                                  <a
                                    className={`btn btn-primary ${
                                      index === powerClanIndex
                                        ? 'collaps'
                                        : 'collapsed'
                                    }`}
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
                              <div
                                className={
                                  index === powerClanIndex
                                    ? 'collapse show'
                                    : 'collapse'
                                }
                                id={`discipline-${index}`}
                              >
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
                                  <div
                                    /* eslint-disable-next-line react/no-danger */
                                    dangerouslySetInnerHTML={{
                                      __html: documentToHtmlString(
                                        item.summary_html,
                                      ),
                                    }}
                                  />
                                  <div className="row">{renderLink(item)}</div>
                                </div>
                              </div>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div />
                )}
              </p>
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
                  <a href="/vampire/Disciplines">Disciplines</a>
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
            <Row type="flex">
                <Select
                  style={{ width: '70%', marginBottom: 10, color: 'black' }}
                  placeholder="filter by source book"
                  onChange={handleChangeFilter}
                >
                  {map(uniqSourceBook, item => (
                    <Option value={item}>{item}</Option>
                  ))}
                </Select>
                <Button onClick={() => setSelectedClanItemsList(clanItems)}>
                  Reset
                </Button>
              </Row>
              <ul className="nav flex-column nav-clans">
                <Typography.Title level={3}>Disciplines</Typography.Title>
                {map(filterClansByReduce, (items, index) => (
                  <ul key={index}>
                    <Typography.Title
                      level={3}
                      className="nav-item"
                      style={{ marginLeft: '-40px' }}
                    >
                      <Link
                        to={`/vampire/Disciplines/${items.listName}`}
                        className={`nav-link ${getClassName(items.listName)}`}
                      >
                        {items.listName}
                      </Link>
                    </Typography.Title>
                    <li style={{ marginLeft: 10 }}>
                      {map(get(items, 'data'), (items1, index1) => (
                        <li
                          className="nav-item"
                          onClick={handleNavItemsClick}
                          value={items1.title}
                          key={index1}
                        >
                          <Link
                            to={`/vampire/Disciplines/${items1.power}`}
                            className={`nav-link ${getClassName(items1.power)}`}
                            value={items1.power}
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            {items1.power}
                          </Link>
                        </li>
                      ))}
                    </li>
                  </ul>
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

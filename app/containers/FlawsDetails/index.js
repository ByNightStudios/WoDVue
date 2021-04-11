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
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  map,
  get,
  isEmpty,
  find,
  trim,
  without,
  uniq,
  filter,
  concat,
  includes,
} from 'lodash';
import { Typography, Select, Row, Button } from 'antd';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import homePageReducer from 'containers/HomePage/reducer';
import homePageSaga from 'containers/HomePage/saga';
import makeSelectHomePage from 'containers/HomePage/selectors';
import { makeSelectApp } from 'containers/App/selectors';

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
  const [clanItemsList, setSelectedClanItemsList] = useState([]);

  const [disc, setDisc] = useState('filter by Clan');
  const [costName, setCost] = useState('filter by Cost');
  const [book, setBook] = useState('filter by source book');

  const {
    app: {
      flaws: { data: clanItems },
      clans: { data: meritData },
    },
    match,
  } = props;

  const filterClans = clanItems;

  useEffect(() => {
    setSelectedClanItemsList(clanItems);
  }, []);

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;

    const findClanData = find(clanItems, { flaw: trim(id) });
    setSelectedClan(findClanData);
  }, [match]);

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(filterClans, { flaw: value });
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

  const sourceBook = map(clanItems, item =>
    get(item, 'sourceBook_html.fields.bookTitle', ''),
  );

  const uniqSourceBook = without(uniq(sourceBook), '');

  const cost = map(clanItems, item => get(item, 'flawCost', ''));

  const flawCost = without(uniq(cost), '').sort();

  function handleChangeFilter(item) {
    setBook(item);
    setSelectedClanItemsList(clanItemsList);
    const filterClanItems = filter(
      clanItemsList,
      o => get(o, 'sourceBook_html.fields.bookTitle') === item,
    );
    setSelectedClanItemsList(filterClanItems);
  }

  const clanNames = uniq(
    without(
      without(map(clanItems, o => get(o, 'flawType[0]')), undefined),
      'Clan',
    ),
  );

  const meritClanNames = uniq(
    without(
      map(meritData, o => {
        if (!o.parentClan) {
          return o.title;
        }
        return undefined;
      }),
      undefined,
    ),
  );

  const clanItemsDataOfFlaws = [];

  const filterList = concat(
    ['General', 'Anarch', 'Camarilla', 'Sabbat', 'Morality'],
    meritClanNames,
  );

  function handleFilterType(type) {
    setDisc(type);
    setSelectedClanItemsList(clanItems);
    // if (book && book !== 'filter by source book') {
    //   setBook(book);
    // }
    if (
      includes(
        ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
        type,
      )
    ) {
      let filterClans2 = filter(clanItems, o =>
        includes(get(o, 'flawType[0]'), type),
      );
      if (costName && costName !== 'filter by Cost') {
        filterClans2 = filter(
          filterClans2,
          o => get(o, 'flawCost') === costName,
        );
      }

      if (book && book !== 'filter by source book') {
        filterClans2 = filter(
          filterClans2,
          o => get(o, 'sourceBook_html.fields.bookTitle') === book,
        );
      }
      setSelectedClanItemsList(filterClans2);
    }
    if (
      !includes(
        ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
        type,
      )
    ) {
      let filterClans1 = filter(clanItems, o =>
        includes(get(o, 'clanFlaw'), type),
      );
      if (costName && costName !== 'filter by Cost') {
        filterClans1 = filter(
          filterClans1,
          o => get(o, 'flawCost') === costName,
        );
      }
      if (book && book !== 'filter by source book') {
        filterClans1 = filter(
          filterClans1,
          o => get(o, 'sourceBook_html.fields.bookTitle') === book,
        );
      }
      setSelectedClanItemsList(filterClans1);
    }
  }

  function handleFilterCostType(item) {
    setCost(item);
    const filterClanItems = filter(clanItems, o => get(o, 'flawCost') === item);
    if (disc && disc !== 'filter by Clan') {
      if (
        includes(
          ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
          disc,
        )
      ) {
        let filterClans2 = filter(filterClanItems, o =>
          includes(get(o, 'flawType[0]'), disc),
        );
        if (book && book !== 'filter by source book') {
          filterClans2 = filter(
            filterClans2,
            o => get(o, 'sourceBook_html.fields.bookTitle') === book,
          );
        }
        setSelectedClanItemsList(filterClans2);
      }
      if (
        !includes(
          ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
          disc,
        )
      ) {
        let filterClans1 = filter(clanItems, o =>
          includes(get(o, 'clanFlaw'), disc),
        );
        if (book && book !== 'filter by source book') {
          filterClans1 = filter(
            filterClans1,
            o => get(o, 'sourceBook_html.fields.bookTitle') === book,
          );
        }
        setSelectedClanItemsList(filterClans1);
      }
    } else {
      setSelectedClanItemsList(filterClanItems);
    }
  }

  return (
    <div className="clan-page">
      <Helmet>
        <title>
          {`
          World of Darkness - MET - Vampire - FlawsDetails -
          ${get(selectedClan, 'flaw', '')}`}
        </title>
        <meta name="description" content="Description of QuickStart" />
      </Helmet>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div
              className={`header-single ${getClassHeaderName(
                get(selectedClan, 'flaw'),
              )}`}
            >
              <div className="row" style={{ fontSize: 18 }}>
                <h1>{get(selectedClan, 'flaw', '')}</h1>
                {get(selectedClan, 'flaw', '') ? (
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
            </div>
            <div className="boxWhite">
              <p>
                {get(selectedClan, 'clanFlaw') ? (
                  <div>
                    <h2>CLAN</h2>
                    {get(selectedClan, 'clanFlaw')}
                  </div>
                ) : (
                  <div />
                )}
              </p>
              <p>
                {get(selectedClan, 'flawCost') ? (
                  <div>
                    <h2>COST</h2>
                    {get(selectedClan, 'flawCost')}
                  </div>
                ) : (
                  <div />
                )}
              </p>
              <p>
                {!isEmpty(get(selectedClan, 'flawType')) ? (
                  <div>
                    <h2>TYPE</h2>
                    {map(get(selectedClan, 'flawType'), item => (
                      <p>{item}</p>
                    ))}
                  </div>
                ) : (
                  <div />
                )}
              </p>
              {!isEmpty(get(selectedClan, 'flawDescription')) ? (
                <div style={{ whiteSpace: 'break-spaces' }}>
                  <h2>DESCRIPTION</h2>
                  <div
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(
                        get(selectedClan, 'flawDescription_html'),
                      ),
                    }}
                  />
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
                  <p>
                    Flaws are disadvantages that pose challenges to a
                    character’s nightly existence and provide a player a few
                    extra experience points (XP) to spend elsewhere on her
                    sheet. If you don’t see any that suit your character, you
                    can create your character and play without adding any to
                    your sheet. Flaws add up to 7 XP to your character, but also
                    give that character a notable disadvantage in the game.
                    Flaws are designed to be interesting, signifi cant, and to
                    exemplify your character’s troubled past or personal
                    prohibitions. You should try to roleplay your character’s
                    flaws as much as possible, helping the Storyteller create a
                    rich and detailed chronicle. Perfect people are no fun to
                    roleplay, and characters with authentic-feeling traumas,
                    biases, and failings bring life and vibrancy to the game.
                  </p>{' '}
                  <p>
                    A Storyteller may choose to include or prohibit any merit or
                    flaw that she feels is inappropriate for her chronicle.
                    Merits can be removed from a character sheet or flaws may be
                    added to that sheet (either temporarily or permanently) as
                    the Storyteller sees fit, so long as a character never has
                    more than 7 XP of merits and does not receive more than 7 XP
                    from flaws at any time.
                  </p>
                  <p>
                    To remove a flaw from your character sheet, you must spend
                    XP equal to twice the original benefi t of the flaw. A
                    3-point fl aw requires 6 XP to remove, and so forth. If you
                    have any questions about whether a specific merit or flaw is
                    appropriate to be removed during the play of your chronicle,
                    speak to your Storyteller.
                  </p>{' '}
                  <p>
                    <b>Inappropriate Flaws</b>
                    <br />
                    Players cannot purchase flaws that do not impact their
                    characters. Such flaws include:
                  </p>{' '}
                  <ul>
                    <li>
                      Flaws that duplicate a clan’s innate weakness, such as
                      purchasing the Bound to the Earth flaw on a Tzimisce
                      character
                    </li>
                    <li>
                      Flaws that are inappropriate to the character’s creature
                      type, such as purchasing the Beast in the Mirror flaw on a
                      character who is a ghoul Flaws that are negated by a power
                      or merit the character possesses, such as purchasing both
                      the Deep Sleeper flaw and the Blind the Sun technique
                    </li>
                    <li>
                      Flaws that are made irrelevant by circumstances of plot or
                      setting. You cannot have a flaw that requires you to fear
                      all Ravnos, if there are no Ravnos allowed in your
                      Storyteller’s setting.
                    </li>
                    <li>
                      Merits and flaws that are diametrically opposed in story
                      or in mechanics. A character cannot purchase Acute Sense:
                      Hearing and also possess the Hard of Hearing flaw. If you
                      gain a power or ability that negates the detriments of a
                      flaw your character possesses or makes that fl aw
                      insignificant, you must immediately buy off the flaw.
                      Players who are forced to buy off a flaw in this manner
                      may go into debt if they do not already possess enough
                      earned XP to buy off the fl aw; if you go into debt for
                      this reason, the next XP earned by this character must be
                      entirely allocated to repaying that fl aw, until the
                      experience debt is resolved.
                    </li>
                  </ul>
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
                  <a href="/vampire/Flaws">Flaws</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {get(selectedClan, 'flaw', '')}
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
                  style={{ width: '70%', paddingBottom: 20 }}
                  showSearch
                  placeholder="Filter"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                  onSelect={handleFilterType}
                  className="flawFilter"
                  value={disc}
                >
                  {map(uniq(filterList), item => (
                    <Select.Option value={item}>{item}</Select.Option>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    setDisc('filter by Clan');

                    let filterClans2 = [];

                    if (costName && costName !== 'filter by Cost') {
                      filterClans2 = filter(
                        clanItems,
                        o => get(o, 'flawCost') === costName,
                      );
                    }
                    if (book && book !== 'filter by source book') {
                      filterClans2 = filter(
                        filterClans2,
                        o =>
                          get(o, 'sourceBook_html.fields.bookTitle') === book,
                      );
                    }
                    setSelectedClanItemsList(filterClans2);
                    if (
                      costName === 'filter by Cost' &&
                      book === 'filter by source book'
                    ) {
                      setSelectedClanItemsList(clanItems);
                    }
                  }}
                >
                  Reset
                </Button>
              </Row>
              <Row type="flex">
                <Select
                  style={{ width: '70%', paddingBottom: 20 }}
                  showSearch
                  placeholder="Filter by cost"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                  onSelect={handleFilterCostType}
                  className="flawFilter"
                  value={costName}
                >
                  {map(flawCost, item => (
                    <Select.Option value={item}>{item}</Select.Option>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    setCost('filter by Cost');
                    console.log(disc);
                    if (disc && disc !== 'filter by Clan') {
                      if (
                        includes(
                          [
                            'Anarch',
                            'Camarilla',
                            'Clan',
                            'General',
                            'Sabbat',
                            'Morality',
                          ],
                          disc,
                        )
                      ) {
                        let filterClans2 = filter(clanItems, o =>
                          includes(get(o, 'flawType[0]'), disc),
                        );
                        if (book && book !== 'filter by source book') {
                          filterClans2 = filter(
                            filterClans2,
                            o =>
                              get(o, 'sourceBook_html.fields.bookTitle') ===
                              book,
                          );
                        }
                        console.log('hello');
                        setSelectedClanItemsList(filterClans2);
                      }
                      if (
                        !includes(
                          [
                            'Anarch',
                            'Camarilla',
                            'Clan',
                            'General',
                            'Sabbat',
                            'Morality',
                          ],
                          disc,
                        )
                      ) {
                        let filterClans1 = filter(clanItems, o =>
                          includes(get(o, 'clanFlaw'), disc),
                        );
                        if (book && book !== 'filter by source book') {
                          filterClans1 = filter(
                            filterClans1,
                            o =>
                              get(o, 'sourceBook_html.fields.bookTitle') ===
                              book,
                          );
                        }
                        setSelectedClanItemsList(filterClans1);
                      }
                    }
                    if (
                      disc === 'filter by Clan' &&
                      book === 'filter by source book'
                    ) {
                      setSelectedClanItemsList(clanItems);
                    }
                  }}
                >
                  Reset
                </Button>
              </Row>
              <Row type="flex">
                <Select
                  style={{ width: '70%', marginBottom: 10, color: 'black' }}
                  placeholder="filter by source book"
                  onChange={handleChangeFilter}
                  value={book}
                >
                  <Option value="MET - VTM - Core Book">
                    MET - VTM - Core Book
                  </Option>
                  <Option value="MET - VTM - V2 Issue 1">
                    MET - VTM - V2 Issue 1
                  </Option>
                  <Option value="MET - VTM - V2 (2021)">
                    MET - VTM - V2 (2021)
                  </Option>
                </Select>
                <Button
                  onClick={() => {
                    setBook('filter by source book');
                    if (disc && disc !== 'filter by Clan') {
                      if (
                        includes(
                          [
                            'Anarch',
                            'Camarilla',
                            'Clan',
                            'General',
                            'Sabbat',
                            'Morality',
                          ],
                          disc,
                        )
                      ) {
                        let filterClans2 = filter(clanItems, o =>
                          includes(get(o, 'flawType[0]'), disc),
                        );
                        if (costName && costName !== 'filter by Cost') {
                          filterClans2 = filter(
                            filterClans2,
                            o => get(o, 'flawCost') === costName,
                          );
                        }
                        setSelectedClanItemsList(filterClans2);
                      }
                      if (
                        !includes(
                          [
                            'Anarch',
                            'Camarilla',
                            'Clan',
                            'General',
                            'Sabbat',
                            'Morality',
                          ],
                          disc,
                        )
                      ) {
                        let filterClans1 = filter(clanItems, o =>
                          includes(get(o, 'clanFlaw'), disc),
                        );
                        if (costName && costName !== 'filter by Cost') {
                          filterClans1 = filter(
                            filterClans1,
                            o => get(o, 'flawCost') === costName,
                          );
                        }
                        setSelectedClanItemsList(filterClans1);
                      }
                    }
                    if (
                      disc === 'filter by Clan' &&
                      costName === 'filter by Cost'
                    ) {
                      setSelectedClanItemsList(clanItems);
                    }
                  }}
                >
                  Reset
                </Button>
              </Row>
              <h3>FLAWS</h3>
              <ul className="nav flex-column nav-clans">
                {map(clanItemsList, (items, index) => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.flaw}
                    key={index}
                  >
                    <Link
                      to={`/vampire/Flaws/${items.flaw}`}
                      className={`nav-link ${getClassName(items.flaw)}`}
                      value={items.flaw}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {items.flaw}
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

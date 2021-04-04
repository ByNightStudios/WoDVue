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
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { Typography, Select, Button, Row } from 'antd';

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
      merits: { data: clanItems },
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

    const findClanData = find(clanItems, { merit: trim(id) });
    setSelectedClan(findClanData);
  }, [match]);

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(clanItemsList, { merit: value });
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

  const sourceBook = map(clanItemsList, item =>
    get(item, 'sourceBook_html.fields.bookTitle', ''),
  );

  const uniqSourceBook = without(uniq(sourceBook), '');

  const cost = map(clanItemsList, item => get(item, 'meritCost', ''));

  const uniqCost = without(uniq(cost), '').sort();

  function handleChangeFilter(item) {
    setBook(item);
    setSelectedClanItemsList(clanItems);
    const filterClanItems = filter(
      clanItemsList,
      o => get(o, 'sourceBook_html.fields.bookTitle') === item,
    );
    setSelectedClanItemsList(filterClanItems);
  }

  function handleFilterCostType(item) {
    setCost(item);
    setSelectedClanItemsList(clanItems);
    const filterClanItems = filter(
      clanItemsList,
      o => get(o, 'meritCost') === item,
    );
    setSelectedClanItemsList(filterClanItems);
  }

  let clanNames = uniq(
    without(map(clanItems, o => get(o, 'clanSpecific[0]')), undefined),
  );

  clanNames = concat(
    ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
    clanNames,
  ).sort();

  function handleFilterType(type) {
    setDisc(type);
    setSelectedClanItemsList(clanItems);
    if (
      includes(
        ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
        type,
      )
    ) {
      const filterClans2 = filter(clanItems, o =>
        includes(get(o, 'meritType[0]'), type),
      );
      setSelectedClanItemsList(filterClans2);
    }
    if (
      !includes(
        ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
        type,
      )
    ) {
      const filterClans1 = filter(clanItems, o =>
        includes(get(o, 'clanSpecific[0]'), type),
      );
      setSelectedClanItemsList(filterClans1);
    }
  }

  return (
    <div className="clan-page">
      <Helmet>
        <title>
          {`
          World of Darkness - MET - Vampire - Merits -{' '}
          ${get(selectedClan, 'merit', '')}`}
        </title>
        <meta name="description" content="Description of Merits" />
      </Helmet>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div
              className={`header-single ${getClassHeaderName(
                get(selectedClan, 'merit'),
              )}`}
            >
              <div className="row" style={{ fontSize: 18 }}>
                <h1>{get(selectedClan, 'merit', '')}</h1>
                {get(selectedClan, 'merit', '') ? (
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
                {get(selectedClan, 'clanSpecific') ? (
                  <div>
                    <h2>CLAN</h2>
                    {get(selectedClan, 'clanSpecific[0]')}
                  </div>
                ) : (
                  <div />
                )}
              </p>
              <p>
                {get(selectedClan, 'meritCost') ? (
                  <div>
                    <h2>COST</h2>
                    {get(selectedClan, 'meritCost')}
                  </div>
                ) : (
                  <div />
                )}
              </p>
              <p>
                {!isEmpty(get(selectedClan, 'meritType')) ? (
                  <div>
                    <h2>TYPE</h2>
                    {map(get(selectedClan, 'meritType'), item => (
                      <p>{item}</p>
                    ))}
                  </div>
                ) : (
                  <div />
                )}
              </p>

              {!isEmpty(get(selectedClan, 'meritDescription')) ? (
                <div>
                  <h2>DESCRIPTION </h2>
                  <div
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(
                        selectedClan.meritDescription_html,
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
                    Attributes represent your character’s raw potential, but
                    skills represent the experience and training she’s received
                    throughout her life — both mortal and immortal. A character
                    with high skills is well-educated or has a great deal of
                    knowledge about the world. A character with low skills might
                    be naive, sheltered, or uneducated.{' '}
                  </p>{' '}
                  <p>
                    You can purchase up to 5 dots of each skill. It’s not
                    normally possible to buy more than 5 dots in a skill.
                  </p>
                  <p>
                    Skills provide two kinds of bonuses to your character.
                    First, they allow a character to perform certain actions
                    that an untrained character simply cannot attempt. Second,
                    they augment a character’s attributes, making certain
                    actions easier because the character has experience or
                    education with a related skill.{' '}
                  </p>{' '}
                  <p>
                    For example, a character with a high Physical attribute
                    rating who does not have the Athletics skill might find it
                    difficult to scale a wall or to leap a series of hurdles. A
                    character with a high Social attribute who does not have the
                    Intimidate skill might find it difficult to bully her way
                    past a security guard.
                  </p>{' '}
                  <p>
                    {' '}
                    You should select your character’s skills based on that
                    character’s background, and then place (or purchase) more
                    dots in the skills with which the character should be most
                    profi cient. Skill levels range from novice to master, as
                    follows:
                  </p>
                  <p>
                    • Novice: You have learned the fundamentals of this field of
                    knowledge.
                  </p>
                  <p>
                    • Practiced: You have mastered the basics of this area of
                    study.{' '}
                  </p>{' '}
                  <p>
                    • Competent: You are good enough to earn a professional
                    living in this field.
                  </p>
                  <p>
                    • Expert: You have surpassed the majority of your peers and
                    are considered an expert.
                  </p>{' '}
                  <p>
                    • Master: You are world-class at this activity and
                    considered to be amongst the best in the field.
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
                  <a href="/vampire/Merits">Merits</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {get(selectedClan, 'merit', '')}
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
                  className="meritFilter"
                  value={disc}
                >
                  <Select.Option value="General">General</Select.Option>
                  <Select.Option value="Anarch">Anarch</Select.Option>
                  <Select.Option value="Camarilla">Camarilla</Select.Option>
                  <Select.Option value="Sabbat">Sabbat</Select.Option>
                  <Select.Option value="Morality">Morality</Select.Option>
                  <Select.Option value="Assamite">Assamite</Select.Option>
                  <Select.Option value="Baali">Baali</Select.Option>
                  <Select.Option value="Caitiff">Caitiff</Select.Option>
                  <Select.Option value="Cappadocians">
                    Cappadocians
                  </Select.Option>
                  <Select.Option value="Daughters of Cacophony">
                    Daughters of Cacophony
                  </Select.Option>
                  <Select.Option value="Followers of Set">
                    Followers of Set
                  </Select.Option>
                  <Select.Option value="Gangrel">Gangrel</Select.Option>
                  <Select.Option value="Gargoyle">Gargoyle</Select.Option>
                  <Select.Option value="Giovanni">Giovanni</Select.Option>
                  <Select.Option value="Lasombra">Lasombra</Select.Option>
                  <Select.Option value="Lhiannan">Lhiannan</Select.Option>
                  <Select.Option value="Malkavian">Malkavian</Select.Option>
                  <Select.Option value="Nagaraja">Nagaraja</Select.Option>
                  <Select.Option value="Nosferatu">Nosferatu</Select.Option>
                  <Select.Option value="Ravnos">Ravnos</Select.Option>
                  <Select.Option value="Salubri">Salubri</Select.Option>
                  <Select.Option value="Toreador">Toreador</Select.Option>
                  <Select.Option value="Tremere">Tremere</Select.Option>
                  <Select.Option value="Tzimisce">Tzimisce</Select.Option>
                  <Select.Option value="Ventrue">Ventrue</Select.Option>
                </Select>
                <Button
                  onClick={() => {
                    setDisc('filter by Clan');
                    setSelectedClanItemsList(clanItems);
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
                  className="meritFilter"
                  value={costName}
                >
                  {map(uniq(uniqCost), item => (
                    <Select.Option value={item}>{item}</Select.Option>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    setCost('filter by Cost');
                    setSelectedClanItemsList(clanItems);
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
                  {map(uniqSourceBook, item => (
                    <Option value={item}>{item}</Option>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    setBook('filter by source book');
                    setSelectedClanItemsList(clanItems);
                  }}
                >
                  Reset
                </Button>
              </Row>
              <h3>MERITS</h3>
              <ul className="nav flex-column nav-clans">
                {map(clanItemsList, (items, index) => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.merit}
                    key={index}
                  >
                    <Link
                      to={`/vampire/Merits/${items.merit}`}
                      className={`nav-link ${getClassName(items.merit)}`}
                      value={items.merit}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {items.merit}
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

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
  filter,
  uniq,
  without,
  replace,
} from 'lodash';
import history from 'utils/history';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Typography, Select, Row, Button } from 'antd';
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

const { Paragraph } = Typography;
export function ClanPage(props) {
  useInjectReducer({ key: 'clanPage', reducer });
  useInjectSaga({ key: 'clanPage', saga });

  useInjectReducer({ key: 'homePage', reducer: homePageReducer });
  useInjectSaga({ key: 'homePage', saga: homePageSaga });

  const [selectedClan, setSelectedClan] = useState('');
  const [clanItemsList, setClanItemList] = useState([]);
  const [disc, setDisc] = useState('filter by type');
  const [costName, setCost] = useState('filter by level');
  const [book, setBook] = useState('filter by source book');

  const {
    app: {
      rituals: { data: clanItems },
    },
    match,
  } = props;

  const filterClans = clanItems;

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

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;

    const {
      location: { hash },
    } = history;
    if (hash) {
      const hashKey = replace(hash, '#', '');
      const filterClans1 = filter(
        filterClans,
        o => getBooleanValue(o) === hashKey,
      );
      setSelectedClan(filterClans1);
    }
    if (isEmpty(selectedClan)) {
      const findClanData = find(clanItems, { title: id });
      setClanItemList(clanItems);
      setSelectedClan(findClanData);
    }
  }, [match]);

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(clanItemsList, { title: value });
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
    if (selectedClan) {
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
    }

    return false;
  }

  const groupByData1 = filter(clanItemsList, o => o.abyssal);
  const groupByData2 = filter(clanItemsList, o => o.necromancy);
  const groupByData3 = filter(clanItemsList, o => o.thaumaturgy);
  const filterClansByReduce = [
    { listName: 'Abyssal', data: groupByData1 },
    { listName: 'Necromancy', data: groupByData2 },
    { listName: 'Thaumaturgy', data: groupByData3 },
  ];

  function handleSelectOnType(type) {
    setDisc(type);
    const groupByDataType = filter(clanItems, o => o[`${type}`]);
    setClanItemList(groupByDataType);
  }

  const levelData = uniq(map(clanItems, o => o.level)).sort();

  function handleSelectOnLevel(type) {
    setCost(type);
    const groupByDataType = filter(clanItemsList, o => o.level === type);
    setClanItemList(groupByDataType);
  }

  const sourceBook = map(clanItems, item =>
    get(item, 'sourceBook_html[0].fields.bookTitle', ''),
  );

  const uniqSourceBook = without(uniq(sourceBook), '');

  function handleChangeFilter(item) {
    setBook(item);
    setClanItemList(clanItems);
    const filterClanItems = filter(
      clanItemsList,
      o => get(o, 'sourceBook_html[0].fields.bookTitle') === item,
    );
    setClanItemList(filterClanItems);
  }

  return (
    <div className="clan-page">
      <Helmet>
        <title>
          {`
          World of Darkness - MET - Vampire - Rituals -{' '}
          ${get(selectedClan, 'title', '')}`}
        </title>
        <meta name="description" content="Description of Merits" />
      </Helmet>
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
                    <div className="row" style={{ fontSize: 18 }}>
                      <h1>{get(selectedClan, 'title', '')}</h1>
                      {get(selectedClan, 'title', '') ? (
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
                {!isEmpty(get(selectedClan, 'summary')) ? (
                  <div>
                    <h2>TYPE</h2>
                    {getBooleanValue(selectedClan)}
                  </div>
                ) : (
                  <div />
                )}

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
                  <p>{get(selectedClan, 'testPool')}</p>
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
                {!isEmpty(get(selectedClan, 'sourceBook_html')) ? (
                  <p>
                    <h2>SOURCE BOOK</h2>
                    {!isEmpty(get(selectedClan, 'sourceBook_html')) ? (
                      <div>
                        <p>
                          {get(
                            selectedClan,
                            'sourceBook_html[0].fields.bookTitle',
                          )}
                        </p>
                        <p>
                          {get(
                            selectedClan,
                            'sourceBook_html[0].fields.system[0]',
                          )}
                        </p>
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
                  <h2>RITUALS</h2>
                  Necromancy, Thaumaturgy and Abyss Mysticism do not have elder
                  powers or techniques. Instead, practitioners of these arts
                  gain access to mystical rituals specific to their art. Rituals
                  are formulaic and require a significant amount of time, as
                  well as specialized implements and ingredients. You cannot buy
                  a specific ritual until you have purchased the appropriate dot
                  of Obtenebration/ Necromancy/ Thaumaturgy to support that
                  ritual- for example, learning a level 4 Thaumaturgy ritual
                  requires you already possess 4 dots in your primary
                  Thaumaturgy path. The cost to purchase a ritual is equal to
                  the ritual’s level times two. Therefore, a level 3 ritual
                  costs 6 XP to purchase. A Thaumaturgist or Necromancer cannot
                  learn more rituals than dots of Thaumaturgy/ Necromancy that
                  she currently possesses. For example, Marianna Giovanni
                  possesses 4 dots in the Sepulchre Path, her primary path, as
                  well as 3 dots in the Bone Path, and 2 dots in the Ash Path.
                  Thus, she can learn nine Necromancy rituals. Unlike
                  Thaumaturgy and Necromancy, an Abyss Mystic is not limited in
                  the number of rituals she may purchase, but must purchase one
                  ritual of each level before she is able to purchase a ritual
                  at the next-higher level. For example, in order to purchase a
                  level 2 ritual, an Abyss Mystic must already possess at least
                  one level 1 ritual.
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
              <Row type="flex">
                <Select
                  style={{ width: '70%', paddingBottom: 20 }}
                  showSearch
                  placeholder="Filter by type"
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
                  onSelect={handleSelectOnType}
                  className="meritFilter"
                  value={disc}
                >
                  <Select.Option value="abyssal">Abyssal</Select.Option>
                  <Select.Option value="necromancy">Necromancy</Select.Option>
                  <Select.Option value="thaumaturgy">Thaumaturgy</Select.Option>
                </Select>
                <Button
                  onClick={() => {
                    setDisc('filter by type');
                    setClanItemList(clanItems);
                  }}
                >
                  Reset
                </Button>
              </Row>

              <Row type="flex">
                <Select
                  style={{ width: '70%', paddingBottom: 20 }}
                  showSearch
                  placeholder="Filter By Level"
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
                  onSelect={handleSelectOnLevel}
                  className="meritFilter"
                  value={costName}
                >
                  {map(levelData, item => (
                    <Select.Option value={item}>{item}</Select.Option>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    setCost('filter by level');
                    setClanItemList(clanItems);
                  }}
                >
                  Reset
                </Button>
              </Row>

              <Row type="flex">
                <Select
                  style={{ width: '70%', paddingBottom: 20 }}
                  showSearch
                  placeholder="Filter by Source Book"
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
                  onSelect={handleChangeFilter}
                  className="meritFilter"
                  value={book}
                >
                  {map(uniqSourceBook.reverse(), item => (
                    <Select.Option value={item}>{item}</Select.Option>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    setBook('filter by source book');
                    setClanItemList(clanItems);
                  }}
                >
                  Reset
                </Button>
              </Row>
              <h3>RITUALS</h3>
              <ul className="nav flex-column nav-clans">
                {map(filterClansByReduce, (itemData, index1) => (
                  <ul key={index1}>
                    {!isEmpty(itemData.data) ? (
                      <b style={{ marginTop: 20, fontSize: 20 }}>
                        {itemData.listName}
                      </b>
                    ) : (
                      ''
                    )}
                    {map(itemData.data, (items, index) => (
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

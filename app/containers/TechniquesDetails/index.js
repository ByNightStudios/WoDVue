/* eslint-disable no-undef */
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
  split,
  without,
  uniq,
  filter,
  includes,
  concat,
  trim,
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
  const [disc, setDisc] = useState('filter by discipline');
  const [book, setBook] = useState('filter by source book');

  const {
    app: {
      techniques: { data: clanItems },
      disciplines: { data: disciplinesItems },
    },
    match,
  } = props;

  useEffect(() => {
    setSelectedClanItemsList(clanItems);
  }, []);

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;
    const findClanData = find(clanItems, { technique: id });
    setSelectedClan(findClanData);
  }, [match]);

  const filterClans = clanItemsList;

  function handleNavItemsClick(e) {
    if (e.target) {
      const value = e.target.getAttribute('value');
      const findClanData = find(filterClans, { technique: value });
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

  function handleChangeFilter(item) {
    setBook(item);
    setSelectedClanItemsList(clanItemsList);
    let filterClanItems = filter(
      clanItems,
      o => get(o, 'sourceBook_html.fields.bookTitle') === item,
    );
    if (disc && disc !== 'filter by discipline') {
      filterClanItems = filter(filterClanItems, o => {
        if (includes(map(o.disciplines, item1 => item1.fields.power), disc)) {
          return o;
        }
      });
    }

    setSelectedClanItemsList(filterClanItems);
  }

  const groupData3a = without(
    uniq(
      concat(
        'Necromancy',
        map(
          map(clanItems, o => o.prerequisites),
          item => item[0].split(' ')[0],
        ),
      ),
    ),
    '',
  );

  const groupData3b = without(
    uniq(
      concat(
        'Necromancy',
        map(
          map(clanItems, o => o.prerequisites),
          item => item[1].split(' ')[0],
        ),
      ),
    ),
    '',
  );

  const groupByData3 = uniq(concat(groupData3a, groupData3b)).sort();

  function handleChangeDisc(type) {
    setDisc(type);
    let filterDisc = filter(clanItems, o => {
      if (includes(map(o.disciplines, item => trim(item.fields.power)), type)) {
        return o;
      }
    });
    if (book && book !== 'filter by source book') {
      filterDisc = filter(
        filterDisc,
        o => get(o, 'sourceBook_html.fields.bookTitle') === book,
      );
    }
    setSelectedClanItemsList(filterDisc);
  }
  return (
    <div className="clan-page">
      <Helmet>
        <title>
          World of Darkness - MET - Techniques -
          {get(selectedClan, 'technique', '')}
        </title>
        <meta name="description" content="Description of Merits" />
      </Helmet>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div
              className={`header-single ${getClassHeaderName(
                get(selectedClan, 'technique'),
              )}`}
            >
              <div className="row" style={{ fontSize: 18 }}>
                <h1>{get(selectedClan, 'technique', '')}</h1>
                {get(selectedClan, 'technique', '') ? (
                  <Paragraph
                    copyable={{
                      text: `${window.location.href}`,
                    }}
                    style={{ marginLeft: 10, color: '#fff' }}
                  >
                    <i>Share Link</i>
                  </Paragraph>
                ) : null}
              </div>
            </div>
            <div className="boxWhite">
              {isEmpty(selectedClan) ? (
                <p>
                  Techniques aren’t disciplines; each technique is a learned
                  methodology that integrates the use of two or more disciplines
                  at once in order to create a unique effect. Such twisting of
                  the blood is very difficult for vampires with great potency,
                  as their blood is too thick for this sort of mongrel cogency.
                  Elders have static blood, are resistant to change, and are
                  unable to adapt to the swift mutations necessary to entwine
                  two powers in such a way. These powers are the province of
                  vampires who possess thinner, more transmutable vitae.
                  Individuals of the 8th generation and below can cause their
                  blood to vacillate between powers they have mastered, twisting
                  those effects into a combination of those powers. Vampires can
                  purchase techniques without a teacher, even if one or more of
                  the prerequisites include out-of-clan disciplines for that
                  character. The character simply needs to already possess the
                  prerequisites for the specific technique she wishes to learn.
                  Techniques cost 12 XP for Neonate and Ancilla vampires.
                  Vampires of the 8th generation must spend 20 XP per technique,
                  rather than the standard 12. Luminary and Master Elders cannot
                  purchase techniques at all. Techniques have no attribute
                  focuses and typically do not gain magnifi ed results if you
                  achieve an exceptional success.
                </p>
              ) : null}
              <p>
                {!isEmpty(get(selectedClan, 'prerequisites')) ? (
                  <div>
                    <h2>PREREQUISITES</h2>
                    {map(get(selectedClan, 'prerequisites'), item => (
                      <a
                        href={`/vampire/Disciplines/${split(item, ' ')[0]}`}
                        className="anchorTag"
                        style={{ marginRight: 10 }}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div />
                )}
              </p>

              {!isEmpty(get(selectedClan, 'description')) ? (
                <div>
                  <h2>DESCRIPTION</h2>
                  <div
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(
                        selectedClan.description_html,
                      ),
                    }}
                  />
                </div>
              ) : (
                <div />
              )}

              <div>
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
              </div>

              {!isEmpty(get(selectedClan, 'system')) ? (
                <div>
                  <h2>SYSTEM</h2>
                  <div
                    className="techniques-paragraph"
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(selectedClan.system_html),
                    }}
                  />
                </div>
              ) : (
                <div />
              )}

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
                  <a href="/vampire/Techniques/">Techniques</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {get(selectedClan, 'technique', '')}
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
                  value={disc}
                  placeholder="filter by discipline"
                  onChange={handleChangeDisc}
                >
                  {map(groupByData3, item => (
                    <Option value={item}>{item}</Option>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    setDisc('filter by discipline');
                    if (book && book !== 'filter by source book') {
                      const filterClanItems = filter(
                        clanItems,
                        o =>
                          get(o, 'sourceBook_html.fields.bookTitle') === book,
                      );
                      setSelectedClanItemsList(filterClanItems);
                    } else {
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
                    if (disc && disc !== 'filter by discipline') {
                      const filterClanItems = filter(clanItems, o => {
                        if (
                          includes(
                            map(o.disciplines, item1 => item1.fields.power),
                            disc,
                          )
                        ) {
                          return o;
                        }
                      });
                      setSelectedClanItemsList(filterClanItems);
                    } else {
                      setSelectedClanItemsList(clanItems);
                    }
                  }}
                >
                  Reset
                </Button>
              </Row>
              <h3>TECHNIQUES</h3>
              <ul className="nav flex-column nav-clans">
                {map(filterClans, (items, index) => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.technique}
                    key={index}
                  >
                    <Link
                      to={`/vampire/Techniques/${items.technique}`}
                      className={`nav-link ${getClassName(items.technique)}`}
                      value={items.technique}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {items.technique}
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

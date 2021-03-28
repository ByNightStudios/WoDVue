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
import { map, get, isEmpty, find, split, without, uniq, filter } from 'lodash';
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

  const {
    app: {
      techniques: { data: clanItems },
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
    setSelectedClanItemsList(clanItemsList);
    const filterClanItems = filter(
      clanItems,
      o => get(o, 'sourceBook_html.fields.bookTitle') === item,
    );
    setSelectedClanItemsList(filterClanItems);
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

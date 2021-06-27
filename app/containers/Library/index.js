/* eslint-disable camelcase */
/* eslint-disable guard-for-in */
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
  filter,
  groupBy,
  sortBy,
  concat,
} from 'lodash';
import { Typography, Menu } from 'antd';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import homePageReducer from 'containers/HomePage/reducer';
import homePageSaga from 'containers/HomePage/saga';
import makeSelectHomePage from 'containers/HomePage/selectors';
import { makeSelectApp } from 'containers/App/selectors';

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import makeSelectClanPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import './style.css';

const { Paragraph } = Typography;
const { SubMenu } = Menu;

export function ClanPage(props) {
  useInjectReducer({ key: 'clanPage', reducer });
  useInjectSaga({ key: 'clanPage', saga });

  useInjectReducer({ key: 'homePage', reducer: homePageReducer });
  useInjectSaga({ key: 'homePage', saga: homePageSaga });
  const [selectedClan, setSelectedClan] = useState('');
  const [libMenu, setLibMenu] = useState([]);
  const [subItemsList, setSubItemsList] = useState([]);
  const [subItemsList1, setSubItemsList1] = useState([]);

  const {
    app: {
      contentPages: { data: clanItems },
      attributes: { data: clanItems_1 },
      backgrounds: { data: clanItems_2 },
    },
    match,
  } = props;

  const filterClans = filter(clanItems, o => !o.exclude);

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;
    const findClanData = find(clanItems, { title: id });
    setSelectedClan(findClanData);
  }, [match]);

  useEffect(() => {
    const isLibraryEntryClanItems = filter(clanItems, { isLibraryEntry: true });
    const groupedItems = groupBy(isLibraryEntryClanItems, 'libraryTreeLevel');
    const groupedItemsArray = groupedItems[1];

    const subItems = concat(groupedItems[2]);
    setSubItemsList(subItems);
    setSubItemsList1(groupedItems[3]);
    // // eslint-disable-next-line no-restricted-syntax

    const sortedGroupItemsArray = sortBy(groupedItemsArray, ['menu'], 'asc');
    setLibMenu(sortedGroupItemsArray);
  }, [clanItems]);

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

  function getRenderSubItems2(title1) {
    const itemsOfSubMenu = filter(
      subItemsList1,
      item => item.directLibraryParent_html.fields.title === title1,
    );
    return (
      <Menu.ItemGroup key={title1}>
        {map(itemsOfSubMenu, item => (
          <Menu.Item key={item.title}>
            <Link
              to={`/vampire/Library/${item.title}`}
              value={item.title}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {item.title}
            </Link>
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    );
  }

  function getRenderSubItems(title1) {
    const itemsOfSubMenu = filter(
      subItemsList,
      item => item.directLibraryParent_html.fields.title === title1,
    );
    return (
      <Menu.ItemGroup key={title1}>
        {map(itemsOfSubMenu, item => (
          <SubMenu
            style={{ paddingLeft: 0 }}
            key={item.title}
            title={
              <Link
                to={`/vampire/Library/${item.title}`}
                value={item.title}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {item.title}
              </Link>
            }
          >
            {getRenderSubItems2(item.title)}
          </SubMenu>
        ))}
      </Menu.ItemGroup>
    );
  }

  return (
    <div className="clan-page">
      <Helmet>
        <title>
          {`World of Darkness - MET - Vampire - Library -
          ${get(selectedClan, 'title')}`}
        </title>
        <meta name="description" content="Description of QuickStart" />
      </Helmet>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div
              className={`header-single ${getClassHeaderName(
                get(selectedClan, 'title'),
              )}`}
              style={{ fontSize: 18 }}
            >
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
            <div className="boxWhite content-page-wrap">
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

              {!isEmpty(get(selectedClan, 'quote')) ? (
                <div>
                  <h2>QUOTE</h2>
                  <div
                    className="system"
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(selectedClan.quote_html),
                    }}
                  />
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'system')) ? (
                <div>
                  <h2>SYSTEM</h2>
                  <div
                    className="system"
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(selectedClan.system_html),
                    }}
                  />
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'eratta')) ? (
                <div>
                  <h2>ERRATA</h2>
                  <div
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(selectedClan.eratta_html),
                    }}
                  />
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

              {isEmpty(selectedClan) ? (
                <div>
                  <i>
                    “My childe, alway remember this most important lesson:
                    sanguis pretium amissis ludum. Blood is the price of losing
                    the game.”
                  </i>
                  <p>— Alain Martel, Luminary Elder, Clan Ventrue</p>
                </div>
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
                  <a href="/vampire/Library">Library</a>
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
                  <a className="nav-link" href="/Disciplines">
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
                  <a className="nav-link" href="/vampire/Library">
                    Library
                  </a>
                </li>
              </ul>
            </div>
            <div className="boxWhite">
              <h3>LIBRARY</h3>
              <ul className="nav flex-column nav-clans">
                <Menu
                  onClick={() => console.log('clicked')}
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  mode="inline"
                >
                  {map(libMenu, (item, index) => (
                    <SubMenu
                      key={item.title + index}
                      title={
                        <Link
                          to={`/vampire/Library/${item.title}`}
                          value={item.title}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          {item.title}
                        </Link>
                      }
                    >
                      {getRenderSubItems(item.title)}
                    </SubMenu>
                  ))}
                  <SubMenu key="Attribute" title="Attribute">
                    {map(clanItems_1, (item, indexItem) => (
                      <Menu.Item key={indexItem + item}>
                        <Link
                          to={`/vampire/Attributes/${item.attribute}`}
                          className={`nav-link ${getClassName(item.attribute)}`}
                          value={item.attribute}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          {item.attribute}
                        </Link>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                  <SubMenu key="Backgrounds" title="Backgrounds">
                    {map(clanItems_2, (item, indexItem) => (
                      <Menu.Item key={indexItem + item}>
                        <Link
                          to={`/vampire/Backgrounds/${item.title}`}
                          className={`nav-link ${getClassName(item.title)}`}
                          value={item.title}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          {item.title}
                        </Link>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                </Menu>
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

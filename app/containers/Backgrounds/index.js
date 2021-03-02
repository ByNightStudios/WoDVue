/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 *
 * ClanPage
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { map, get, isEmpty, find } from 'lodash';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import homePageReducer from 'containers/HomePage/reducer';
import homePageSaga from 'containers/HomePage/saga';
import makeSelectHomePage from 'containers/HomePage/selectors';
import { makeSelectApp } from 'containers/App/selectors';

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

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
      backgrounds: { data: clanItems },
    },
  } = props;

  const filterClans = clanItems;

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

  console.log(selectedClan);

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
              <h1>{get(selectedClan, 'title', '')}</h1>
            </div>
            <div className="boxWhite">
              {!isEmpty(get(selectedClan, 'description')) ? (
                <div>
                  <h2>DESCRIPTION</h2>
                  <div
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(selectedClan.description_html),
                    }}
                  />
                </div>
              ) : (
                <div />
              )}

              {!isEmpty(get(selectedClan, 'system')) ? (
                <div>
                  <h2>SYSTEMas</h2>
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
                  <h2>ERATTA</h2>
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
                <div />
              )}

              {isEmpty(selectedClan) ? (
                <div>
                  The following backgrounds are available to your character. In
                  general, having multiple dots in a background allows for more
                  effective or more frequent use of that background’s benefit.
                  Some backgrounds change your character during character
                  creation, while others affect the character only after she
                  enters the game. Read each background carefully to determine
                  which are appropriate for your character’s story.
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
                  <a href="#">Backgrounds</a>
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
                  <a
                    className="nav-link"
                    href="/WoDVue/monsters/vampire/clan/"
                  >
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
                  <a className="nav-link" href="/WoDVue/monsters/vampire/Techniques">
                    Techniques
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Skills">
                    Skills
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Merits">
                    Merits
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Flaws">
                    Flaws
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Attributes">
                    Attributes
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Backgrounds">
                    Backgrounds
                  </a>
                </li>
              </ul>
            </div>
            <div className="boxWhite">
              <h3>BACKGROUNDS</h3>
              <ul className="nav flex-column nav-clans">
                {map(filterClans, (items, index) => (
                  <li
                    className="nav-item"
                    onClick={handleNavItemsClick}
                    value={items.title}
                    key={index}
                  >
                    <Link
                      to="/Backgrounds"
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

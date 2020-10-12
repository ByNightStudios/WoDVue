/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
/**
 *
 * Monster
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { createStructuredSelector } from 'reselect';
import { isEqual, get, isEmpty, find } from 'lodash';
import { compose } from 'redux';
import { Alert } from 'antd';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import Header from 'components/Header';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';

import makeSelectMonster from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getDropDownItems } from './actions';
import './style.css';

export function Monster({ OnRequestDropDownItems, monster, match }) {
  useInjectReducer({ key: 'monster', reducer });
  useInjectSaga({ key: 'monster', saga });

  const { loading, data } = monster;
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    const pathData = window.location.pathname.split('/');
    if (pathData.length === 6) {
      const clanName = pathData[4];
      if (clanName) {
        OnRequestDropDownItems(clanName.toLocaleLowerCase());
      }
    }
  }, [window.location.pathname]);

  useEffect(() => {
    const pathData = window.location.pathname.split('/');
    if (pathData.length === 6) {
      const clanName = pathData[4];
      const itemName = pathData[5];
      if (clanName) {
        OnRequestDropDownItems(clanName.toLocaleLowerCase());
      }
      const filterData = find(monster.data, o => o.id === itemName);
      if (filterData) {
        setSelectedItem(filterData);
      }
    }
  }, [monster.data]);

  function handleSelectedItems(dataItem) {
    setSelectedItem(dataItem);
  }

  function handleRenderHeader(item, desc) {
    if (
      isEqual(item, 'id') ||
      isEqual(item, 'contentTypeId') ||
      get(desc, '[0].sys')
    ) {
      return false;
    }

    if (isEqual(item, 'pins')) {
      return 'PINS: GET YOUR VAMPIRE PIN NOW!';
    }
    return `${item}:`;
  }

  function handleRenderDesc(desc, item) {
    if (
      get(desc, '[0].sys') ||
      isEqual(item, 'id') ||
      isEqual(item, 'contentTypeId')
    ) {
      return false;
    }
    return desc;
  }

  function renderItems() {
    const array = [];
    if (selectedItem) {
      for (const p in selectedItem) {
        array.push(
          <div style={{ color: '#fff' }} key={p} className="mainContent">
            <div className="data">
              <div style={{ color: '#fff' }} className="title">
                {handleRenderHeader(p, selectedItem[p])}
              </div>
              <span>{handleRenderDesc(selectedItem[p], p)}</span>
            </div>
          </div>,
        );
      }
    }
    return array;
  }

  function renderEmpty() {
    if (!isEmpty(selectedItem)) {
      return false;
    }

    return (
      <div className="d-flex flex-column align-content-center justify-content-center w-100 h-100">
        <Alert
          message="Informational Notes"
          description="Please select items from the above clan items  "
          type="info"
          showIcon
        />
      </div>
    );
  }
  return (
    <div className="d-flex flex-column align-items-center justify-content-between w-100 h-100">
      <Helmet>
        <title>Monster</title>
        <meta name="description" content="Description of Monster" />
      </Helmet>
      <div style={{ width: '100% ' }}>
        <Header />
        <NavBar
          OnRequestDropDownItems={OnRequestDropDownItems}
          loading={loading}
          data={data}
          handleSelectedItems={handleSelectedItems}
          match={match}
        />
      </div>
      <div className="d-flex flex-column w-100 container clan-info">
        {renderItems()}
        {renderEmpty()}
      </div>
      <Footer />
    </div>
  );
}

Monster.propTypes = {
  OnRequestDropDownItems: PropTypes.func,
  monster: PropTypes.object,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  monster: makeSelectMonster(),
});

function mapDispatchToProps(dispatch) {
  return {
    OnRequestDropDownItems: params => dispatch(getDropDownItems(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Monster);

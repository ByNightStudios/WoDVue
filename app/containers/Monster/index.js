/* eslint-disable react/no-array-index-key */
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
import { Alert, Collapse } from 'antd';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import Header from 'components/Header';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';

import makeSelectMonster from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getDropDownItems, getDisciplines } from './actions';
import './style.css';

const { Panel } = Collapse;
export function Monster({
  OnRequestDropDownItems,
  monster,
  match,
  OnRequestDisciplines,
}) {
  useInjectReducer({ key: 'monster', reducer });
  useInjectSaga({ key: 'monster', saga });

  const { loading, data, tech } = monster;
  const [selectedItem, setSelectedItem] = useState({});
  const [techData1, setTechData1] = useState([]);

  function getQueryParams(params) {
    if (params === 'disciplines') {
      return 'discipline';
    }
    if (params === 'clan') {
      return 'clans';
    }
    return params;
  }

  useEffect(() => {
    const pathData = window.location.pathname.split('/');
    if (pathData.length === 6) {
      const clanName = pathData[4];
      if (clanName && isEmpty(selectedItem)) {
        OnRequestDropDownItems(getQueryParams(clanName.toLocaleLowerCase()));
      }
    }
    clevertap.event.push(window.location.pathname);
  }, [window.location.pathname]);

  function getItems(item) {
    if (item.title) {
      return item.title;
    }
    if (item.merit) {
      return item.merit;
    }
    if (item.flaw) {
      return item.flaw;
    }

    if (item.technique) {
      return item.technique;
    }
    return item.attribute;
  }

  useEffect(() => {
    const pathData = window.location.pathname.split('/');
    if (pathData.length === 6) {
      const clanName = pathData[4];
      const itemName = pathData[5];
      if (clanName && isEmpty(selectedItem)) {
        OnRequestDropDownItems(getQueryParams(clanName.toLocaleLowerCase()));
      }
      const filterData = find(monster.data, o =>
        isEqual(getItems(o).toString(), itemName.toString().replace('_', ' ')),
      );
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

    if (isEqual(item, 'clanArt')) {
      return (
        <img
          src={desc}
          alt={item}
          style={{
            width: 200,
            height: 200,
            objectFit: 'contain',
            marginTop: 10,
          }}
        />
      );
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

  function setTechData(techData) {
    if (techData && techData.length > 0) {
      setTechData1(techData);
      setSelectedItem('');
    }
  }

  function renderTechItem(item) {
    const array = [];
    if (item) {
      for (const p in item) {
        array.push(
          <div style={{ color: '#fff' }} key={p} className="mainContent">
            <div className="data">
              <div style={{ color: '#fff' }} className="title">
                {handleRenderHeader(p, item[p])}
              </div>
              <span>{handleRenderDesc(item[p], p)}</span>
            </div>
          </div>,
        );
      }
    }
    return array;
  }

  function renderTechData() {
    if (!isEmpty(selectedItem)) {
      return false;
    }
    return techData1.map((item, index) => (
      <Collapse id="collapse">
        <Panel header={item.technique} key={index} id="collapse">
          <div id="collapse1">{renderTechItem(item)}</div>
        </Panel>
      </Collapse>
    ));
  }
  function renderEmpty() {
    if (!isEmpty(selectedItem) || !isEmpty(techData1)) {
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
    <div
      className="d-flex flex-column align-items-center justify-content-between w-100"
      style={{ height: '100vh' }}
    >
      <Helmet>
        <title>World of Darkness - MET - Vampire - Monster</title>
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
          OnRequestDisciplines={OnRequestDisciplines}
          tech={tech}
          setTechData={setTechData}
        />
      </div>
      <div className="d-flex flex-column w-100 container clan-info">
        {renderItems()}
        {renderEmpty()}
        <div style={{ marginTop: '5vh' }}>{renderTechData()}</div>
      </div>
      <Footer />
    </div>
  );
}

Monster.propTypes = {
  OnRequestDropDownItems: PropTypes.func,
  monster: PropTypes.object,
  match: PropTypes.object,
  OnRequestDisciplines: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  monster: makeSelectMonster(),
});

function mapDispatchToProps(dispatch) {
  return {
    OnRequestDropDownItems: params => dispatch(getDropDownItems(params)),
    OnRequestDisciplines: () => dispatch(getDisciplines()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Monster);

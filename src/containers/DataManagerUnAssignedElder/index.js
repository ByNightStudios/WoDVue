/**
 *
 * DataManagerUnAssignedElder
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Table, Row, Input, Typography } from 'antd';
import { get } from 'lodash';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { getRenderingHeader } from '../../common/helpers';
import SideNavigation from '../../components/SideNavigation';
import mappedElderData from '../../utils/elderexpirymapped';
import makeSelectDataManagerUnAssignedElder from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getElderList } from './actions';
import { columnsData } from './dataManager';

export function DataManagerUnAssignedElder(props) {
  useInjectReducer({ key: 'dataManagerUnAssignedElder', reducer });
  useInjectSaga({ key: 'dataManagerUnAssignedElder', saga });

  const [navigationDeployed, setNavigationDeployed] = useState(true);

  const handleNavigationToggle = () => {
    setNavigationDeployed(!navigationDeployed);
  };

  useEffect(() => {
    props.getElderListData();
  }, []);

  const { dataManagerUnAssignedElder } = props;
  const { data: elderData, loading: elderLoading } = dataManagerUnAssignedElder;

  function handleSearch(event) {
    const {
      target: { value },
    } = event;
    props.getElderListData(value);
  }

  function handleOnChange(e) {
    if (e.target.value === '') {
      props.getElderListData();
    }
  }
  return (
    <div>
      <Helmet>
        <title>DataManagerUnAssignedElder</title>
        <meta
          name="description"
          content="Description of DataManagerUnAssignedElder"
        />
      </Helmet>
      {getRenderingHeader(props.user)}

      <div
        className={
          navigationDeployed
            ? 'sidebar-page sidebar-page--open position-relative'
            : 'sidebar-page sidebar-page--closed position-relative'
        }
      >
        {navigationDeployed ? (
          <SideNavigation
            handleClose={() => handleNavigationToggle(setNavigationDeployed)}
          />
        ) : (
          <Button
            type="button"
            className="btn btn-trigger"
            onClick={() => handleNavigationToggle(setNavigationDeployed)}
          >
            <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001" />
          </Button>
        )}

        <main className="sidebar-page-wrapper position-relative">
          <Table
            dataSource={mappedElderData(get(elderData, 'elders', []))}
            columns={columnsData()}
            loading={elderLoading}
            bordered
            title={() => (
              <Row type="flex" justify="space-between" align="middle">
                <Typography.Text>Operate Elder Plan</Typography.Text>
                <Input.Search
                  onSearch={handleSearch}
                  onPressEnter={handleSearch}
                  onChange={handleOnChange}
                  style={{ width: 300 }}
                  allowClear
                />
              </Row>
            )}
            scroll={{ x: 1000 }}
            pagination={{
              total: get(elderData, 'count[0].count', []),
            }}
          />
        </main>
      </div>
    </div>
  );
}

DataManagerUnAssignedElder.propTypes = {
  getElderListData: PropTypes.func,
  dataManagerUnAssignedElder: PropTypes.object,
  user: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  dataManagerUnAssignedElder: makeSelectDataManagerUnAssignedElder(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getElderListData: payload => dispatch(getElderList(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DataManagerUnAssignedElder);

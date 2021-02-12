import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { get } from 'lodash';

import { columns, getConsumerData } from './dataManager';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';

import { getRenderingHeader } from '../../common/helpers';
import requireAuth from '../../hoc/requireAuth';
import hasPermission from '../../hoc/hasPermission';
import styles from './elders-dashboard.scss';

const handleNavigationToggle = setNavigationDeployed =>
  setNavigationDeployed(prevState => !prevState);

const ElderDashboard = props => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [navigationDeployed, setNavigationDeployed] = useState(true);

  const [tableOptions, setTableOptions] = useState({
    showHeader: true,
    bordered: true,
    loading: false,
  });

  const { user, isEdit } = props;

  useEffect(() => {
    document.title = 'Emoha Admin | Elders Dashboard';

    const id = get(props.match.params, 'id', null);
    getConsumerData(
      id,
      tableOptions,
      setTableData,
      setTableOptions,
      setLoading,
    );
  }, []);

  return (
    <>
      {getRenderingHeader(user)}
      <div
        className={
          navigationDeployed
            ? 'elderslisting-page sidebar-page sidebar-page--open position-relative'
            : 'elderslisting-page sidebar-page sidebar-page--closed position-relative'
        }
        style={styles}
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
            rowKey={record => record.index}
            {...tableOptions}
            columns={columns(setLoading, setTableData, isEdit)}
            scroll={{ x: 1000, y: window.innerHeight - 280 }}
            dataSource={tableData}
            pagination={false}
          />
        </main>
      </div>

      {isLoading && <PageLoader />}
    </>
  );
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(
  mapStateToProps,
  null,
)(ElderDashboard);

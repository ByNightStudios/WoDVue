/* eslint-disable no-param-reassign */
/**
 *
 * MyElders
 *
 */

import React, { memo, useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Table, Button, Row, Select, Typography } from 'antd';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { get, isEmpty, map, includes } from 'lodash';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectMyElders, { userInfo } from './selectors';
import reducer from './reducer';
import saga from './saga';

import { getRenderingHeader } from '../../common/helpers';
import SideNavigation from '../../components/SideNavigation';
import { mappedMyElders } from '../../utils/elderexpirymapped';
import { columns } from './dataManager';
import styles from './styles.scss';
import { getListing, emergencyAction, alertAction, ermData } from './actions';

const handleNavigationToggle = setNavigationDeployed =>
  setNavigationDeployed(prevState => !prevState);

const onClickPagination = (search, page, setPage, getEldersListing) => {
  const payload = {
    page,
    query: search,
  };

  setPage(page);
  getEldersListing(payload);
};

const getRenderingSubHeader = (
  search,
  setSearch,
  page,
  setPage,
  getEldersListing,
) => {
  return (
    <Row type="flex" className="global-search" key={0}>
      <Row type="flex">
        <Form.Group className="position-relative" controlId="searchEmergencies">
          <Form.Control
            placeholder="Search for Elders"
            onKeyDown={null}
            onChange={e => setSearch(e.currentTarget.value)}
            value={search}
          />
        </Form.Group>
        <Button
          onClick={() => {
            const payload = {
              page,
              query: search,
            };

            setPage(1);
            getEldersListing(payload);
          }}
          shape="circle"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </Row>
    </Row>
  );
};

const MyElders = props => {
  useInjectReducer({ key: 'myElders', reducer });
  useInjectSaga({ key: 'myElders', saga });

  const [navigationDeployed, setNavigationDeployed] = useState(true);

  const [page, setPage] = useState(1);

  const [tableOptions, setTableOptions] = useState({
    showHeader: true,
    bordered: true,
    loading: false,
    pagination: { position: 'bottom', total: 0, pageSize: 20 },
  });

  const [search, setSearch] = useState('');
  const [ermSearchData, setErmData] = useState([]);

  const {
    user,
    myElders: {
      data: { count, elders },
      loading,
      ermData,
    },
  } = props;

  const { data: ermList, loading: ermListLoading } = ermData;
  useEffect(() => {
    const payload = {
      page,
      query: search,
    };

    props.getEldersListing(payload);
    props.getErmListing();
  }, []);

  useEffect(() => {
    setTableOptions(prevState => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        total: get(count, '[0].count'),
      },
      loading,
    }));
  }, [loading, count]);

  elders &&
    elders.forEach(elder => {
      elder.customer_id = get(elder, 'zoho_object.Customer_ID', 'N/A');
      elder.contact_number = `${get(elder, 'country_code', 'N/A')}-${get(
        elder,
        'mobile_number',
        'N/A',
      )}`;
      elder.full_address =
        get(elder, 'full_address') && !isEmpty('elder.full_address')
          ? get(elder, 'full_address')
          : 'N/A';
      elder.plan_name = get(elder, 'name', 'N/A');
      const status = get(elder, 'status');

      if (status && status === 1) {
        elder.plan_status = 'Active';
      } else if (status && status === 2) {
        elder.plan_status = 'Expired';
      } else if (status && status === 3) {
        elder.plan_status = 'Unpaid';
      } else if (status && status === 4) {
        elder.plan_status = 'On Hold';
      } else {
        elder.plan_status = 'N/A';
      }
    });

  function handleErmChange(value) {
    if (isEmpty(value)) {
      const payloadElderList = {
        page,
        query: null,
      };
      props.getEldersListing(payloadElderList);
    }
    setErmData(value)
  }

  function handleErmOnSearch() {
    const payloadElderList = {
      page: 1,
      erm: ermSearchData,
    };
    props.getEldersListing(payloadElderList);
  }

  function renderErmFilter() {

    const { user: { roles } } = props;
    if(includes(['ERM', roles])){
      return false;
    }
    return (
      <>
        <Select
          mode="multiple"
          style={{ width: 380, marginLeft: 10, marginRight: 10 }}
          onChange={handleErmChange}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          loading={ermListLoading}
          value={ermSearchData}
          placeholder="Search for erm"
        >
          {map(mappedMyElders(ermList, user), item => (
            <Select.Option value={item.id}>
              {item.full_name}
            </Select.Option>
          ))}
        </Select>
        <Button
          shape="circle"
          onClick={() => {
            setErmData([]);
            const payloadElderList = {
              page,
              query: null,
            };
            props.getEldersListing(payloadElderList);
          }}
          disabled={isEmpty(ermSearchData)}
        >
          <ClearOutlined />
        </Button>
        <Button
          shape="circle"
          disabled={isEmpty(ermSearchData)}
          onClick={handleErmOnSearch}
        >
          <SearchOutlined />
        </Button>
      </>
    )
  }

  function renderTitle() {
    return (
      <Row type="flex" justify="space-between">
        <Typography.Text strong>My Elder</Typography.Text>
        <Row type="flex" justify="space-between" align="middle">
          {getRenderingSubHeader(
            search,
            setSearch,
            page,
            setPage,
            props.getEldersListing,
          )}
          <>
            {renderErmFilter()}
          </>
        </Row>
      </Row>
    )
  }

  return (
    <div>
      <Helmet>
        <title>Elders</title>
        <meta name="description" content="Description of Elders" />
      </Helmet>

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
            title={() => renderTitle()}
            columns={columns(props.emergencyAction, props.alertAction)}
            scroll={{ x: 900, y: window.innerHeight - 310 }}
            dataSource={elders || []}
            pagination={{
              onChange: (page, pageSize) =>
                onClickPagination(
                  search,
                  page,
                  setPage,
                  props.getEldersListing,
                ),
              pageSize: tableOptions.pagination.pageSize,
              total: tableOptions.pagination.total,
              showSizeChanger: false,
            }}
          />
        </main>
      </div>
    </div>
  );
};

MyElders.propTypes = {
  dispatch: PropTypes.func.isRequired,
  getEldersListing: PropTypes.func.isRequired,
  emergencyAction: PropTypes.func.isRequired,
  alertAction: PropTypes.func.isRequired,
  elders: PropTypes.object,
  user: PropTypes.object,
  getErmListing: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  myElders: makeSelectMyElders(),
  user: userInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getEldersListing: page => dispatch(getListing(page)),
    getErmListing: () => dispatch(ermData()),
    emergencyAction: (id, isSimulated) =>
      dispatch(
        emergencyAction({
          consumer_uuid: id,
          is_simulated: isSimulated,
        }),
      ),
    alertAction: (id, isSimulated) =>
      dispatch(
        alertAction({
          consumer_uuid: id,
          is_alarm: isSimulated,
        }),
      ),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(MyElders);

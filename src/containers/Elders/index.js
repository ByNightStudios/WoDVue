/* eslint-disable no-param-reassign */
/**
 *
 * Elders
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Table,
  Radio,
  Modal,
  Input,
  Typography,
  Select,
  Row,
  Col,
  Pagination,
  Divider,
  Button
} from 'antd';
import { map } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { get, isEmpty, isNull } from 'lodash';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectElders, { userInfo } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { emergencyAction, alertAction } from './actions';
import { getRenderingHeader } from '../../common/helpers';
import SideNavigation from '../../components/SideNavigation';
import AssignErmElder from '../AssignErmElder';
import mappedElderData from '../../utils/elderexpirymapped';

import { columns } from './dataManager';

import { getListing, deleteErmMapping, ermData } from './actions';

const handleNavigationToggle = setNavigationDeployed =>
  setNavigationDeployed(prevState => !prevState);

const onClickPagination = (page, setPage) => setPage(page);

const handleChange = (filters, setFilteredInfo) => {
  setFilteredInfo(filters);
};

const Elders = props => {
  useInjectReducer({ key: 'elders', reducer });
  useInjectSaga({ key: 'elders', saga });

  const [navigationDeployed, setNavigationDeployed] = useState(true);

  const [page, setPage] = useState(1);
  const [tableOptions, setTableOptions] = useState({
    showHeader: true,
    bordered: true,
    loading: false,
    pagination: {},
  });

  const [filteredInfo, setFilteredInfo] = useState([]);

  const [rowRecord, setRowRecord] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planStatus, setPlanStatus] = useState([]);
  const [queryData, setQueryData] = useState([]);
  const [ermSearchData, setErmData] = useState([]);

  const {
    user,
    elders: {
      data,
      data: { count },
      loading,
      erm,
    },
  } = props;

  useEffect(() => {
    props.getErmData();
  }, []);

  const { loading: ermListLoading, data: ermList } = erm;
  const [DefaultValue, setDefaultValue] = useState(null)
  useEffect(() => {
    const payload = {
      plan_name: planName,
      plan_status: planStatus,
      page,
      query: queryData,
      erm: ermSearchData,
      role: props.isEdit ? 'Data Manager' : 'ERM',
    };
    props.getEldersListing(payload);
  }, [page]);

  useEffect(() => {
    setTableOptions(prevState => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        total: get(count, '[0].count', 0),
      },
      loading,
    }));
  }, [loading, count]);


  function handleOpenModal(record) {
    setRowRecord(record);
    setOpenModal(true);
  }

  function handleCancel() {
    setRowRecord('');
    setOpenModal(false);
    setTimeout(() => {
      const payloadElderList = {
        plan_name: planName,
        plan_status: planStatus,
        page,
        query: null,
        erm: ermSearchData,
        role: props.isEdit ? 'Data Manager' : 'ERM',
      };
      props.getEldersListing(payloadElderList);
    }, 1000);
  }

  function handlePlanNameChange(value) {
    setPlanName(value);
  }

  function handlePlanStatusChange(value) {
    setPlanStatus(value);
  }

  function handleDeleteModal(record) {
    const payload = {
      user_id: get(record, 'uuid'),
      admin_id: get(record, 'adminData.admin_user.uuid', get(record, 'adminData.uuid')),
      role: 'erm',
    };
    props.deleteErm(payload);
    setTimeout(() => {
      const payloadElderList = {
        plan_name: planName,
        plan_status: planStatus,
        page,
        query: null,
        erm: ermSearchData,
        role: props.isEdit ? 'Data Manager' : 'ERM',
      };
      props.getEldersListing(payloadElderList);
    }, 1000);
  }

  function handleDebounce(event) {
    if (event.target.value === '') {
      setQueryData(null);
    } else {
      setQueryData(event.target.value);
    }
  }

  function handleQuery() {
    setDefaultValue(1)
    const payloadElderList = {
      plan_name: planName,
      plan_status: planStatus,
      page: 1,
      query: queryData,
      erm: ermSearchData,
      role: props.isEdit ? 'Data Manager' : 'ERM',
    };

    props.getEldersListing(payloadElderList);
  }

  function handleSearchDisabled() {
    if (planName || !isEmpty(planStatus) || ermData) {
      return false;
    }
    return true;
  }

  function handleErmChange(value) {
    setErmData(value);
  }

  function handleErmOnSearch() {
    const payloadElderList = {
      plan_name: planName,
      plan_status: planStatus,
      page: 1,
      query: queryData,
      erm: ermSearchData,
      role: props.isEdit ? 'Data Manager' : 'ERM',
    };
    props.getEldersListing(payloadElderList);
  }

  function renderTitle() {
    return (
      <Col span={24}>
        <Row type="flex" justify="space-between">
          <Typography.Title level={5}> Elder Dashboard</Typography.Title>
          <Col span={12}>

            <Row style={{ marginTop: 5 }} type="flex" justify="end">
              <Input.Search
                placeholder="Search Elder"
                style={{ maxWidth: 500 }}
                type="primary"
                onChange={handleDebounce}
                onPressEnter={handleQuery}
                onSearch={handleQuery}
              />
              <Typography.Text> Results found : </Typography.Text>
              <Typography.Text strong>{' '}{get(data, 'elders', []).length}</Typography.Text>
              <Typography> of page </Typography>
              <Typography.Text>{page}</Typography.Text>
            </Row>

          </Col>
        </Row>
        <Divider />
        <Row type="flex" align="middle" justify="space-between">
          <Row type="flex" align="middle">
            <Typography.Text strong>Plan Name:</Typography.Text>
            <Select
              style={{ width: '12vw', marginLeft: 20 }}
              onChange={handlePlanNameChange}
              value={planName}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value={1}>Emoha Assure Plan </Select.Option>
              <Select.Option value={2}>Empower Plan</Select.Option>
              <Select.Option value={3}>SMART HOME CARE</Select.Option>
              <Select.Option value={4}>#MissionEldersFirst</Select.Option>
              <Select.Option value={5}>
                Emoha Assure Complimentary
                    </Select.Option>
              <Select.Option value={6}>
                Emoha Empower Complimentary
                    </Select.Option>
            </Select>
          </Row>
          <>
            <Row type="flex" justify="space-between" align="middle">
              <Typography.Text strong>ERM:</Typography.Text>
              <>
                <Select
                  mode="multiple"
                  style={{ width: '12vw', marginLeft: 20 }}
                  onChange={handleErmChange}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  loading={ermListLoading}
                  value={ermSearchData}
                >
                  {map(ermList, item => (
                    <Select.Option value={item.id}>
                      {item.full_name}
                    </Select.Option>
                  ))}
                </Select>
              </>

            </Row>
            <Row type="flex" align="middle">
              <Typography.Text strong>Plan Status:</Typography.Text>
              <Row type="flex" justify="end">
                <Select
                  mode="multiple"
                  style={{ width: '12vw', marginLeft: 20 }}
                  onChange={handlePlanStatusChange}
                  value={planStatus}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option value={1}>Active</Select.Option>
                  <Select.Option value={3}>Cancelled</Select.Option>
                  <Select.Option value={4}>On Hold</Select.Option>
                </Select>
              </Row>
            </Row>
            <Button
              disabled={handleSearchDisabled()}
              onClick={handleQuery}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                setPlanName('');
                setPlanStatus([]);
                setErmData([]);
                setPage(1);
                const payloadElderList = {
                  page: 1,
                  query: null,
                  role: props.isEdit ? 'Data Manager' : 'ERM',
                };
                props.getEldersListing(payloadElderList);
              }}
              disabled={handleSearchDisabled()}
            >
              Clear
            </Button>
          </>
        </Row>
      </Col>

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
          <div
            className="d-flex flex-row align-items-start w-100"
            style={{ marginBottom: 20 }}
          >

          </div>

          <Table
            title={() => renderTitle()}
            rowKey={record => record.index}
            {...tableOptions}

            columns={columns(filteredInfo, props.isEdit, handleOpenModal, handleDeleteModal, props.emergencyAction, props.alertAction)}
            scroll={{ x: 900, y: window.innerHeight - 180 }}
            dataSource={mappedElderData(get(data, 'elders'))}
            onChange={(filters, sorter, extra) => {
              setDefaultValue(null)
              const { action } = extra;
              if (action === 'filter') {
                handleChange(filters, setFilteredInfo);
              }
            }}
            pagination={{
              onChange: page => {
                setDefaultValue(null)
                onClickPagination(page, setPage);
                const payload = {
                  page: 1,
                  role: props.isEdit ? 'Data Manager' : 'ERM',
                };
                props.getEldersListing(payload);
              },
              current: DefaultValue,
              pageSize: 20,
              total: tableOptions.pagination.total,
              showSizeChanger: false,
            }}
          />
        </main>
      </div>
      <Modal
        visible={openModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        center
        width={800}
      >
        <AssignErmElder rowRecord={rowRecord} handleCancel={handleCancel} />
      </Modal>
    </div>
  );
};

Elders.propTypes = {
  dispatch: PropTypes.func.isRequired,
  getEldersListing: PropTypes.func.isRequired,
  elders: PropTypes.object,
  user: PropTypes.object,
  deleteErm: PropTypes.func,
  isEdit: PropTypes.bool,
  getErmData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  elders: makeSelectElders(),
  user: userInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getEldersListing: page => dispatch(getListing(page)),
    deleteErm: payload => dispatch(deleteErmMapping(payload)),
    getErmData: () => dispatch(ermData()),
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
)(Elders);

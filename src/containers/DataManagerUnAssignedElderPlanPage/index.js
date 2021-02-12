/* eslint-disable no-underscore-dangle */
/**
 *
 * DataManagerUnAssignedElderPlanPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { map, get } from 'lodash';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Card, Form, Input, Select, DatePicker } from 'antd';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import makeSelectDataManagerUnAssignedElderPlanPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import { getRenderingHeader } from '../../common/helpers';
import SideNavigation from '../../components/SideNavigation';
import { elderDetails, planDetails, addElderPlan } from './actions';

export function DataManagerUnAssignedElderPlanPage(props) {
  useInjectReducer({ key: 'dataManagerUnAssignedElderPlanPage', reducer });
  useInjectSaga({ key: 'dataManagerUnAssignedElderPlanPage', saga });

  const [navigationDeployed, setNavigationDeployed] = useState(true);

  const handleNavigationToggle = () => {
    setNavigationDeployed(!navigationDeployed);
  };

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;
    props.getElderDetails(id);
    props.getPlanData();
  }, []);

  function onFinish(value) {
    const {
      match: {
        params: { id },
      },
    } = props;
    const mappedValues = {
      ...value,
      service_initiation_date: moment(
        value.serviceInitiationDate,
      ).toISOString(),
      start_date: moment(value.startDate).toISOString(),
      user_id: id,
    };
    props.assignElderPlan(mappedValues);
  }

  const { dataManagerUnAssignedElderPlanPage } = props;
  const { loading, data: planData } = dataManagerUnAssignedElderPlanPage;

  return (
    <div>
      <Helmet>
        <title>DataManagerUnAssignedElderPlanPage</title>
        <meta
          name="description"
          content="Description of DataManagerUnAssignedElderPlanPage"
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
          <Card title={<FormattedMessage {...messages.header} />} bordered>
            <Form
              layout="horizontal"
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Select a plan"
                name="plan_id"
                rules={[
                  {
                    required: true,
                    message: 'Please input your plan!',
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a plan"
                  loading={loading}
                >
                  {map(planData, itemData => (
                    map(itemData.plan, item => (
                      <Select.Option value={get(item, 'id')}>
                      {get(item, 'name')}
                    </Select.Option>
                    ))))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: 'Please input your startDate!',
                  },
                ]}
              >
                <DatePicker
                  showTime={false}
                  showToday={false}
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="Service Initiation Date"
                name="service_initiation_date"
                rules={[
                  {
                    required: true,
                    message: 'Please input your serviceInitiationDate!',
                  },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="Choose a Currency"
                name="currency"
                rules={[
                  {
                    required: true,
                    message: 'Please input your currency!',
                  },
                ]}
              >
                <Select placeholder="Currency (INR)">
                  <Select.Option key="1" value="INR">
                    INR
                  </Select.Option>
                  <Select.Option key="2" value="USD">
                    USD
                  </Select.Option>
                  <Select.Option key="3" value="GBP">
                    GBP
                  </Select.Option>
                  <Select.Option key="4" value="EUR">
                    EUR
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Amount"
                name="amount"
                rules={[
                  {
                    required: true,
                    message: 'Please input your amount!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Duration"
                name="duration"
                rules={[
                  {
                    required: true,
                    message: 'Please input your duration!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </main>
      </div>
    </div>
  );
}

DataManagerUnAssignedElderPlanPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
  getElderDetails: PropTypes.func,
  getPlanData: PropTypes.func,
  dataManagerUnAssignedElderPlanPage: PropTypes.object,
  assignElderPlan: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  dataManagerUnAssignedElderPlanPage: makeSelectDataManagerUnAssignedElderPlanPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getElderDetails: payload => dispatch(elderDetails(payload)),
    getPlanData: () => dispatch(planDetails()),
    assignElderPlan: payload => dispatch(addElderPlan(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DataManagerUnAssignedElderPlanPage);

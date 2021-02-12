/**
 *
 * AssignErmElder
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Select, Button, Descriptions, Alert } from 'antd';
import { map, get, find, isEmpty } from 'lodash';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAssignErmElder from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import AdminService from '../../service/AdminService';
import { setErm } from './actions';

const adminServiceManager = new AdminService();

const { Option } = Select;

export function AssignErmElder(props) {
  useInjectReducer({ key: 'assignErmElder', reducer });
  useInjectSaga({ key: 'assignErmElder', saga });

  const [ermloading, setERMLoading] = useState(false);
  const [ermList, setErmList] = useState([]);
  const [ermName, setERMName] = useState('');

  useEffect(() => {
    setERMLoading(true);
    adminServiceManager.getAdminsByRole({ role: 'erm' }).then(res => {
      if (res) {
        setErmList(res.data);
        setERMLoading(false);
      }
    });
  }, []);

  function handleChange(value) {
    setERMName(value);
  }

  function handleSelectERM() {
    const payload = {
      user_id: get(props, 'rowRecord.uuid'),
      erm: [ermName],
      doctor: [],
      physio: [],
      dietitian: [],
      community: [],
    };
    props.handleSetErm(payload);
    props.handleCancel();
  }

  function renderERMSuperVisorName() {
    const ermData = find(ermList, { id: ermName });
    if (!isEmpty(ermData) && !isEmpty(ermData.superviser)) {
      return `${ermData.superviser[0].first_name}${'  '} ${
        ermData.superviser[0].last_name
      }`;
    }
    return 'No ERM Assign';
  }

  function handleButtonDisabled() {
    const ermData = find(ermList, { id: ermName });
    if (!isEmpty(ermData) && !isEmpty(ermData.superviser)) {
      return false;
    }
    return true;
  }

  function renderAlertNoERM() {
    if (handleButtonDisabled() && isEmpty(ermName)) {
      return <Alert message="Please select erm" type="warning" showIcon />;
    }
    return false;
  }

  function renderAlertNoSupervisor() {
    if (handleButtonDisabled() && !isEmpty(ermName)) {
      return (
        <Alert
          type="error"
          message="This erm has no supervisor assign, Please assign supervisor first"
          showIcon
        />
      );
    }
    return false;
  }
  return (
    <Descriptions title="Assign ERM to Elder" bordered>
      <Descriptions.Item label="Elder Name" span={4}>
        {get(props, 'rowRecord.first_name')},{' '}
        {get(props, 'rowRecord.last_name')}
      </Descriptions.Item>
      <Descriptions.Item label="Select ERM" span={4}>
        <Select
          style={{ width: 220 }}
          onChange={handleChange}
          loading={ermloading}
          value={ermName}
        >
          {map(ermList, item => (
            <Option value={item.id} key={item.id}>
              {item.full_name}
            </Option>
          ))}
        </Select>
      </Descriptions.Item>
      <Descriptions.Item label="ERM Supervisor" span={4}>
        {renderERMSuperVisorName()}
      </Descriptions.Item>
      <Descriptions.Item span={4}>
        {renderAlertNoERM()}
        {renderAlertNoSupervisor()}
        <Button
          onClick={handleSelectERM}
          disabled={handleButtonDisabled()}
          style={{ marginTop: 10 }}
        >
          Assign ERM
        </Button>
      </Descriptions.Item>
    </Descriptions>
  );
}

AssignErmElder.propTypes = {
  dispatch: PropTypes.func,
  handleSetErm: PropTypes.func,
  handleCancel: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  assignErmElder: makeSelectAssignErmElder(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleSetErm: payload => dispatch(setErm(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AssignErmElder);

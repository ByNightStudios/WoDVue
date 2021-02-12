/**
 *
 * Simulation
 *
 */

import React, { memo } from 'react';
import { Typography, Space, Row, Switch, Button, Form, Skeleton } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import ResponsiveGrid from '../../ResponsiveGrid';

const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};
function Simulation(props) {
  const [form] = Form.useForm();

  const { isNotErmOrErmSupervisor, simulationDetails, currentElderIdentifier, handleUpdateSimulation } = props;

  if (isEmpty(simulationDetails)) {
    return <Skeleton />;
  }

  const {
    is_app_simulated_by_elder,
    is_call_simulated_by_elder,
    is_sensor_simulated_by_elder,
    last_updated_is_app_simulated_by_elder,
    last_updated_is_call_simulated_by_elder,
    last_updated_is_sensor_simulated_by_elder,
  } = simulationDetails;

  const handleOnFinish = (value) => {
    const payload = {
      elder_uuid: currentElderIdentifier,
      ...value,
    }
    handleUpdateSimulation(payload);
  }
  return (
    <Form
      form={form}
      scrollToFirstError
      initialValues={{
        is_app_simulated_by_elder: is_app_simulated_by_elder,
        is_call_simulated_by_elder: is_call_simulated_by_elder,
        is_sensor_simulated_by_elder: is_sensor_simulated_by_elder,
      }}
      onFinish={handleOnFinish}
    >
      <Row gutter={[16, 16]}>
        <ResponsiveGrid
          title="App Simulation to be done by Elder (within 1m)"
          direction="vertical"
        >
          <Form.Item name="is_app_simulated_by_elder" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_app_simulated_by_elder}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_app_simulated_by_elder)
              ? moment(last_updated_is_app_simulated_by_elder).format(
                'DD-MM-YYYY hh:mm:ss A',
              )
              : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title="Call based Simulation to be done by Elder"
          direction="vertical"
        >
          <Form.Item name="is_call_simulated_by_elder" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_call_simulated_by_elder}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_call_simulated_by_elder)
              ? moment(last_updated_is_call_simulated_by_elder).format(
                'DD-MM-YYYY hh:mm:ss A',
              )
              : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title="Sensor Simlulation done (if applicable)"
          direction="vertical"
        >
          <Form.Item name="is_sensor_simulated_by_elder" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_sensor_simulated_by_elder}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_sensor_simulated_by_elder)
              ? moment(last_updated_is_sensor_simulated_by_elder).format(
                'DD-MM-YYYY hh:mm:ss A',
              )
              : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>
      </Row>

      <Form.Item {...tailLayout} className="mb-0 text-right">
        <Space direction="horizontal">
          <Button
            type="primary"
            htmlType="submit"
            disabled={isNotErmOrErmSupervisor}
          >
            Save
          </Button>
          <Button type="default" disabled={isNotErmOrErmSupervisor}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

Simulation.propTypes = {};

export default memo(Simulation);

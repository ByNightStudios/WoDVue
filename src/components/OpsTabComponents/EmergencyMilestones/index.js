/**
 *
 * EmergencyMilestones
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
function EmergencyMilestones(props) {
  const [form] = Form.useForm();

  const { isNotErmOrErmSupervisor, emergencyMileStoneDetails, currentElderIdentifier, handleUpdateEmergencyMileStones } = props;

  if (isEmpty(emergencyMileStoneDetails)) {
    return <Skeleton />;
  }

  const {
    is_address_confirmed,
    is_alternate_number_provide,
    is_ambulance_mappe,
    is_elder_insurance_filled,
    is_emergency_number_on_elder_phone,
    is_fire_station_mappe,
    is_hospital_within_5km_mappe,
    is_house_mapping_don,
    is_live_location_checked,
    is_police_station_mappe,
    is_sensor_at_home,
    last_updated_is_address_confirmed,
    last_updated_is_alternate_number_provided,
    last_updated_is_ambulance_mapped,
    last_updated_is_elder_insurance_filled,
    last_updated_is_emergency_number_on_elder_phone,
    last_updated_is_fire_station_mapped,
    last_updated_is_hospital_within_5km_mapped,
    last_updated_is_house_mapping_done,
    last_updated_is_live_location_checked,
    last_updated_is_police_station_mapped,
    last_updated_is_sensor_at_home,
  } = emergencyMileStoneDetails;

  const handleOnFinish = (value) => {
    const payload = {
      elder_uuid: currentElderIdentifier,
      ...value,
    }
    handleUpdateEmergencyMileStones(payload);
  }
  return (
    <Form
      form={form}
      initialValues={{
        is_emergency_number_on_elder_phone: is_emergency_number_on_elder_phone,
        is_address_confirmed: is_address_confirmed,
        is_live_location_checked: is_live_location_checked,
        is_sensor_at_home: is_sensor_at_home,
        is_house_mapping_don: is_house_mapping_don,
        is_hospital_within_5km_mappe: is_hospital_within_5km_mappe,
        is_ambulance_mappe: is_ambulance_mappe,
        is_police_station_mappe: is_police_station_mappe,
        is_fire_station_mappe: is_fire_station_mappe,
        is_elder_insurance_filled: is_elder_insurance_filled,
        is_alternate_number_provide: is_alternate_number_provide,
      }}
      onFinish={handleOnFinish}
    >
      <Row gutter={[16, 16]}>
        <ResponsiveGrid
          title="Emergency Numbers on Elder Phone"
          direction="vertical"
        >
          <Form.Item name="is_emergency_number_on_elder_phone" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              valueFromProps="checked"
              defaultChecked={is_emergency_number_on_elder_phone}
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_emergency_number_on_elder_phone) ? moment().format('DD-MM-YYYY hh:mm:ss A'): 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Address Confirmation Done" direction="vertical">
          <Form.Item name="is_address_confirmed" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_address_confirmed}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_address_confirmed) ? moment().format('DD-MM-YYYY hh:mm:ss A'): 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Live Location Check Done" direction="vertical">
          <Form.Item name="is_live_location_checked" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_live_location_checked}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_live_location_checked) ? moment().format('DD-MM-YYYY hh:mm:ss A') : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title="Sensors at home (Assure only)"
          direction="vertical"
        >
          <Form.Item name="is_sensor_at_home" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled default={is_sensor_at_home} valueFromProps="checked"/>
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_sensor_at_home) ? moment().format('DD-MM-YYYY hh:mm:ss A') : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="House Mapping Done" direction="vertical">
          <Form.Item name="is_house_mapping_don" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled defaultChecked={is_house_mapping_don} valueFromProps="checked" />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_house_mapping_done) ? moment(last_updated_is_house_mapping_done).format('DD-MM-YYYY hh:mm:ss A'): 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title="Hospital within 5 KM Mapped"
          direction="vertical"
        >
          <Form.Item name="is_hospital_within_5km_mappe" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled defaultChecked={is_hospital_within_5km_mappe} />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_hospital_within_5km_mapped) ? moment(last_updated_is_hospital_within_5km_mapped).format('DD-MM-YYYY hh:mm:ss A'): 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Ambulance in Area Mapped" direction="vertical">
          <Form.Item name="is_ambulance_mappe" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled defaultChecked={is_ambulance_mappe} />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_ambulance_mapped) ? moment(last_updated_is_ambulance_mapped).format('DD-MM-YYYY hh:mm:ss A') : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title="Police Station in Area Mapped"
          direction="vertical"
        >
          <Form.Item name="is_police_station_mappe" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled defaultChecked={is_police_station_mappe} valueFromProps="checked" />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_police_station_mapped) ? moment(last_updated_is_police_station_mapped).format('DD-MM-YYYY hh:mm:ss A') : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title="Fire Station Details Mapped"
          direction="vertical"
        >
          <Form.Item name="is_fire_station_mappe" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled defaultChecked={is_fire_station_mappe} valueFromProps="checked" />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_fire_station_mapped) ? moment(last_updated_is_fire_station_mapped).format('DD-MM-YYYY hh:mm:ss A') : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Elder's Insurance Details" direction="vertical">
          <Form.Item name="is_elder_insurance_filled" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled defaultChecked={is_elder_insurance_filled} valueFromProps="checked" />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_elder_insurance_filled) ? moment(last_updated_is_elder_insurance_filled).format('DD-MM-YYYY hh:mm:ss A') : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title="Alternate Home Number Updated"
          direction="vertical"
        >
          <Form.Item name="is_alternate_number_provide" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled defaultChecked={is_alternate_number_provide} valueFromProps="checked" />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_alternate_number_provided) ? moment().format('DD-MM-YYYY hh:mm:ss A'): 'No Date Found'}
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

EmergencyMilestones.propTypes = {};

export default memo(EmergencyMilestones);

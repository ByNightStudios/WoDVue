/**
 *
 * HealthProfile
 *
 */

import React, { memo } from 'react';
import { Typography, Row, Switch, Form, Skeleton } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import ResponsiveGrid from '../../ResponsiveGrid';
function HealthProfile(props) {
  const [form] = Form.useForm();
  const { healthProfileDetails } = props;
  if (isEmpty(healthProfileDetails)) {
    return <Skeleton />;
  }
  const {
    is_elder_health_profile_filled,
    is_elder_preferred_hospital_filled,
    last_updated_is_elder_health_profile_filled,
    last_updated_is_elder_preferred_hospital_filled,
  } = healthProfileDetails;

  return (
    <Form
      form={form}
      scrollToFirstError
      initialValues={{
        is_elder_health_profile_filled: is_elder_health_profile_filled,
        is_elder_preferred_hospital_filled: is_elder_preferred_hospital_filled,
      }}
    >
      <Row gutter={[16, 16]}>
        <ResponsiveGrid title="Health Profile of Elder" direction="vertical">
          <Form.Item name="is_elder_health_profile_filled" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled
              checked={is_elder_preferred_hospital_filled}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_elder_health_profile_filled)
              ? moment().format('DD-MM-YYYY hh:mm:ss A')
              : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Elder's Preferred Hospital" direction="vertical">
          <Form.Item name="is_elder_preferred_hospital_filled" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled
              checked={is_elder_preferred_hospital_filled}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_elder_preferred_hospital_filled)
              ? moment(last_updated_is_elder_preferred_hospital_filled).format(
                  'DD-MM-YYYY hh:mm:ss A',
                )
              : 'No Date FOund'}
          </Typography.Text>
        </ResponsiveGrid>
      </Row>
    </Form>
  );
}

HealthProfile.propTypes = {};

export default memo(HealthProfile);

/* eslint-disable camelcase */
/**
 *
 * OpsDetails
 *
 */

import React, { memo, useEffect } from 'react';
import {
  Typography,
  Space,
  Switch,
  Select,
  Row,
  Button,
  Form,
  DatePicker,
  Skeleton,
} from 'antd';
import { get, isEmpty } from 'lodash';
import moment from 'moment';

import './styles.scss';
import ResponsiveGrid from '../../ResponsiveGrid';

const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};

const handleFinish = (
  values,
  updateOpsDetailsRequest,
  initialisedPlan,
  handleUpdateOperationTabDetails,
  currentElderIdentifier,
) => {
  const payload = {
    ...values,
    elder_uuid: currentElderIdentifier
  };

  handleUpdateOperationTabDetails(payload);

  values = {
    current_service_status: values.current_service_status,
    service_initiation_date_two: moment(
      values.service_initiation_date_two,
    ).format('YYYY-MM-DD HH:mm:ss'),
  };

  values = {
    current_service_status: values.current_service_status,
    service_initiation_date_two: moment(
      values.service_initiation_date_two,
    ).format('YYYY-MM-DD HH:mm:ss'),
  };

  if (initialisedPlan) {
    updateOpsDetailsRequest(initialisedPlan.uuid, {
      ...values,
    });
  }
};
function OpsDetails(props) {
  const [form] = Form.useForm();

  const {
    isNotErmOrErmSupervisor,
    initialisedPlan,
    loading,
    updateOpsDetailsRequest,
    initialValues,
    handleUpdateOperationTabDetails,
    currentElderIdentifier,
  } = props;

  let service_initiation_date_two = get(
    initialisedPlan,
    'service_initiation_date_two',
    get(initialValues, 'service_initiation_date_two')
  );

  service_initiation_date_two = moment(service_initiation_date_two);

  if (isEmpty(initialValues)) {
    return <Skeleton />;
  }

  const {
    emergency_briefing_to_elder,
    first_service_initial_call,
    is_elder_allocated_to_erm,
    is_welcome_message_send,
    last_updated_emergency_briefing_to_elder,
    last_updated_is_elder_allocated_to_erm,
    last_updated_is_welcome_message_send,
    last_updated_msg_sent_updating_cnfrm_of_induction_to_elder,
    last_updated_msg_sent_updating_cnfrm_of_induction_to_nok,
    last_updated_preferred_time_to_call,
    last_updated_service_initiation_status,
    last_updated_vas_briefing_to_elder,
    last_updated_is_whatsapp_bot_opt_in_status,
    msg_sent_updating_cnfrm_of_induction_to_elder,
    msg_sent_updating_cnfrm_of_induction_to_nok,
    preferred_time_to_call,
    vas_briefing_to_elder,
    is_whatsapp_bot_opt_in_status,
    current_service_status,
  } = initialValues;

  useEffect(() => {
    form.setFieldsValue({
      emergency_briefing_to_elder: emergency_briefing_to_elder,
      first_service_initial_call: first_service_initial_call,
      is_elder_allocated_to_erm: is_elder_allocated_to_erm,
      is_welcome_message_send: is_welcome_message_send,
      is_whatsapp_bot_opt_in_status: is_whatsapp_bot_opt_in_status,
      last_updated_emergency_briefing_to_elder: last_updated_emergency_briefing_to_elder,
      last_updated_is_elder_allocated_to_erm: last_updated_is_elder_allocated_to_erm,
      last_updated_is_welcome_message_send: last_updated_is_welcome_message_send,
      last_updated_msg_sent_updating_cnfrm_of_induction_to_elder: last_updated_msg_sent_updating_cnfrm_of_induction_to_elder,
      last_updated_msg_sent_updating_cnfrm_of_induction_to_nok: last_updated_msg_sent_updating_cnfrm_of_induction_to_nok,
      last_updated_preferred_time_to_call: last_updated_preferred_time_to_call,
      last_updated_service_initiation_status: last_updated_service_initiation_status,
      last_updated_vas_briefing_to_elder: last_updated_vas_briefing_to_elder,
      last_updated_is_whatsapp_bot_opt_in_status: last_updated_is_whatsapp_bot_opt_in_status,
      msg_sent_updating_cnfrm_of_induction_to_elder: msg_sent_updating_cnfrm_of_induction_to_elder,
      msg_sent_updating_cnfrm_of_induction_to_nok: msg_sent_updating_cnfrm_of_induction_to_nok,
      preferred_time_to_call: preferred_time_to_call,
      vas_briefing_to_elder: vas_briefing_to_elder,
      current_service_status: current_service_status,
    });
  }, [initialisedPlan]);

  return (
    <>
      {!loading.isLoading ? (
        <Form
          form={form}
          name="ops_details"
          scrollToFirstError
          className="opsDetailsForm"
          initialValues={{
            emergency_briefing_to_elder: emergency_briefing_to_elder,
            first_service_initial_call: first_service_initial_call,
            is_elder_allocated_to_erm: is_elder_allocated_to_erm,
            is_welcome_message_send: is_welcome_message_send,
            is_whatsapp_bot_opt_in_status: is_whatsapp_bot_opt_in_status,
            last_updated_emergency_briefing_to_elder: last_updated_emergency_briefing_to_elder,
            last_updated_is_elder_allocated_to_erm: last_updated_is_elder_allocated_to_erm,
            last_updated_is_welcome_message_send: last_updated_is_welcome_message_send,
            last_updated_msg_sent_updating_cnfrm_of_induction_to_elder: last_updated_msg_sent_updating_cnfrm_of_induction_to_elder,
            last_updated_msg_sent_updating_cnfrm_of_induction_to_nok: last_updated_msg_sent_updating_cnfrm_of_induction_to_nok,
            last_updated_preferred_time_to_call: last_updated_preferred_time_to_call,
            last_updated_service_initiation_status: last_updated_service_initiation_status,
            last_updated_vas_briefing_to_elder: last_updated_vas_briefing_to_elder,
            msg_sent_updating_cnfrm_of_induction_to_elder: msg_sent_updating_cnfrm_of_induction_to_elder,
            msg_sent_updating_cnfrm_of_induction_to_nok: msg_sent_updating_cnfrm_of_induction_to_nok,
            preferred_time_to_call: preferred_time_to_call,
            vas_briefing_to_elder: vas_briefing_to_elder,
            current_service_status: current_service_status,
            service_initiation_date_two: service_initiation_date_two,
          }}
          onFinish={values =>
            handleFinish(
              values,
              updateOpsDetailsRequest,
              initialisedPlan,
              handleUpdateOperationTabDetails,
              currentElderIdentifier,
            )
          }
        >
          <Row gutter={[16, 16]}>
            <ResponsiveGrid
              title="Welcome Message to Elder"
              direction="vertical"
            >
              <Form.Item
                label={null}
                name="is_welcome_message_send"
                className="mb-0"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled
                  defaultChecked={is_welcome_message_send}
                  name="is_welcome_message_send"
                  valuePropName="checked"
                />
              </Form.Item>
              <Typography.Text type="secondary">
                {!isEmpty(last_updated_is_welcome_message_send)
                  ? moment(last_updated_is_welcome_message_send).format(
                    'DD-MM-YYYY hh:mm:ss A',
                  )
                  : 'No Date Found'}
              </Typography.Text>
            </ResponsiveGrid>

            <ResponsiveGrid title="Initiation Status" direction="vertical">
              <Form.Item
                label={null}
                className="mb-0"
                name="current_service_status"
                rules={[
                  {
                    required: true,
                    message: 'This field is required!',
                  },
                ]}
              >
                <Select
                  disabled={isNotErmOrErmSupervisor}
                  defaultValue={current_service_status}
                >
                  <Option value="">Select One</Option>
                  <Option value="initiated">Initiated</Option>
                  <Option value="not_initiated">Not Initiated</Option>
                  <Option value="not_contactable">Not Contactable</Option>
                  <Option value="on_hold">On Hold</Option>
                  <Option value="no_service">Does not want Service</Option>
                </Select>
              </Form.Item>
              <Typography.Text type="secondary">
                {!isEmpty(last_updated_service_initiation_status)
                  ? moment(last_updated_service_initiation_status).format(
                    'DD-MM-YYYY hh:mm:ss A',
                  )
                  : 'No Date Found'}
              </Typography.Text>
            </ResponsiveGrid>

            <ResponsiveGrid
              title="Service Initiation Call"
              direction="vertical"
            >
              <Form.Item
                shouldUpdate
                label={null}
                className="mb-0"
                name="service_initiation_date_two"
                rules={[
                  {
                    required: true,
                    message: 'This field is required!',
                  },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  disabled={isNotErmOrErmSupervisor}
                />
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid title="Elder Allocated to ERM" direction="vertical">
              <Form.Item
                label={null}
                name="is_elder_allocated_to_erm"
                className="mb-0"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled
                  valuePropName="checked"
                  defaultChecked={is_elder_allocated_to_erm}
                />
              </Form.Item>
              <Typography.Text type="secondary">
                {!isEmpty(last_updated_is_elder_allocated_to_erm)
                  ? moment(last_updated_is_elder_allocated_to_erm).format(
                    'DD-MM-YYYY hh:mm:ss A',
                  )
                  : 'No Date Found'}
              </Typography.Text>
            </ResponsiveGrid>

            <ResponsiveGrid
              title="Whatsapp BOT Opt In Status"
              direction="vertical"
            >
              <Form.Item
                label={null}
                name="is_whatsapp_bot_opt_in_status"
                className="mb-0"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled
                  defaultChecked={is_whatsapp_bot_opt_in_status}
                  valuePropName="checked"
                />
              </Form.Item>
              <Typography.Text type="secondary">
                {!isEmpty(last_updated_is_whatsapp_bot_opt_in_status)
                  ? moment(last_updated_is_whatsapp_bot_opt_in_status).format(
                    'DD-MM-YYYY hh:mm:ss A',
                  )
                  : 'No Date Found'}
              </Typography.Text>
            </ResponsiveGrid>

            <ResponsiveGrid title="Preferred Time of Call" direction="vertical">
              <Form.Item
                label={null}
                name="preferred_time_to_call"
                className="mb-0"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled
                  defaultChecked={preferred_time_to_call}
                />
              </Form.Item>
              <Typography.Text type="secondary">
                {!isEmpty(last_updated_preferred_time_to_call)
                  ? moment(last_updated_preferred_time_to_call).format(
                    'DD-MM-YYYY hh:mm:ss A',
                  )
                  : 'No Date Found'}
              </Typography.Text>
            </ResponsiveGrid>

            <ResponsiveGrid title="VAS Briefing to Elder" direction="vertical">
              <Form.Item
                label={null}
                className="mb-0"
                name="vas_briefing_to_elder"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled={isNotErmOrErmSupervisor}
                  valueFromProps="checked"
                  defaultChecked={vas_briefing_to_elder}
                />
              </Form.Item>
              <Typography.Text type="secondary">
                {!isEmpty(last_updated_vas_briefing_to_elder)
                  ? moment(last_updated_vas_briefing_to_elder).format(
                    'DD-MM-YYYY hh:mm:ss A',
                  )
                  : 'No Date Found'}
              </Typography.Text>
            </ResponsiveGrid>

            <ResponsiveGrid
              title="Emergency Briefing to Elder"
              direction="vertical"
            >
              <Form.Item
                label={null}
                className="mb-0"
                name="emergency_briefing_to_elder"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled={isNotErmOrErmSupervisor}
                  valuePropName="checked"
                  defaultChecked={emergency_briefing_to_elder}
                />
              </Form.Item>
              <Typography.Text type="secondary">
                {!isEmpty(last_updated_emergency_briefing_to_elder)
                  ? moment(last_updated_emergency_briefing_to_elder).format(
                    'DD-MM-YYYY hh:mm:ss A',
                  )
                  : 'No Date Found'}
              </Typography.Text>
            </ResponsiveGrid>

            <ResponsiveGrid
              title="Msg sent updating confirmation of Induction to NOK"
              direction="vertical"
            >
              <Form.Item
                label={null}
                className="mb-0"
                name="msg_sent_updating_cnfrm_of_induction_to_nok"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled={isNotErmOrErmSupervisor}
                  valuePropName="checked"
                  defaultChecked={msg_sent_updating_cnfrm_of_induction_to_nok}
                />
              </Form.Item>
              <Typography.Text type="secondary">
                {!isEmpty(
                  last_updated_msg_sent_updating_cnfrm_of_induction_to_nok,
                )
                  ? moment(
                    last_updated_msg_sent_updating_cnfrm_of_induction_to_nok,
                  ).format('DD-MM-YYYY hh:mm:ss A')
                  : 'No Date Found'}
              </Typography.Text>
            </ResponsiveGrid>

            <ResponsiveGrid
              title="Msg sent updating confirmation of Induction to Elder"
              direction="vertical"
            >
              <Form.Item
                label={null}
                className="mb-0"
                name="msg_sent_updating_cnfrm_of_induction_to_elder"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled={isNotErmOrErmSupervisor}
                  valuePropName="checked"
                  defaultChecked={msg_sent_updating_cnfrm_of_induction_to_elder}
                />
              </Form.Item>
              <Typography.Text type="secondary">
                {!isEmpty(
                  last_updated_msg_sent_updating_cnfrm_of_induction_to_elder,
                )
                  ? moment(
                    last_updated_msg_sent_updating_cnfrm_of_induction_to_elder,
                  ).format('DD-MM-YYYY hh:mm:ss A')
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
                loading={loading.isUpdating}
              >
                Save
              </Button>
              <Button
                type="default"
                disabled={isNotErmOrErmSupervisor}
                onClick={() => form.resetFields()}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
          <Skeleton active />
        )}
    </>
  );
}

OpsDetails.propTypes = {
  ...OpsDetails,
};

export default memo(OpsDetails);

/**
 *
 * TermsConditions
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
function TermsConditions(props) {
  const [form] = Form.useForm();
  console.log(props);
  const { isNotErmOrErmSupervisor, tcDetails, handleUpdateTcCollapseDetails } = props;

  if (isEmpty(tcDetails)) {
    return <Skeleton />;
  }

  const {
    last_updated_send_tc_link,
    last_updated_tc_link_accepted,
    last_updated_tc_updated_to_document,
    send_tc_link,
    tc_link_accepted,
    tc_updated_to_document,
  } = tcDetails;

  const handleOnFinish = (values) => {
    const payload = {
      elder_uuid: props.currentElderIdentifier,
      ...values,
    };
    props.handleUpdateTcCollapseDetails(payload);
  }

  return (
    <Form
      form={form}
      name="terms_conditions"
      scrollToFirstError
      initialValues={{
        send_tc_link: send_tc_link,
        tc_link_accepted: tc_link_accepted,
        tc_updated_to_document: tc_updated_to_document,
      }}
      onFinish={handleOnFinish}
    >
      <Row gutter={[16, 16]}>
        <ResponsiveGrid title="Send T&C Link" direction="vertical">
          <Form.Item label={null} name="send_tc_link" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={send_tc_link}
              valuePropName="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_send_tc_link)
              ? moment(last_updated_send_tc_link).format(
                  'DD-MM-YYYY hh:mm:ss A',
                )
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="T&C Link Accepted" direction="vertical">
          <Form.Item name="tc_link_accepted" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              defaultChecked={tc_link_accepted}
              disabled={isNotErmOrErmSupervisor}
              valuePropName="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_tc_link_accepted)
              ? moment().format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title="T&C Updated to Documents Folder"
          direction="vertical"
        >
          <Form.Item name="tc_updated_to_document" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              valuePropName="checked"
              defaultChecked={tc_updated_to_document}
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_tc_updated_to_document)
              ? moment(last_updated_tc_updated_to_document).format(
                  'DD-MM-YYYY hh:mm:ss A',
                )
              : 'No data found'}
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

TermsConditions.propTypes = {};

export default memo(TermsConditions);

/**
 *
 * NokOutReach
 *
 */

import React, { memo } from 'react';
import { Typography, Space, Row, Switch, Button, Form, Skeleton } from "antd";
import { isEmpty } from 'lodash';
import moment from 'moment';
import ResponsiveGrid from '../../ResponsiveGrid';

const tailLayout = {
  wrapperCol: {
    span: 24
  },
};
function NokOutReach(props) {
  const [form] = Form.useForm();

  const {
    isNotErmOrErmSupervisor,
    currentElderIdentifier,
    handleUpdateNokCollapseDetails,
    nokOutReactDetails
  } = props;

  if (isEmpty(nokOutReactDetails)) {
    return <Skeleton />
  }

  const {
    is_nok_app_configured,
    is_nok_app_downloaded,
    is_nok_briefed,
    last_updated_is_nok_app_configured,
    last_updated_is_nok_app_downloaded,
    last_updated_is_nok_briefed,
  } = nokOutReactDetails;

  const handleOnFinish = (value) => {
    const payload = {
      elder_uuid: currentElderIdentifier,
      ...value,
    };
    handleUpdateNokCollapseDetails(payload);
  }
  return (
    <Form
      form={form}
      name='nok_outreach_form'
      scrollToFirstError
      initialValues={{
        is_nok_app_configured: is_nok_app_configured,
        is_nok_app_downloaded: is_nok_app_downloaded,
        is_nok_briefed: is_nok_briefed,
      }}
      onFinish={handleOnFinish}
    >
      <Row gutter={[16, 16]}>
        <ResponsiveGrid
          title='NOK Briefing Done'
          direction='vertical'
        >
          <Form.Item
            name='is_nok_briefed'
            className='mb-0'
          >
            <Switch
              checkedChildren='Yes'
              unCheckedChildren='No'
              disabled
              defaultChecked={is_nok_briefed}
              valueFromProp="checked"
            />
          </Form.Item>
          <Typography.Text type='secondary'>
            {!isEmpty(last_updated_is_nok_briefed) ? moment(last_updated_is_nok_briefed).format('DD-MM-YYYY hh:mm:ss A') : 'No Data Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title='NOK App Download Done'
          direction='vertical'
        >
          <Form.Item
            name='is_nok_app_downloaded'
            className='mb-0'
          >
            <Switch
              checkedChildren='Yes'
              unCheckedChildren='No'
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_nok_app_downloaded}
            />
          </Form.Item>
          <Typography.Text type='secondary'>
            {!isEmpty(last_updated_is_nok_app_downloaded) ? moment(last_updated_is_nok_app_downloaded).format('DD-MM-YYYY hh:mm:ss A') : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title='NOK App System Confirmed'
          direction='vertical'
        >
          <Form.Item
            name='is_nok_app_configured'
            className='mb-0'
          >
            <Switch
              checkedChildren='Yes'
              unCheckedChildren='No'
              disabled
              defaultChecked={is_nok_app_configured}
              valueFromProp="checked"
            />
          </Form.Item>
          <Typography.Text type='secondary'>
            {!isEmpty(last_updated_is_nok_app_configured) ? moment(last_updated_is_nok_app_configured).format('DD-MM-YYYY hh:mm:ss A') : 'No Data Found'}
          </Typography.Text>
        </ResponsiveGrid>
      </Row>

      <Form.Item {...tailLayout} className='mb-0 text-right'>
        <Space direction='horizontal'>
          <Button type="primary" htmlType='submit' disabled={isNotErmOrErmSupervisor}>Save</Button>
          <Button type="default" disabled={isNotErmOrErmSupervisor}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

NokOutReach.propTypes = {};

export default memo(NokOutReach);

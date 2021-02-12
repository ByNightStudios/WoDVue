/**
 *
 * SocialAspects
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
function SocialAspects(props) {
  const [form] = Form.useForm();

  const { isNotErmOrErmSupervisor, socialAspectsDetails, handleUpdateSocialAspectsDetails, currentElderIdentifier } = props;

  if (isEmpty(socialAspectsDetails)) {
    return <Skeleton />;
  }

  const {
    has_elder_installed_app,
    is_birthday_updated,
    is_elder_persona_update,
    is_family_tree_updated,
    is_marriage_anniversary_update,
    is_mohtv_installed,
    last_updated_has_elder_installed_app,
    last_updated_is_birthday_updated,
    last_updated_is_mohtv_installed,
  } = socialAspectsDetails;

  const handleOnFinish = (values) => {
    const payload = {
      elder_uuid: currentElderIdentifier,
      ...values,
    };
    handleUpdateSocialAspectsDetails(payload);
  }
  return (
    <Form
      form={form}
      scrollToFirstError
      initialValues={{
        is_elder_persona_update: is_elder_persona_update,
        is_family_tree_updated: is_family_tree_updated,
        is_birthday_updated: is_birthday_updated,
        is_marriage_anniversary_update: is_marriage_anniversary_update,
        is_mohtv_installed: is_mohtv_installed,
        has_elder_installed_app: has_elder_installed_app,
      }}
      onFinish={handleOnFinish}
    >
      <Row gutter={[16, 16]}>
        <ResponsiveGrid title="Elder Persona Updated" direction="vertical">
          <Form.Item name="is_elder_persona_update" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled checked={is_elder_persona_update} />
          </Form.Item>
        </ResponsiveGrid>

        <ResponsiveGrid title="Family Tree Updated" direction="vertical">
          <Form.Item name="is_family_tree_updated" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled checked={is_family_tree_updated} />
          </Form.Item>
        </ResponsiveGrid>

        <ResponsiveGrid title="Birthdays Updated" direction="vertical">
          <Form.Item name="is_birthday_updated" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled defaultChecked={is_birthday_updated} />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_birthday_updated) ? moment().format('DD-MM-YYYY hh:mm:ss A') : 'No Data Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid
          title="Marriage Anniversary Updated"
          direction="vertical"
        >
          <Form.Item name="is_marriage_anniversary_update" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled defaultChecked={is_marriage_anniversary_update} />
          </Form.Item>
        </ResponsiveGrid>

        <ResponsiveGrid title="Moh TV Installed" direction="vertical">
          <Form.Item name="is_mohtv_installed" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_mohtv_installed}
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_mohtv_installed) ? moment().format('DD-MM-YYYY hh:mm:ss A') : 'No Data Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="App Installed" direction="vertical">
          <Form.Item name="has_elder_installed_app" className="mb-0">
            <Switch checkedChildren="Yes" unCheckedChildren="No" disabled checked={has_elder_installed_app} />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_has_elder_installed_app) ? moment(last_updated_has_elder_installed_app).format('DD-MM-YYYY hh:mm:ss A') : 'No Data Found'}
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

SocialAspects.propTypes = {};

export default memo(SocialAspects);

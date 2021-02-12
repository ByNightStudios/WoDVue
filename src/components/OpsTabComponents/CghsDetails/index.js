/**
 *
 * CghsDetails
 *
 */

import React, { memo } from 'react';
import {
  Typography,
  Select,
  Row,
  Switch,
  Button,
  Divider,
  Space,
  Form,
  Skeleton
} from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';

import './styles.scss';
import ResponsiveGrid from '../../ResponsiveGrid';

const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};
function CghsDetails(props) {
  const [form] = Form.useForm();

  const {
    isNotErmOrErmSupervisor,
    cghsDetails,
    handleUpdateCGHS,
    currentElderIdentifier,
    elderRelationShipDetails,
  } = props;

  if (isEmpty(cghsDetails)) {
    return <Skeleton />;
  }
  const {
    is_cghs_elder,
    last_updated_is_cghs_elder,
    is_cghs_card_details_uploaded,
    last_updated_is_cghs_card_details_uploaded,
  } = cghsDetails;

  const  {
    testimonent_status,
    special_gift_identification_status,
    gift_delivery_status,
    is_regular_mohtv_attendee,
    relation_depth,
    is_a1_listener,
    is_a2_listener,
    is_elder_emoha_eagle
  } = elderRelationShipDetails;

  const handleOnFinish = value => {
    const payload = {
      elder_uuid: currentElderIdentifier,
      ...value,
    };
    handleUpdateCGHS(payload);
  };
  return (
    <Form
      form={form}
      className="cghsForm"
      scrollToFirstError
      initialValues={{
        is_cghs_elder: is_cghs_elder,
        is_cghs_card_details_uploaded: is_cghs_card_details_uploaded,
        testimonent_status: testimonent_status,
        special_gift_identification_status: special_gift_identification_status,
        gift_delivery_status: gift_delivery_status,
        is_regular_mohtv_attendee: is_regular_mohtv_attendee,
        relation_depth: relation_depth,
        is_a1_listener: is_a1_listener,
        is_a2_listener: is_a2_listener,
        is_elder_emoha_eagle: is_elder_emoha_eagle,
      }}
      onFinish={handleOnFinish}
    >
      <Row gutter={[16, 16]}>
        <ResponsiveGrid title="CGHS Elder (Y/N)" direction="vertical">
          <Form.Item name="is_cghs_elder" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled
              defaultChecked={is_cghs_elder}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_cghs_elder)
              ? moment(last_updated_is_cghs_elder).format(
                  'DD-MM-YYYY hh:mm:ss A',
                )
              : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="CGHS Card Detials Uploaded" direction="vertical">
          <Form.Item name="is_cghs_card_details_uploaded" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled
              defaultChecked={is_cghs_card_details_uploaded}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {!isEmpty(last_updated_is_cghs_card_details_uploaded)
              ? moment(last_updated_is_cghs_card_details_uploaded).format(
                  'DD-MM-YYYY hh:mm:ss A',
                )
              : 'No Date Found'}
          </Typography.Text>
        </ResponsiveGrid>
      </Row>

      <Divider orientation="center">
        <Typography.Text strong>Elder Relationship</Typography.Text>
      </Divider>

      <Row gutter={[16, 16]}>
        <ResponsiveGrid title="Testimonial Given" direction="vertical">
          <Form.Item
            name="testimonent_status"
            rules={[
              {
                required: true,
                message: 'This field is required!',
              },
            ]}
            className="mb-0"
          >
            <Select
              disabled={isNotErmOrErmSupervisor}
              onChange={null}
              style={{ width: '100%' }}
              defaultValue={testimonent_status}
            >
              <Option value="">Select One</Option>
              <Option value="received">Received</Option>
              <Option value="not_received">Not Received</Option>
              <Option value="in_progress">In Progress</Option>
            </Select>
          </Form.Item>
          <Typography.Text type="secondary">
            {moment().format('DD-MM-YYYY hh:mm:ss A')}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Special Gift Identified" direction="vertical">
          <Form.Item
            name="special_gift_identification_status"
            rules={[
              {
                required: true,
                message: 'This field is required!',
              },
            ]}
            className="mb-0"
          >
            <Select
              disabled={isNotErmOrErmSupervisor}
              onChange={null}
              style={{ width: '100%' }}
              defaultValue={special_gift_identification_status}
            >
              <Option value="">Select One</Option>
              <Option value="identified">Identified</Option>
              <Option value="not_identified">Not Identified</Option>
            </Select>
          </Form.Item>
          <Typography.Text type="secondary">
            {moment().format('DD-MM-YYYY hh:mm:ss A')}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Gift Delivery Status" direction="vertical">
          <Form.Item
            name="gift_delivery_status"
            rules={[
              {
                required: true,
                message: 'This field is required!',
              },
            ]}
            className="mb-0"
          >
            <Select
              disabled={isNotErmOrErmSupervisor}
              onChange={null}
              style={{ width: '100%' }}
              defaultValue={gift_delivery_status}
            >
              <Option value="">Select One</Option>
              <Option value="ordered">Ordered</Option>
              <Option value="not_ordered">Not Ordered</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="delivery_pending">Delivery Pending</Option>
            </Select>
          </Form.Item>
          <Typography.Text type="secondary">
            {moment().format('DD-MM-YYYY hh:mm:ss A')}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Regular MohTV Attendee" direction="vertical">
          <Form.Item name="is_regular_mohtv_attendee" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_regular_mohtv_attendee}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {moment().format('DD-MM-YYYY hh:mm:ss A')}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Relationship Depth" direction="vertical">
          <Form.Item
            name="relation_depth"
            rules={[
              {
                required: true,
                message: 'This field is required!',
              },
            ]}
            className="mb-0"
          >
            <Select
              disabled={isNotErmOrErmSupervisor}
              onChange={null}
              style={{ width: '100%' }}
            >
              <Option value="">Select One</Option>
              <Option value="1x">1x</Option>
              <Option value="2x">2x</Option>
              <Option value="3x">3x</Option>
              <Option value="4x">4x</Option>
              <Option value="5x">5x</Option>
            </Select>
          </Form.Item>
          <Typography.Text type="secondary">
            {moment().format('DD-MM-YYYY hh:mm:ss A')}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="A1 Lister (High Achiever)" direction="vertical">
          <Form.Item name="is_a1_listener" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_a1_listener}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {moment().format('DD-MM-YYYY hh:mm:ss A')}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="A2 Lister (Reinventor)" direction="vertical">
          <Form.Item name="is_a2_listener" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              defaultChecked={is_a2_listener}
              valueFromProps="checked"
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {moment().format('DD-MM-YYYY hh:mm:ss A')}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Is Elder Emoha Eagle?" direction="vertical">
          <Form.Item name="is_elder_emoha_eagle" className="mb-0">
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled={isNotErmOrErmSupervisor}
              valueFromProps="checked"
              defaultChecked={is_elder_emoha_eagle}
            />
          </Form.Item>
          <Typography.Text type="secondary">
            {moment().format('DD-MM-YYYY hh:mm:ss A')}
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

CghsDetails.propTypes = {};

export default memo(CghsDetails);

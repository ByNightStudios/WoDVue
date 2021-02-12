import React, { useState } from 'react';
import {
  message,
  Form,
  Input,
  Tooltip,
  Button,
  Popconfirm,
  Switch,
  Typography,
  Select,
} from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';

// import PhoneInput from 'react-phone-input-2';
import FriendManageAddress from '../FriendManageAddresses';
import EldersFriendsManager from './dataManager';

// import 'react-phone-input-2/lib/style.css';

message.config({
  top: 80,
  maxCount: 1,
});

const EldersFriendsManagerInstance = new EldersFriendsManager();
const { Text } = Typography;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const RegistrationForm = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  const onConfirm = () => {
    setChecked(true);
    setVisible(false);
  };

  const onCancel = () => {
    setChecked(false);
    setVisible(false);
  };

  const onFinish = values => {
    const payload = {
      user_id: props.currentElderIdentifier,
      rsvp: 1,
      ...values,
      empowerComplimentaryOffered: checked ? '1' : '0',
    };

    EldersFriendsManagerInstance.addElderFriendData(payload)
      .then(res => {
        if (res && res.data) {
          const myFriendPayload = {
            friend_id: res.data.uuid,
            call_status: values.call_status,
            note: values.note,
          };
          EldersFriendsManagerInstance.addElderFriendNotes(myFriendPayload);
          message.success('New Friend added successfully');
          props.updateState(res.data);
          form.resetFields();
          props.handleCancel();
        }
      })
      .catch(error => {
        const errorData = JSON.parse(JSON.stringify(error));
        if (errorData) {
          props.handleCancel();
          message.error('This user already assigned');
        }
      });
  };

  const handleUpdateDataInsideForm = data => {
    form.setFieldsValue({
      street_address: data.addLocationInput,
      city: data.city,
      country: data.country,
      state: data.state,
      lat: data.geoLatitude,
      lng: data.geoLongitude,
    });
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
      initialValues={{ empowerComplimentaryOffered: checked }}
    >
      <Text strong> Basic Information</Text>
      <Form.Item
        label="Full Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input elders fullName!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mobile Number"
        rules={[
          {
            required: true,
            message: 'Please input a valid phone number!',
            pattern: /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
            whitespace: true,
          },
        ]}
        name="mobile_number"
      >
        <Input prefix="+91" />
      </Form.Item>
      <Form.Item
        label={
          <span>
            Complimentary Registered&nbsp;
            <Tooltip title="Empower Complimentary Registered (yes/no)">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        name="empowerComplimentaryOffered"
        rules={[
          {
            required: true,
            message: 'Please input elders Empower Complimentary Registered !',
          },
        ]}
      >
        <Popconfirm
          title="This action can not be undone. Are you sure you want to do it?"
          visible={visible}
          onConfirm={onConfirm}
          onCancel={onCancel}
          okText="Yes"
          cancelText="No"
        >
          <Switch
            onClick={() => setVisible(true)}
            checked={checked}
            disabled={checked}
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        </Popconfirm>
      </Form.Item>

      <Form.Item
        label="Call Status"
        rules={[
          {
            required: true,
            message: 'Please input a valid call status!',
            whitespace: true,
          },
        ]}
        name="call_status"
      >
        <Select style={{ minWidth: 300 }}>
          <Option value="1">Interested</Option>
          <Option value="2">Not contactable</Option>
          <Option value="3">Not Interested</Option>
          <Option value="4">Not Qualified</Option>
          <Option value="5">Requested Call Back</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Notes"
        rules={[
          {
            required: true,
            message: 'Please input notes',
            whitespace: true,
          },
        ]}
        name="note"
      >
        <Input.TextArea rows={2} />
      </Form.Item>

      <Text strong> Location Information : </Text>

      <Form.Item label="Google Location Search">
        <FriendManageAddress
          startLoader={() => {}}
          stopLoader={() => {}}
          openNotification={() => {}}
          handleUpdateDataInsideForm={data => handleUpdateDataInsideForm(data)}
        />
      </Form.Item>

      <Form.Item label="Street Address" name="street_address">
        <Input />
      </Form.Item>
      <Form.Item label="City" name="city">
        <Input />
      </Form.Item>
      <Form.Item label="State" name="state">
        <Input />
      </Form.Item>

      <Form.Item label="Country" name="country">
        <Input />
      </Form.Item>

      <Form.Item label="Latitude" name="lat">
        <Input />
      </Form.Item>

      <Form.Item label="Longitude" name="lng">
        <Input />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

RegistrationForm.prototype = {
  ...RegistrationForm,
};

export default RegistrationForm;

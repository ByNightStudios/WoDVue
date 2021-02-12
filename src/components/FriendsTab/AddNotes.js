import React from 'react';
import { message, Form, Input, Button, Select } from 'antd';

import EldersFriendsManager from './dataManager';

import 'react-phone-input-2/lib/style.css';

message.config({
  top: 80,
  maxCount: 1,
});

const EldersFriendsManagerInstance = new EldersFriendsManager();

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

const AddNotes = props => {
  const [form] = Form.useForm();
  const onFinish = values => {
    const myFriendPayload = {
      friend_id: props.friendRecord.uuid,
      ...values,
    };
    EldersFriendsManagerInstance.addElderFriendNotes(myFriendPayload)
      .then(res => {
        if (res) {
          message.success('notes has been added');
        }
      })
      .catch(err => {
        if (err) {
          message.error('something went wrong');
        }
      });
    props.handleCancel();
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="notes"
      onFinish={onFinish}
      scrollToFirstError
    >
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
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Add Notes
        </Button>
      </Form.Item>
    </Form>
  );
};

AddNotes.prototype = {
  ...AddNotes,
};

export default AddNotes;

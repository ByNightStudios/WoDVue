import React from "react";
import { Form, Input, Button, DatePicker } from "antd";
import moment from 'moment';

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};

const EmploymentOrgForm = props => {
  const {
    employmentFormSubmit,
    isEmploymentUpdating
  } = props;

  const handleFormValues = (values) => {
    const payload = {
      ...values,
      year: moment(values.year).format('YYYY'),
    }
    employmentFormSubmit(payload);
  }
  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={handleFormValues}
      onFinishFailed={null}
    >
      <Form.Item
        label="Organization"
        name="organization"
        rules={[{
          required: true,
          message: "Please input Organization Name!",
          whitespace: true,
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Designation"
        name="designation"
        rules={[{
          required: true,
          message: "Please input Designation!",
          whitespace: true,
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Year"
        name="year"
        rules={[{
          required: true,
          message: "Please input Year!",
        }]}
      >
        <DatePicker onChange={null} picker="year" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item {...tailLayout} className='text-right mb-0'>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isEmploymentUpdating}
          loading={isEmploymentUpdating}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmploymentOrgForm;

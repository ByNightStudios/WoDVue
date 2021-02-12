import React from "react";
import { Form, Input, Button, DatePicker, message } from "antd";
import moment from "moment";
import ElderDetailsDataManager from "../../ElderDetails/dataManager";
const elderManager = new ElderDetailsDataManager();

const layout = {
  labelCol: {
    span: 16,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 16,
    span: 16,
  },
};

const InsuranceForm = (props) => {
  const onFinish = (values) => {
    const payload = {
      user_id: props.currentElderIdentifier,
      insurance_data: [
        {
          insurance_company_name: values.insurance_company_name,
          insurance_number: values.insurance_number,
          from_date: moment(values.from_date).format("YYYY-MM-DD"),
          expiry_date: moment(values.expiry_date).format("YYYY-MM-DD"),
          insurance_agent: values.insurance_agent,
        },
      ],
    };

    elderManager.elderService
      .addInsuranceDetails(payload)
      .then((response) => {
        if (response) {
          message.success(`details has been added`);
          props.handleCancel();
        }
      })
      .catch((err) => {
        if (err) {
            console.log(err);
          message.error(`Something went wrong`);
        }
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Health Insurance Company Name"
        name="insurance_company_name"
        rules={[
          {
            required: true,
            message: "Please input your insurance_company_name!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Health Insurance Number"
        name="insurance_number"
        rules={[
          {
            required: true,
            message: "Please input your insurance_number!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Validity from date"
        name="from_date"
        rules={[
          {
            required: true,
            message: "Please input your from_date!",
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        label="Expiry On date"
        name="expiry_date"
        rules={[
          {
            required: true,
            message: "Please input your expiry_date!",
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        label="Contact Details Of Insurance Agent"
        name="insurance_agent"
        rules={[
          {
            required: true,
            message: "Please input your insurance_agent!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InsuranceForm;

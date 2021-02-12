import React from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";
import moment from 'moment';
import { educationLevels } from '../../../utils/staticDropDowns';

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

const EducationalQualForm = props => {
  const {
    educationFormSubmit,
    isEduQualUpdating
  } = props;

  const onFinish = (values) => {
    const payload = {
      ...values,
      year: moment(values.year).format('YYYY'),
    }
    educationFormSubmit(payload);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        name: '',
        level: '',
        year: ''
      }}
      onFinish={onFinish}
      onFinishFailed={null}
    >
      <Form.Item
        label="Institute Name"
        name="institute"
        rules={[{
          required: true,
          message: "Please input Institute Name!",
          whitespace: true,
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Level"
        name="level"
        rules={[{
          required: true,
          message: "Please input Level!",
          whitespace: true,
        }]}
      >
        <Select>
          <Select.Option value=''>Select One</Select.Option>
          {educationLevels.map(eduLevel => <Select.Option
            key={eduLevel.key}
            value={eduLevel.name}
          >
            {eduLevel.name}
          </Select.Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item
        label="Year"
        name="year"
        rules={[{
          required: true,
          message: "Please input Year!"
        }]}
      >
        <DatePicker onChange={null} picker="year" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item {...tailLayout} className='text-right mb-0'>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isEduQualUpdating}
          loading={isEduQualUpdating}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EducationalQualForm;

/**
 *
 * AntFromLoginPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { message } from 'antd'
import styles from './login-page.scss';
import loggedIn from '../../hoc/loggedIn';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAntFromLoginPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { FormValueSubmit } from './actions';
import 'antd/dist/antd.css';
import { Form, Input, Button } from 'antd';
import Header from '../../components/Header';


export function AntFromLoginPage({ antFromLoginPage, handleSubmit }) {

  useInjectReducer({ key: 'antFromLoginPage', reducer });
  useInjectSaga({ key: 'antFromLoginPage', saga });


  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };


  useEffect(() => {
    if (antFromLoginPage.error) {
      message.error(antFromLoginPage.error)
    }
  }, [antFromLoginPage.error])

  const onFinish = (values) => {
    handleSubmit(values);
  };



  const validateMessages = {
    required: '${label} is Required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  return (
    <div>
      <Helmet>
        <title>Emoha WMS</title>
        <meta name="description" content="Description of AntFromLoginPage" />
      </Helmet>
      {/* <FormattedMessage {...messages.header} /> */}
      <Header />

      <div className='login-page centered-screen' style={styles}>
        <div className='login-container'>
          <div className='login-container-header'>
            <h3>Administrator log in</h3>
          </div>
          <div className='login-container-content'>
            <Form
              validateMessages={validateMessages}
              className='login-container-form'
              layout="vertical"
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
              label="Email"
              name={['user', 'Email']}
              label="Email"
              rules={[{ required: true,whitespace:true ,type: 'email' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true,whitespace:true, message: 'Password is Required!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={antFromLoginPage.loading}
                >
                  Log in
                </Button>
              </Form.Item>

            </Form>

          </div>
        </div>
      </div>

    </div>
  );
}

AntFromLoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
AntFromLoginPage.propTypes = {
  handleSubmit: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  antFromLoginPage: makeSelectAntFromLoginPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: evt => {
      dispatch(FormValueSubmit(evt))
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default loggedIn(compose(
  withConnect,
  memo,
)(AntFromLoginPage));

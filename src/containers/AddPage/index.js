import React from 'react';
import { connect } from 'react-redux';

import { Form, Button } from 'react-bootstrap';
import { notification } from 'antd';
import Header from '../../components/Header';

import styles from './login-page.scss';
import { adminLogin } from '../../actions/AuthActions';
import loggedIn from '../../hoc/loggedIn';
import PageLoader from '../../components/PageLoader';
import Recaptcha from 'react-google-invisible-recaptcha';
import { parse } from 'query-string';

class AddPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      loader: false,
    };

    this.loginHandler();
  }

  loginHandler = () => {

    //console.log("this.props == ",this.props);
    const { location: { search } }= this.props;

    //const { utm_source } = search;

    const { utm_keyword } = parse(search);
   
    if(utm_keyword){
      fetch(`https://api.emoha.com/add-url/${utm_keyword}${this.props.location.search}`)
      .then(res => res.json())
      .then(
        (result) => {
          window.location = result.data;
        // console.log("result ",)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("error ",error)
  
        }
      )
    }
   

 
   // let { email, password } = this.state;
    // if(email === null || email === "")
    //   return this.openNotification('Error', 'Email is required.', 0)
    // if(password === null || password === "")
    //   return this.openNotification('Error', 'Password is required.', 0)
    // if(password.length < 6)
    //   return this.openNotification('Error', 'Password must be atleast 6 characters long.', 0)

    // this.setState({ loader: true });
    // this.props
    //   .adminLogin({ email, password })
    //   .then((result) => {
    //     // return this.props.history.push('/dashboard');
    //   })
    //   .catch((error) => {
    //     this.setState({ loader: false });
    //     return this.openNotification('Error', error.message, 0);
    //   });
  };

  // openNotification = (message, description, status) => {
  //   let style = { color: 'green' };
  //   if (!status)
  //     style = {
  //       color: 'red',
  //     };
  //   const args = {
  //     message,
  //     description,
  //     duration: 3,
  //     style,
  //   };
  //   notification.open(args);
  // };

  // setStateValue(e, field) {
  //   let value = e.currentTarget.value;
  //   let state = this.state;
  //   state[`${field}`] = value;
  //   this.setState(state);
  // }

  // onKeyFormSubmission = (e) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     this.verifyCaptcha();
  //   }
  // };

  // verifyCaptcha = () => {
  //   let { email, password } = this.state;
  //   if (email === null || email === '') {
  //     this.recaptcha.reset();
  //     return this.openNotification('Error', 'Email is required.', 0);
  //   }
  //   if (password === null || password === '') {
  //     this.recaptcha.reset();
  //     return this.openNotification('Error', 'Password is required.', 0);
  //   }
  //   if (password.length < 6) {
  //     this.recaptcha.reset();
  //     return this.openNotification(
  //       'Error',
  //       'Password must be atleast 6 characters long.',
  //       0
  //     );
  //   }

  //   this.recaptcha.execute();
  // };

  // onCaptchaResolved = () => {
  //   this.loginHandler();
  //  // this.recaptcha.reset();
  // };

  render() {
    return (
      <React.Fragment>
        <Header />
        <div className='login-page centered-screen' style={styles}>
          <div className='login-container'>
            <div className='login-container-header'>
              <h3>Please Wait</h3>
            </div>
            
          </div>
        </div>

        
      </React.Fragment>
    );
  }
}


export default AddPage;

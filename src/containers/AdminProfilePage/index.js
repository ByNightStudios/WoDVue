import React from 'react';

import { Button, Form } from 'react-bootstrap';
import { notification } from 'antd';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import requireAuth from '../../hoc/requireAuth';
import { connect } from 'react-redux';
import { addStaff } from '../../actions/StaffActions';
import { updateAdminProfile } from '../../actions/AuthActions';
import AdminService from '../../service/AdminService';
import styles from './admin-profile-page.scss';
import get from 'lodash/get';

class AdminProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      first_name: null,
      last_name: null,
      mobile_number: null,
      email: null,
      password: null,
      confirm_password: null,
      loader: false,
      country_code: '91',
      showUpdatePassword: false,
    };

    this.adminService = new AdminService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Update Admin';

    const userDetails = get(this.props, 'user');
    if (userDetails) {
      this.setState({
        first_name: get(userDetails, 'first_name', ''),
        last_name: get(userDetails, 'last_name', ''),
        mobile_number: get(userDetails, 'mobile_number', ''),
        email: get(userDetails, 'email', ''),
      });
    }
  }

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  setStateValues = (e, field) => {
    let value = e.currentTarget.value;
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);
  };

  addStaffHandler = (e) => {
    const {
      first_name,
      last_name,
      mobile_number,
      email,
      password,
      country_code,
      confirm_password,
    } = this.state;

    let regex = /^\d{10,10}$/; // regx for phone number with 13 digits
    const mobileRegex = /^[0-9]*$/;

    if (first_name === null || first_name === '')
      return this.openNotification('Error', 'First name is required.', 0);
    if (last_name === null || last_name === '')
      return this.openNotification('Error', 'Last name is required.', 0);

    // phone number validation
    if (mobile_number === null || mobile_number === '')
      return this.openNotification(
        'Error',
        'Mobile Number is required with country code.',
        0
      );
    if (!regex.test(mobile_number)) {
      return this.openNotification('Error', 'Contact Number Feild is invalid');
    }

    // email validation
    if (email === null || email === '')
      return this.openNotification('Error', 'Email is required.', 0);
    if (
      this.state.showUpdatePassword &&
      (!password ||
        password.length < 6 ||
        !confirm_password ||
        confirm_password.length < 6 ||
        confirm_password !== password)
    ) {
      this.openNotification(
        'Error',
        'Passwords must be equal and greater than 6 characters.',
        0
      );
      return { success: false, payload: null };
    }

    let payload = {
      first_name,
      last_name,
      email,
      mobile_number,
    };

    if (this.state.showUpdatePassword) {
      payload.password = password;
    }

    this.setState({ loader: true });
    this.adminService
      .updateAdminProfile(payload)
      .then((result) => {
        this.openNotification('Success', 'Profile Updated Successfully.', 1);
        this.setState({ loader: false });
        if (result.data) {
          this.props.updateAdminProfile(result.data);
        }
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification(
          'Error',
          get(
            error,
            'response.data.message',
            'Something went wrong. Please try again later'
          ),
          0
        );
      });
  };

  showUpdatePasswordHandler = () => {
    this.setState({ showUpdatePassword: !this.state.showUpdatePassword });
  };

  openNotification = (message, description, status) => {
    let style = { color: 'green' };
    if (!status)
      style = {
        color: 'red',
      };
    const args = {
      message,
      description,
      duration: 3,
      style,
    };
    notification.open(args);
  };

  render() {
    const { navigationDeployed } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? 'addelders-page sidebar-page sidebar-page--open position-relative'
              : 'addelders-page sidebar-page sidebar-page--closed position-relative'
          }
          style={styles}
        >
          {navigationDeployed ? (
            <SideNavigation handleClose={this.handleNavigationToggle} />
          ) : (
            <Button
              type='button'
              className='btn btn-trigger'
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001"  />
            </Button>
          )}

          <main className='sidebar-page-wrapper position-relative'>
            <div className='internal-header'>
              <div className='internal-header-left'>
                <h2>Update Admin Profile</h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-12 col-sm-8'>
                  <div className='form-container'>
                    <Form className='map-responder-form'>
                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Vikram'
                              value={this.state.first_name}
                              onChange={(e) =>
                                this.setStateValues(e, 'first_name')
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderLastName'>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Batra'
                              value={this.state.last_name}
                              onChange={(e) =>
                                this.setStateValues(e, 'last_name')
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderContact'>
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                              type='number'
                              className='no-arrow'
                              maxLength={10}
                              placeholder='9876543210'
                              value={this.state.mobile_number}
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderEmail'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type='email'
                              autoComplete='username'
                              placeholder='abc@example.com'
                              value={this.state.email}
                              onChange={(e) => this.setStateValues(e, 'email')}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      {!this.state.showUpdatePassword ? (
                        <Button
                          type='button'
                          className='btn btn-link'
                          onClick={(e) => this.showUpdatePasswordHandler()}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Update Password
                        </Button>
                      ) : (
                        <Button
                          type='button'
                          className='btn btn-link'
                          onClick={(e) => this.showUpdatePasswordHandler()}
                        >
                          <FontAwesomeIcon icon={faMinus} /> Cancel
                        </Button>
                      )}
                      <br />
                      {this.state.showUpdatePassword ? (
                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Form.Group controlId='responderPassword'>
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder='New password'
                                onChange={(e) =>
                                  this.setStateValues(e, 'password')
                                }
                              />
                            </Form.Group>
                          </div>
                          <div className='col-12 col-sm-6'>
                            <Form.Group controlId='responderCPassword'>
                              <Form.Label>Confirm password</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder='Confirm new password'
                                onChange={(e) =>
                                  this.setStateValues(e, 'confirm_password')
                                }
                              />
                            </Form.Group>
                          </div>
                        </div>
                      ) : null}

                      <Button
                        className='btn btn-primary'
                        onClick={(e) => this.addStaffHandler(e)}
                      >
                        Save
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
        {this.state.loader ? <PageLoader /> : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default requireAuth(
  connect(mapStateToProps, { addStaff, updateAdminProfile })(AdminProfilePage)
);

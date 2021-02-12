import React from 'react';

import { Button, Form } from 'react-bootstrap';
import { notification, Checkbox } from 'antd';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import requireAuth from '../../hoc/requireAuth';
import { connect } from 'react-redux';
import { addStaff } from '../../actions/StaffActions';
import hasPermission from '../../hoc/hasPermission';
import AdminService from '../../service/AdminService';
import LanguagesSpoken from '../../components/LanguagesSpoken';
import styles from './add-staff-page.scss';

class AddStaffPage extends React.Component {
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
      languages: [],
      other_language: '',
      role_id: '',
      roles: [],
    };

    this.adminService = new AdminService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Add a staff user';
    this.getRoles();
  }

  getRoles = () => {
    this.adminService
      .getRolesList({ page: 'all' })
      .then((res) => {
        if (res.data) {
          this.setState({ roles: res.data });
        }
      })
      .catch((err) => {
        console.log('Unable to fetch roles right now');
      });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  setLanguages = (language) => {
    console.log(language, 'Setlangaugae');
    this.setStateValues(language, 'languages');
  };

  setStateValues = (e, field) => {
    let value;
    if (field === 'languages') {
      value = e;
    } else if (field !== 'role') {
      value = e.currentTarget.value;
    }
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);

    if (field === 'languages') {
      if (!this.state.languages.includes('Other')) {
        this.setState((state) => ({
          ...state,
          other_language: '',
        }));
      }
    }
  };

  addStaffHandler = (e) => {
    const {
      first_name,
      mobile_number,
      email,
      password,
      confirm_password,
      role_id,
      languages,
      other_language,
    } = this.state;

    if (first_name === null || first_name === '')
      return this.openNotification('Error', 'First name is required.', 0);

    // Mobile number validation for add a staff page

    if (mobile_number === null || mobile_number === '')
      return this.openNotification('Error', 'Mobile Number is required.', 0);

    let regx = /^\d{10,10}$/;
    if (!regx.test(mobile_number)) {
      return this.openNotification(
        'Error',
        'Contact Number Feild is invalid',
        0
      );
    }

    // email validation
    if (email === null || email === '')
      return this.openNotification('Error', 'Email is required.', 0);
    if (password === null || password === '')
      return this.openNotification('Error', 'Password is required.', 0);
    if (password.length < 6)
      return this.openNotification(
        'Error',
        'Password should be atleast 6 characters long.',
        0
      );
    if (confirm_password === null || confirm_password === '')
      return this.openNotification('Error', 'Confirm password is required.', 0);
    if (password !== confirm_password)
      return this.openNotification('Error', 'Passwords should match.', 0);
    if (role_id === null || role_id === '')
      return this.openNotification('Error', 'Role is required.', 0);
    if (languages.includes('Other') && other_language === '') {
      return this.openNotification('Error', 'Please fill other language.', 0);
    }

    this.setState({ loader: true, mobile_number });
    this.props
      .addStaff(this.props.user.id, this.state)
      .then((result) => {
        console.log(result);
        this.openNotification('Success', 'Staff Added Successfully.', 1);
        this.props.history.push('/staff');
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification('Error', error.message, 0);
      });
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
    const { navigationDeployed, roles } = this.state;

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
                <h2>Add a Staff User</h2>
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
                              placeholder='9876543210'
                              onChange={(e) =>
                                this.setStateValues(e, 'mobile_number')
                              }
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
                              onChange={(e) => this.setStateValues(e, 'email')}
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type='password'
                              placeholder='Password'
                              autoComplete='new-password'
                              onChange={(e) =>
                                this.setStateValues(e, 'password')
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderCPassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              type='password'
                              placeholder='Confirm Password'
                              autoComplete='new-password'
                              onChange={(e) =>
                                this.setStateValues(e, 'confirm_password')
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderPassword'>
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                              as='select'
                              placeholder='Select a Role'
                              onChange={(e) =>
                                this.setStateValues(e, 'role_id')
                              }
                              value={this.state.role_id}
                            >
                              <option value='' disabled>
                                Select a role
                              </option>
                              {roles &&
                                roles.length !== 0 &&
                                roles.map((role, index) => {
                                  return (
                                    <option key={index} value={role.id}>
                                      {role.role}
                                    </option>
                                  );
                                })}
                            </Form.Control>
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12 col-sm-12'>
                          <LanguagesSpoken
                            option={this.state.languages}
                            onChange={this.setLanguages}
                          />
                          <div className='row'>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='otherLanguage'>
                                <Form.Label>Other Language</Form.Label>
                                <Form.Control
                                  type='text'
                                  disabled={
                                    !this.state.languages.includes('Other')
                                  }
                                  value={
                                    this.state.languages.includes('Other')
                                      ? this.state.other_language
                                      : ''
                                  }
                                  placeholder='Other Langauge'
                                  onChange={(e) =>
                                    this.setStateValues(e, 'other_language')
                                  }
                                />
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default hasPermission(
  requireAuth(connect(mapStateToProps, { addStaff })(AddStaffPage))
);

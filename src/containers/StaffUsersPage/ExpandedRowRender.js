import React from 'react';
import { Button, Form } from 'react-bootstrap';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { updateStaff } from '../../actions/StaffActions';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import PageLoader from '../../components/PageLoader';

// Handler for Exapanded Record Functions - Use API Reference https://ant.design/components/table/
class ExpandedRowRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: this.props.record.first_name,
      last_name: this.props.record.last_name,
      email: this.props.record.email,
      mobile_number: this.props.record.mobile_number,
      password: null,
      confirm_password: null,
      showUpdatePassword: false,
      loader: false,
    };
  }

  updateStaffHandler = (e) => {
    e.preventDefault();

    const {
      first_name,
      email,
      last_name,
      mobile_number,
      password,
      confirm_password,
    } = this.state;
    if (first_name === null || first_name === '')
      return this.props.onClick('Error', 'First name is required.', 0);
    if (mobile_number === null || mobile_number === '')
      return this.props.onClick('Error', 'Mobile Number is required.', 0);
    if (mobile_number.length !== 10)
      return this.props.onClick(
        'Error',
        'Mobile Number should be 10 characters long.',
        0
      );
    if (!/^\d+$/.test(mobile_number))
      return this.props.onClick('Error', 'Mobile Number is invalid.', 0);
    if (email === null || email === '')
      return this.props.onClick('Error', 'Email is required.', 0);
    if ((password === null || password === '') && this.state.showUpdatePassword)
      return this.props.onClick('Error', 'Password is required.', 0);
    if (this.state.showUpdatePassword && password.length < 6)
      return this.props.onClick(
        'Error',
        'Password should be greater than 6 characters',
        0
      );
    if (
      this.state.showUpdatePassword &&
      (confirm_password === null || confirm_password === '')
    )
      return this.props.onClick('Error', 'Confirm password is required.', 0);
    if (this.state.showUpdatePassword && password !== confirm_password)
      return this.props.onClick('Error', 'Passwords must match.', 0);

    let details = { user_type: 1 };
    if (!this.state.showUpdatePassword)
      details = {
        ...details,
        first_name,
        last_name,
        mobile_number,
        email,
      };
    else
      details = {
        ...details,
        first_name,
        last_name,
        mobile_number,
        email,
        password,
      };
    this.setState({ loader: true });
    this.props
      .updateStaff(this.props.user.id, this.props.record.id, details)
      .then((result) => {
        this.setState({ loader: false });
        this.props.onClick('Success', 'Details Updated Successfully.', 1);
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.props.onClick('Error', error.message, 0);
      });
  };

  setStateValues = (e, field) => {
    let value = e.currentTarget.value;
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);
  };

  showUpdatePasswordHandler = () => {
    this.setState({ showUpdatePassword: !this.state.showUpdatePassword });
  };

  render() {
    return (
      <div className='responder-information'>
        <div className='row'>
          <div className='responder-information-column col-12 col-sm-6'>
            <div className='responder-information-wrapper'>
              <h5>Edit Staff Information</h5>
              <Form className='map-responder-form'>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderFirstName'>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Vikram'
                        value={this.state.first_name}
                        onChange={(e) => this.setStateValues(e, 'first_name')}
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
                        onChange={(e) => this.setStateValues(e, 'last_name')}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderContact'>
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='+919876543210'
                        value={this.state.mobile_number}
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
                          onChange={(e) => this.setStateValues(e, 'password')}
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
                  onClick={(e) => this.updateStaffHandler(e)}
                >
                  Save Changes
                </Button>
              </Form>
            </div>
          </div>
        </div>
        {this.state.loader ? <PageLoader /> : null}
      </div>
    );
  }
}

const mapsStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapsStateToProps, { updateStaff })(ExpandedRowRender);

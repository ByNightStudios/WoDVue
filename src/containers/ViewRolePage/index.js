import React from 'react';

import { notification, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { getRenderingHeader } from '../../common/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { ROLE_PERMISSIONS } from '../../common/constants';
import requireAuth from '../../hoc/requireAuth';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';

import AdminService from '../../service/AdminService';
import hasPermission from '../../hoc/hasPermission';

import styles from './view-role-page.scss';

class ViewRolePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      navigationDeployed: true,
      roleDetails: {},
      formData: {
        role_id: '',
        role: '',
        permissions: [],
      },
    };

    this.style = {};
    this.adminService = new AdminService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Role Details';
    this.getRoleData(this.props.match.params.id, true);
  }

  getRoleData = (id, showLoader = false) => {
    if (showLoader) {
      this._startPageLoader();
    }
    this.adminService
      .getRoleByID({ roleID: id })
      .then((res) => {
        this._stopPageLoader();
        if (res.data) {
          this.setState({ roleDetails: res.data }, () => {
            this.triggerEditRole();
          });
        }
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification('Error', 'Something went wrong', 0);
      });
  };

  openNotification = (message, description, status) => {
    const style = { color: status ? 'green' : 'red' };

    const args = {
      message,
      description,
      duration: 5,
      style,
    };

    notification.open(args);
  };

  _startPageLoader = () => {
    this.setState({ loader: true });
  };

  _stopPageLoader = () => {
    this.setState({ loader: false });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  setStateValues = (field, e) => {
    let value;
    let formData = this.state.formData;

    if (field !== 'permissions') {
      value = e.currentTarget.value;
      formData[`${field}`] = value;
    } else {
      value = e.target.value;

      let permissions = formData.permissions;
      if (permissions.includes(value)) {
        permissions = permissions.filter((p) => p !== value);
      } else {
        permissions.push(value);
      }
      formData.permissions = permissions;
    }

    this.setState({ formData });
  };

  triggerEditRole = () => {
    let formData = Object.assign({}, this.state.formData);
    const { roleDetails } = this.state;

    formData = {
      role_id: roleDetails.id,
      role: roleDetails.role,
      permissions: roleDetails.permissions,
    };

    this.setState({ formData });
  };

  formValidation = () => {
    let formData = Object.assign(this.state.formData, {});

    if (
      !formData.role_id ||
      !formData.role ||
      !formData.permissions ||
      !formData.permissions.length
    ) {
      return { success: false, payload: null };
    }

    let payload = {
      role_id: formData.role_id,
      role: formData.role,
      permissions: formData.permissions,
    };

    return { success: true, payload };
  };

  updateRoleDetails = () => {
    const validation = this.formValidation();

    if (!validation.success) {
      return this.openNotification(
        'Error',
        'Role Title and permissions are required.',
        0
      );
    }

    this._startPageLoader();
    this.adminService
      .editRole(validation.payload)
      .then((result) => {
        this.openNotification(
          'Success',
          'Role Details Updated Successfully.',
          1
        );
        this._stopPageLoader();
        this.getRoleData(this.state.roleDetails.id, false);
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification('Error', error.message, 0);
      });
  };

  render() {
    const { navigationDeployed, formData } = this.state;
    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? 'viewelder-page sidebar-page sidebar-page--open position-relative'
              : 'viewelder-page sidebar-page sidebar-page--closed position-relative'
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
                <h2>Role Details</h2>
              </div>
            </div>

            <div className='internal-content'>
              <div className='elder-details'>
                <div className='row'>
                  <div className='col-12 col-sm-8'>
                    <div className='elder-details-area'>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group>
                            <Form.Label>Role Title</Form.Label>

                            <Form.Control
                              disabled
                              type='text'
                              value={formData.role}
                              placeholder='IT Admin'
                              // onChange={(e) => this.setStateValues('role', e)}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12'>
                          <Form.Label>Permissions</Form.Label>
                          <div className='row'>
                            {Object.keys(ROLE_PERMISSIONS).map(
                              (permission, index) => {
                                return (
                                  <div key={index} className='col-6'>
                                    <Checkbox
                                      checked={
                                        formData &&
                                        formData.permissions &&
                                        formData.permissions.includes(
                                          ROLE_PERMISSIONS[permission].value
                                        )
                                          ? true
                                          : false
                                      }
                                      onChange={(e) =>
                                        this.setStateValues('permissions', e)
                                      }
                                      value={ROLE_PERMISSIONS[permission].value}
                                      style={
                                        formData &&
                                        formData.permissions &&
                                        formData.permissions.includes(
                                          ROLE_PERMISSIONS[permission].value
                                        )
                                          ? this.style
                                          : null
                                      }
                                    >
                                      {ROLE_PERMISSIONS[permission].name}
                                    </Checkbox>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => this.updateRoleDetails()}
                        type='button'
                        className='btn btn-primary'
                      >
                        Save
                      </Button>
                    </div>
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
const mapsStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {};

export default hasPermission(
  requireAuth(connect(mapsStateToProps, mapDispatchToProps)(ViewRolePage))
);

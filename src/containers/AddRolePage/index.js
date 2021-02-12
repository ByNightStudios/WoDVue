import React from 'react';
import * as _ from 'lodash';

import { notification, Checkbox, Modal } from 'antd';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { getRenderingHeader } from '../../common/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { ROLE_PERMISSIONS as PERMISSIONS } from '../../common/constants';
import requireAuth from '../../hoc/requireAuth';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import AdminService from '../../service/AdminService';
import hasPermission from '../../hoc/hasPermission';

import styles from './add-role-page.scss';
class ViewRolePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      navigationDeployed: true,
      formData: {
        role: '',
        permissions: [],
      },
    };

    this.style = {};
    this.adminService = new AdminService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Add Role';
  }

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

  formValidation = () => {
    let formData = Object.assign(this.state.formData, {});

    if (
      !formData.role ||
      !formData.permissions ||
      !formData.permissions.length
    ) {
      return { success: false, payload: null };
    }

    let payload = {
      role: formData.role,
      permissions: formData.permissions,
    };

    return { success: true, payload };
  };

  addRoleConfirmation = () => {
    Modal.confirm({
      title: `You won't be able to edit this role's title once added. Continue ?`,
      okType: 'danger',
      okText: 'Yes, Continue',
      cancelText: 'No, Abort',
      centered: true,
      onOk: () => {
        this.addRoleHandler();
      },
      onCancel() {
        return;
      },
    });
  };

  addRoleHandler = () => {
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
      .addRole(validation.payload)
      .then((result) => {
        this.openNotification('Success', 'Role Created Successfully.', 1);
        this._stopPageLoader();
        this.props.history.push('/roles');
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
                              type='text'
                              value={formData.role}
                              onChange={(e) => this.setStateValues('role', e)}
                              placeholder='IT Admin'
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12'>
                          <Form.Label>Permissions</Form.Label>
                          <div className='row'>
                            {Object.keys(PERMISSIONS).map(
                              (permission, index) => {
                                return (
                                  <div key={index} className='col-6'>
                                    <Checkbox
                                      checked={
                                        formData &&
                                        formData.permissions &&
                                        formData.permissions.includes(
                                          PERMISSIONS[permission].value
                                        )
                                          ? true
                                          : false
                                      }
                                      onChange={(e) =>
                                        this.setStateValues('permissions', e)
                                      }
                                      value={PERMISSIONS[permission].value}
                                      style={
                                        formData &&
                                        formData.permissions &&
                                        formData.permissions.includes(
                                          PERMISSIONS[permission].value
                                        )
                                          ? this.style
                                          : null
                                      }
                                    >
                                      {PERMISSIONS[permission].name}
                                    </Checkbox>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => this.addRoleConfirmation()}
                        type='button'
                        className='btn btn-primary'
                      >
                        ADD
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

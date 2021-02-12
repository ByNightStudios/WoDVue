import React from 'react';
import { get, isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { Table, Typography, notification, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import { getRenderingHeader } from '../../common/helpers';

import requireAuth from '../../hoc/requireAuth';

import ElderService from '../../service/ElderService';
import AdminService from '../../service/AdminService';
import hasPermission from '../../hoc/hasPermission';

import styles from './assign-team-member-page.scss';

const { Option } = Select;

class AssignTeamMemberPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      loader: false,
      users: [],
      admins: [],
      userIDs: [],
      role: '',
      admin_id: '',
      userSearch: '',
      teamDataSourceList: [],
    };

    this.elderService = new ElderService();
    this.adminService = new AdminService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Bulk Assign Team Member';
  }

  startLoader = () => {
    this.setState({ loader: true });
  };

  stopLoader = () => {
    this.setState({ loader: false });
  };

  formValidation = () => {
    const { role, admin_id, userIDs } = this.state;

    if (!role || !admin_id || !userIDs.length) {
      return false;
    }
    return true;
  };

  setStateValues = (e, field) => {
    let value = '';
    if (field === 'role') {
      value = e.currentTarget.value;
      this.setState({
        teamDataSourceList: [],
      });
    } else {
      value = e;
    }
    this.setState(
      state => ({
        ...state,
        [`${field}`]: value,
      }),
      () => {
        if (field === 'role' && value) {
          this.getTeamMembers();
        }
      },
    );
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

  getUsers = userSearch => {
    this.elderService
      .getEldersList(1, userSearch)
      .then(res => {
        if (res.data && res.data.length) {
          this.setState({ users: res.data });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getTeamMembers = () => {
    if (!this.state.role) {
      return;
    }

    this.startLoader();

    const dataPayload = {
      role: this.state.role,
    };

    this.adminService
      .getAdminsByRole(dataPayload)
      .then(responseData => {
        this.stopLoader();
        if (responseData.data) {
          this.setState(state => ({
            ...state,
            admins: responseData.data,
          }));
        }
      })
      .catch(errorData => {
        this.stopLoader();
        const errorMessage = get(
          errorData,
          'response.data.message',
          'Something went wrong while fetching team members.',
        );

        this.openNotification('Error', errorMessage, 0);
      });
  };

  bulkAssignTeamMembers = () => {
    const valid = this.formValidation();

    if (!valid) {
      return this.openNotification('Error', 'All fields are required', 0);
    }

    const dataPayload = {
      role: this.state.role,
      admin_id: this.state.admin_id,
      user_id: this.state.userIDs,
    };

    this.startLoader();

    this.elderService
      .bulkAssignTeamMembers(dataPayload)
      .then(responseData => {
        this.stopLoader();
        this.openNotification(
          'Success',
          'Bulk Team Member Assignment Successful.',
          1,
        );
        this.resetStateHandler();
      })
      .catch(errorData => {
        this.stopLoader();
        const errorMessage = get(
          errorData,
          'response.data.message',
          'Something went wrong while assigning team member.',
        );

        this.openNotification('Error', errorMessage, 0);
      });
  };

  resetStateHandler = () => {
    this.setState({
      users: [],
      admins: [],
      userIDs: [],
      role: '',
      admin_id: '',
      userSearch: '',
    });
  };

  componentDidUpdate() {
    if (!isEmpty(this.state.role) && isEmpty(this.state.teamDataSourceList)) {
      this.adminService
        .adminsListRoles({ role: this.state.role })
        .then(result => {
          if (result) {
            this.setState({
              teamDataSourceList: result.data,
            });
          }
        });
    }
  }

  render() {
    const { navigationDeployed } = this.state;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'full_name',
        key: 'full_name',
      },
    ];

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
              type="button"
              className="btn btn-trigger"
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001" />
            </Button>
          )}

          <main className="sidebar-page-wrapper position-relative">
            <div className="internal-header">
              <div className="internal-header-left">
                <h2>Assign Team Members</h2>
              </div>
            </div>
            <div className="internal-content">
              <div className="row">
                <div className="col-6 col-sm-6">
                  <div className="form-container">
                    <Form className="map-provider-form">
                      <div className="row">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-sm-10">
                              <Form.Group controlId="communityEventCity">
                                <Form.Label>
                                  Please select multiple users
                                </Form.Label>
                                <Select
                                  showSearch
                                  mode="multiple"
                                  placeholder="Select Multiple Users"
                                  onChange={e =>
                                    this.setStateValues(e, 'userIDs')
                                  }
                                  value={this.state.userIDs}
                                  onSearch={this.getUsers}
                                  defaultActiveFirstOption={false}
                                  filterOption={false}
                                  style={{ minWidth: 300 }}
                                >
                                  <Option value="" disabled>
                                    Please select multiple users
                                  </Option>
                                  {this.state.users && this.state.users.length
                                    ? this.state.users.map((user, index) => (
                                        <Option key={index} value={user.id}>
                                          {`${user.full_name} (${
                                          user.mobile_number
                                        })`}
                                        </Option>
                                      ))
                                    : null}
                                </Select>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-10">
                              <Form.Group controlId="communityEventCity">
                                <Form.Label>Select a role</Form.Label>
                                <Form.Control
                                  as="select"
                                  value={this.state.role}
                                  onChange={e => this.setStateValues(e, 'role')}
                                >
                                  <option value="" disabled>
                                    Please select a role
                                  </option>
                                  <option value="doctor">Doctor</option>
                                  <option value="physio">Physio</option>
                                  <option value="community">Community</option>
                                  <option value="dietitian">Dietitian</option>
                                  <option value="scrm">Scrm</option>
                                </Form.Control>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-10">
                              <Form.Group controlId="communityEventCity">
                                <Form.Label>
                                  Please select a team member
                                </Form.Label>
                                <Select
                                  showSearch
                                  placeholder="select a team member"
                                  onChange={e =>
                                    this.setStateValues(e, 'admin_id')
                                  }
                                  value={this.state.admin_id}
                                  defaultActiveFirstOption={false}
                                  optionFilterProp="children"
                                  style={{ minWidth: 300 }}
                                >
                                  <Option value="" disabled>
                                    Please select a team member
                                  </Option>
                                  {this.state.admins &&
                                    this.state.admins.length !== 0 &&
                                    this.state.admins.map((admin, index) => (
                                      <Option key={index} value={admin.id}>
                                        {admin.full_name}
                                      </Option>
                                    ))}
                                </Select>
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="btn btn-primary"
                        onClick={() => this.bulkAssignTeamMembers()}
                      >
                        Save
                      </Button>
                    </Form>
                  </div>
                </div>
                <div className="col-6 col-sm-6">
                  <Typography>Team List : {this.state.role} </Typography>
                  <Table
                    dataSource={this.state.teamDataSourceList}
                    columns={columns}
                  />
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

const mapStateToProps = state => ({
  user: state.user.user,
});

export default hasPermission(
  requireAuth(
    connect(
      mapStateToProps,
      {},
    )(AssignTeamMemberPage),
  ),
);

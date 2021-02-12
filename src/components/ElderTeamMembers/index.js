import React from 'react';

import get from 'lodash/get';

import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { Select, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import ElderTeamMembersDataManager from './dataManager';

import styles from './elder-team-members.scss';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';

const { Option } = Select;
const { confirm } = Modal;
class ElderTeamMembers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      erm: [],
      doctor: [],
      dietitian: [],
      physio: [],
      community: [],
      assignedTeamMembers: {},
      formData: {
        erm: [],
        doctor: [],
        dietitian: [],
        physio: [],
        community: [],
      },
    };

    this.elderTeamMembersDataManager = new ElderTeamMembersDataManager();
  }

  componentDidMount() {
    this.getAssignedTeamMembers();
  }

  getAssignedTeamMembers = () => {
    const payload = {
      elderIdentifier: this.props.currentElderIdentifier,
    };
    this.elderTeamMembersDataManager
      .getAssignedTeamMembers(payload)
      .then(responseData => {
        if (responseData.data) {
          this.setState({ assignedTeamMembers: responseData.data });
        }
      })
      .catch(errorData => {
        const errorMessage = get(
          errorData,
          'response.data.message',
          'Something went wrong while fetching assigned team members.',
        );

        this.props.openNotification('Error', errorMessage, 0);
      });
  };

  setStateValues = (e, field) => {
    const formData = Object.assign({}, this.state.formData);
    formData[`${field}`] = e;
    this.setState({ formData });
  };

  handleDeleteConfirmation = (identifier, role) => {
    confirm({
      title: 'Are you sure you wish to remove this team member?',
      okType: 'danger',
      okText: 'Yes, Continue',
      cancelText: 'No, Abort',
      centered: true,
      onOk: () => {
        this.removeAssignedTeamMember(identifier, role);
      },
      onCancel() {},
    });
  };

  removeAssignedTeamMember = (adminIdentifier, role) => {
    this.props.startLoader();

    const dataPayload = {
      role,
      admin_id: adminIdentifier,
      user_id: this.props.currentElderIdentifier,
    };

    this.elderTeamMembersDataManager
      .removeAssignedTeamMembers(dataPayload)
      .then(responseData => {
        this.props.stopLoader();
        if (responseData.data) {
          this.setState(state => ({
            ...state,
            [`${role}`]: [],
            assignedTeamMembers: responseData.data,
          }));

          this.props.openNotification(
            'Success',
            'Team Member Removed Successfully.',
            1,
          );
        }
      })
      .catch(errorData => {
        this.props.stopLoader();
        const errorMessage = get(
          errorData,
          'response.data.message',
          'Something went wrong while removed assigned team member.',
        );

        this.props.openNotification('Error', errorMessage, 0);
      });
  };

  getTeamMembers = role => {
    if (this.state[role] && this.state[role].length) {
      return;
    }

    const dataPayload = {
      role,
      user_id: this.props.currentElderIdentifier,
    };

    this.elderTeamMembersDataManager
      .getUnassignedTeamMembers(dataPayload)
      .then(responseData => {
        if (responseData.data) {
          this.setState(state => ({
            ...state,
            [`${role}`]: responseData.data,
          }));
        }
      })
      .catch(errorData => {
        const errorMessage = get(
          errorData,
          'response.data.message',
          'Something went wrong while fetching team members.',
        );

        this.props.openNotification('Error', errorMessage, 0);
      });
  };

  formValidation = () => {
    const { erm, doctor, community, dietitian, physio } = this.state.formData;

    if (
      !erm.length &&
      !doctor.length &&
      !physio.length &&
      !community.length &&
      !dietitian.length
    ) {
      this.props.openNotification(
        'Error',
        'Assigned Team Members cannot be empty',
        0,
      );
      return false;
    }

    return true;
  };

  assignTeamMembers = () => {
    const valid = this.formValidation();

    if (valid) {
      this.props.startLoader();

      const dataPayload = {
        user_id: this.props.currentElderIdentifier,
        ...this.state.formData,
      };

      this.elderTeamMembersDataManager
        .assignTeamMembers(dataPayload)
        .then(responseData => {
          this.props.stopLoader();
          if (responseData.data) {
            this.setState(
              {
                assignedTeamMembers: responseData.data,
              },
              () => this.resetStateHandler(),
            );

            this.props.openNotification(
              'Success',
              'Team Members Assigned Successfully.',
              1,
            );
          }
        })
        .catch(errorData => {
          this.props.stopLoader();
          const errorMessage = get(
            errorData,
            'response.data.message',
            'Something went wrong while assigning team member.',
          );

          this.props.openNotification('Error', errorMessage, 0);
        });
    }
  };

  resetStateHandler = () => {
    this.setState(state => ({
      ...state,
      erm: [],
      doctor: [],
      dietitian: [],
      physio: [],
      community: [],
      formData: {
        erm: [],
        doctor: [],
        dietitian: [],
        physio: [],
        community: [],
      },
    }));
  };

  render() {
    const {
      formData,
      erm,
      doctor,
      community,
      physio,
      dietitian,
      assignedTeamMembers,
    } = this.state;

    return (
      <div className="team-members" style={styles}>
        <div className="row">
          <div className="col-12 col-sm-6">
            <h4>Team Members Assigned</h4>

            <div className="form-container">
              <Form.Group controlId="communityEventCity">
                <Form.Label>Assign Doctor</Form.Label>
                <div className="form-select">
                  <Select
                    showSearch
                    mode="multiple"
                    placeholder="Search for a Doctor"
                    optionFilterProp="children"
                    onFocus={() => this.getTeamMembers('doctor')}
                    onChange={e => this.setStateValues(e, 'doctor')}
                    value={formData.doctor}
                    style={{ minWidth: 300 }}
                  >
                    <Option value={null} disabled>
                      Please select a Doctor
                    </Option>
                    {doctor.length !== 0 &&
                      doctor.map((admin, index) => (
                        <Option key={index} value={admin.id}>
                          {admin.full_name}
                        </Option>
                      ))}
                  </Select>
                </div>
              </Form.Group>

              {assignedTeamMembers &&
                assignedTeamMembers.doctor &&
                assignedTeamMembers.doctor.length !== 0 && (
                  <div className="assigned-members">
                    {assignedTeamMembers.doctor.map((admin, index) => (
                    <div key={index} className="assigned-members-item">
                      <div className="assigned-members-wrapper d-flex align-items-center justify-content-start">
                          <h4>{get(admin, 'full_name', 'N/A')}</h4>
                        <button
                          type="button"
                          className="btn btn-link"
                            onClick={() =>
                            this.handleDeleteConfirmation(admin.id, 'doctor')
                            }
                          disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                        </div>
                      </div>
                  ))}
                  </div>
                )}

              <Form.Group controlId="communityEventCity">
                <Form.Label>Assign Community Manager</Form.Label>
                <div className="form-select">
                  <Select
                    showSearch
                    mode="multiple"
                    placeholder="Search for a Community Manager"
                    optionFilterProp="children"
                    onFocus={() => this.getTeamMembers('community')}
                    onChange={e => this.setStateValues(e, 'community')}
                    value={formData.community}
                    style={{ minWidth: 300 }}
                  >
                    <Option value={null} disabled>
                      Please select a Community Manager
                    </Option>
                    {community.length !== 0 &&
                      community.map((admin, index) => (
                        <Option key={index} value={admin.id}>
                          {admin.full_name}
                        </Option>
                      ))}
                  </Select>
                </div>
              </Form.Group>

              {assignedTeamMembers &&
                assignedTeamMembers.community &&
                assignedTeamMembers.community.length !== 0 && (
                  <div className="assigned-members">
                    {assignedTeamMembers.community.map((admin, index) => (
                    <div key={index} className="assigned-members-item">
                      <div className="assigned-members-wrapper d-flex align-items-center justify-content-start">
                          <h4>{get(admin, 'full_name', 'N/A')}</h4>
                        <button
                          type="button"
                          className="btn btn-link"
                            onClick={() =>
                              this.handleDeleteConfirmation(
                              admin.id,
                              'community',
                              )
                          }
                          disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                        </div>
                    </div>
                    ))}
                  </div>
                )}

              <Form.Group controlId="communityEventCity">
                <Form.Label>Assign Physio</Form.Label>
                <div className="form-select">
                  <Select
                    showSearch
                    mode="multiple"
                    placeholder="Search for a Physio"
                    optionFilterProp="children"
                    onFocus={() => this.getTeamMembers('physio')}
                    onChange={e => this.setStateValues(e, 'physio')}
                    value={formData.physio}
                    style={{ minWidth: 300 }}
                  >
                    <Option value={null} disabled>
                      Please select a Physio
                    </Option>
                    {physio.length !== 0 &&
                      physio.map((admin, index) => (
                        <Option key={index} value={admin.id}>
                          {admin.full_name}
                        </Option>
                      ))}
                  </Select>
                </div>
              </Form.Group>

              {assignedTeamMembers &&
                assignedTeamMembers.physio &&
                assignedTeamMembers.physio.length !== 0 && (
                  <div className="assigned-members">
                    {assignedTeamMembers.physio.map((admin, index) => (
                    <div key={index} className="assigned-members-item">
                      <div className="assigned-members-wrapper d-flex align-items-center justify-content-start">
                          <h4>{get(admin, 'full_name', 'N/A')}</h4>
                        <button
                          type="button"
                          className="btn btn-link"
                            onClick={() =>
                            this.handleDeleteConfirmation(admin.id, 'physio')
                            }
                          disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                      </div>
                      </div>
                  ))}
                  </div>
                )}

              <Form.Group controlId="communityEventCity">
                <Form.Label>Assign Dietitian</Form.Label>
                <div className="form-select">
                  <Select
                    showSearch
                    mode="multiple"
                    placeholder="Search for a Dietitian"
                    optionFilterProp="children"
                    onFocus={() => this.getTeamMembers('dietitian')}
                    onChange={e => this.setStateValues(e, 'dietitian')}
                    value={formData.dietitian}
                    style={{ minWidth: 300 }}
                  >
                    <Option value={null} disabled>
                      Please select a Dietitian
                    </Option>
                    {dietitian.length !== 0 &&
                      dietitian.map((admin, index) => (
                        <Option key={index} value={admin.id}>
                          {admin.full_name}
                        </Option>
                      ))}
                  </Select>
                </div>
              </Form.Group>

              {assignedTeamMembers &&
                assignedTeamMembers.dietitian &&
                assignedTeamMembers.dietitian.length !== 0 && (
                  <div className="assigned-members">
                    {assignedTeamMembers.dietitian.map((admin, index) => (
                    <div key={index} className="assigned-members-item">
                      <div className="assigned-members-wrapper d-flex align-items-center justify-content-start">
                        <h4>{get(admin, 'full_name', 'N/A')}</h4>
                        <button
                          type="button"
                          className="btn btn-link"
                            onClick={() =>
                            this.handleDeleteConfirmation(
                                admin.id,
                              'dietitian',
                            )
                            }
                          disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                        >
                            >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                      </div>
                  ))}
                  </div>
                )}

              <button
                className="btn btn-primary"
                onClick={() => this.assignTeamMembers()}
                disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  elderdata: state.elder.elderData,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ElderTeamMembers);

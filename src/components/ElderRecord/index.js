import React, { Component } from 'react';
import { get } from 'lodash';
import { Modal } from 'antd';
import {
  medicalRecordsAction,
  selectedMedicalRecordAction,
  editMedicalRecordAction,
  addMedicalRecordAction,
  purgeMedicalRecords,
} from '../../actions/ElderActions';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import {
  faFolderPlus,
  faPlus,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MedicalRecords from '../MedicalRecords';
import ElderDirectory from '../ElderDirectory';
import ElderDocumentsDataFile from './dataManager';
import AddMedicalRecord from '../AddMedicalRecord';

import styles from './elder-record.scss';
import { checkForSensorAndDocumentationTab } from '../../utils/checkElderEditPermission';

const { confirm } = Modal;

class ElderDocument extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: null,
      directoryName: '',
      addDirectoryForm: false,
      editDirectoryForm: false,
      selectedDirectory: null,
    };

    this.dataManager = new ElderDocumentsDataFile();
  }

  componentDidMount() {
    this.getDirectories();
  }

  getDirectories = () => {
    const dataPayload = {
      currentElderIdentifier: this.props.currentElderIdentifier,
    };

    this.dataManager
      .getDirectory(dataPayload)
      .then((responseData) => {
        this.props.stopLoader();
        this.props.medicalRecordsAction(responseData.data);
      })
      .catch((errorData) => {
        this.props.stopLoader();

        this.props.openNotification(
          'Error!',
          errorData.response.data.message,
          0
        );
      });
  };

  handleFieldUpdate = (fieldName, fieldValue) => {
    this.setState((state) => ({
      ...state,
      [`${fieldName}`]: fieldValue,
    }));
  };

  addDirectoryHandler = () => {
    this.props.startLoader();

    const { directoryName } = this.state;

    if (directoryName !== '' || directoryName !== null) {
      const dataPayload = {
        name: directoryName,
        user_id: this.props.currentElderIdentifier,
      };

      this.dataManager
        .addDirectory(dataPayload)
        .then((responseData) => {
          this.props.stopLoader();

          this.props.medicalRecordsAction(responseData.data);

          this.setState({ directoryName: '', addDirectoryForm: false });

          this.props.openNotification(
            'Success',
            'Directory Added Successfully.',
            1
          );
        })
        .catch((errorData) => {
          this.props.stopLoader();

          this.props.openNotification(
            'Error!',
            errorData.response.data.message,
            0
          );
        });
    } else {
      this.props.stopLoader();

      this.props.openNotification(
        'Error!',
        'Directory Name cannot be empty.',
        0
      );
    }
  };

  editDirectoryHandler = () => {
    this.props.startLoader();

    const { directoryName, selectedDirectory } = this.state;

    if (directoryName !== '' || directoryName !== null) {
      const dataPayload = {
        name: directoryName,
        user_id: this.props.currentElderIdentifier,
        directoryID: selectedDirectory,
      };

      this.dataManager
        .editDirectory(dataPayload)
        .then((responseData) => {
          this.props.stopLoader();
          this.props.medicalRecordsAction(responseData.data);
          this.props.openNotification(
            'Success',
            'Directory Updated Successfully.',
            1
          );
          this.setState({
            editDirectoryForm: false,
          });
        })
        .catch((errorData) => {
          this.props.stopLoader();
          this.props.openNotification(
            'Error!',
            errorData.response.data.message,
            0
          );
        });
    } else {
      this.props.stopLoader();
      this.props.openNotification(
        'Error!',
        'Directory Name cannot be empty.',
        0
      );
    }
  };

  selectedDirectoryHandler = (directoryID, directoryName, system) => {
    this.setState(
      (state) => ({
        ...state,
        directoryName,
        status: system,
        addDirectoryForm: false,
        editDirectoryForm: false,
        selectedDirectory: directoryID,
      }),
      () => {
        this.props.selectedMedicalRecordAction();

        if (this.props.elderRecords.editRecord) {
          this.props.editMedicalRecordAction();
        }
      }
    );
  };

  deleteDirectoryHandler = () => {
    confirm({
      title: 'Are you sure you wish to remove this directory?',
      okType: 'danger',
      okText: 'Yes, Continue',
      cancelText: 'No, Abort',
      centered: true,
      onOk: () => {
        if (this.state.status) {
          this.props.openNotification('Error', 'Can not delete Directory', 0);
        } else {
          this.handleDeleteDirectory();
        }
      },
      onCancel() {
        return;
      },
    });
  };

  handleDeleteDirectory = () => {
    const { selectedDirectory } = this.state;
    if (selectedDirectory) {
      const dataPayload = {
        directoryID: selectedDirectory,
        user_id: this.props.currentElderIdentifier,
      };

      this.props.startLoader();

      this.dataManager
        .deleteDirectory(dataPayload)
        .then((responseData) => {
          this.props.stopLoader();
          // Store Data Inside Storage
          this.props.medicalRecordsAction(responseData.data);

          this.props.openNotification(
            'Success',
            'Directory Deleted Successfully',
            1
          );
          this.setState({
            selectedDirectory: null,
            addDirectoryForm: false,
            editDirectoryForm: false,
          });
        })
        .catch((errorData) => {
          this.props.stopLoader();
          console.log('UNABLE TO DELETE DIRECTORY', errorData);
        });
    }
  };

  addRecordHandler = () => {
    this.props.addMedicalRecordAction();
    this.props.selectedMedicalRecordAction();
    if (this.props.elderRecords.editRecord) {
      this.props.editMedicalRecordAction();
    }
  };

  toggleDirectoryForm = () => {
    this.setState((state) => ({
      ...state,
      directoryName: '',
      selectedDirectory: null,
      editDirectoryForm: false,
      addDirectoryForm: !state.addDirectoryForm,
    }));
  };

  toggleEditDirectoryForm = () => {
    this.setState((state) => ({
      ...state,
      addDirectoryForm: false,
      editDirectoryForm: !state.editDirectoryForm,
    }));
  };

  render() {
    const {
      addDirectoryForm,
      editDirectoryForm,
      selectedDirectory,
      directoryName,
      status,
    } = this.state;

    const { elderRecords } = this.props;

    return (
      <div className='elder-documents' style={styles}>
        <div className='elder-documents-header'>
          <h4>Documents</h4>
        </div>

        <div className='elder-documents-content'>
          {addDirectoryForm && (
            <div className='row'>
              <div className='col-12 col-sm-6'>
                <div className='elder-documents-add d-flex align-items-center justify-content-start'>
                  <Form.Group controlId='directoryName'>
                    <Form.Control
                      name='Add Directory'
                      placeholder='Type a name for the directory'
                      value={directoryName}
                      onChange={(event) =>
                        this.handleFieldUpdate(
                          'directoryName',
                          event.target.value
                        )
                      }
                      disabled={checkForSensorAndDocumentationTab(this.props.user, this.props.elderData)}
                    />
                  </Form.Group>

                  <button
                    type='button'
                    className='btn btn-secondary btn-search'
                    onClick={() => this.addDirectoryHandler()}
                    disabled={checkForSensorAndDocumentationTab(this.props.user, this.props.elderData)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {editDirectoryForm && (
            <div className='row'>
              <div className='col-12 col-sm-6'>
                <div className='elder-documents-add d-flex align-items-center justify-content-start'>
                  <Form.Group controlId='directoryName'>
                    <Form.Control
                      name='Edit Directory'
                      placeholder='Type a name for the directory'
                      value={directoryName}
                      onChange={(event) =>
                        this.handleFieldUpdate(
                          'directoryName',
                          event.target.value
                        )
                      }
                      disabled={checkForSensorAndDocumentationTab(this.props.user, this.props.elderData)}
                    />
                  </Form.Group>

                  <button
                    type='button'
                    className='btn btn-secondary btn-search'
                    onClick={() => this.editDirectoryHandler()}
                    disabled={checkForSensorAndDocumentationTab(this.props.user, this.props.elderData)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedDirectory && (
            <div className='row'>
              <div className='col-12 col-sm-6'>
                {!status && (
                  <div className='elder-documents-add d-flex align-items-center justify-content-start'>
                    <>
                      <button
                        type='button'
                        className='btn btn-secondary btn-remove'
                        onClick={() => this.toggleEditDirectoryForm()}
                        disabled={checkForSensorAndDocumentationTab(this.props.user, this.props.elderData)}
                      >
                        {editDirectoryForm ? 'Cancel' : 'Edit Directory'}
                      </button>

                      <button
                        type='button'
                        className='btn btn-secondary btn-remove'
                        onClick={() => this.deleteDirectoryHandler()}
                        disabled={checkForSensorAndDocumentationTab(this.props.user, this.props.elderData)}
                      >
                        Delete Directory
                      </button>
                    </>
                  </div>
                )}
              </div>

              <div className='col-12 col-sm-6'>
                <div className='elder-documents-add d-flex align-items-center justify-content-start'>
                  <button
                    className='btn btn-secondary btn-add'
                    onClick={() => this.addRecordHandler()}
                    disabled={checkForSensorAndDocumentationTab(this.props.user, this.props.elderData)}
                  >
                    {get(this.props, 'elderRecords.addRecord', false) === true
                      ? 'Cancel'
                      : 'Add Record'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='elder-documents-tree'>
          <div className='row'>
            <div className='col-12 col-sm-6'>
              <div className='elder-directory-wrapper'>
                {elderRecords &&
                  elderRecords.medicalRecords &&
                  elderRecords.medicalRecords.length !== 0 &&
                  elderRecords.medicalRecords.map((directory) => {
                    return (
                      <ElderDirectory
                        key={directory.id}
                        directoryData={directory}
                        directoryName={directory.name}
                        selectedDirectory={selectedDirectory}
                        selectedOnClick={this.selectedDirectoryHandler}
                      />
                    );
                  })}

                <button
                  className='elder-directory elder-directory--new'
                  onClick={() => this.toggleDirectoryForm()}
                  disabled={checkForSensorAndDocumentationTab(this.props.user, this.props.elderData)}
                >
                  <FontAwesomeIcon
                    className='elder-directory-icon'
                    icon={faFolderPlus}
                  />
                  <span className='elder-directory-text d-block text-center'>
                    Add New
                  </span>
                </button>
              </div>
            </div>

            <div className='col-12 col-sm-6'>
              <div className='elder-records-wrapper'>
                {selectedDirectory &&
                  get(this.props, 'elderRecords.addRecord', false) === true && (
                    <AddMedicalRecord
                      {...this.props}
                      selectedDirectory={selectedDirectory}
                    />
                  )}

                <div className='elder-records-scrollable'>
                  {selectedDirectory && (
                    <MedicalRecords
                      {...this.props}
                      selectedDirectory={selectedDirectory}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this.props.purgeMedicalRecords();
  }
}

const mapStateToProps = (state) => ({
  elderRecords: state.elder.records,
});

const mapDispatchToProps = {
  medicalRecordsAction,
  selectedMedicalRecordAction,
  editMedicalRecordAction,
  addMedicalRecordAction,
  purgeMedicalRecords,
};

export default connect(mapStateToProps, mapDispatchToProps)(ElderDocument);

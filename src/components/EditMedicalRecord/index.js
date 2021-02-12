import React, { Component } from 'react';
import moment from 'moment';

import { get } from 'lodash';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import {
  medicalRecordsAction,
  selectedMedicalRecordAction,
  editMedicalRecordAction,
} from '../../actions/ElderActions';
import { DatePicker } from 'antd';
import { UPLOAD_S3_URL } from '../../common/backendConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

import S3FileUploader from '../S3FileUploader';
import ElderMedicalRecordFile from './dataManager';

import styles from './edit-medical-record.scss';

const ElderMedicalRecordManager = new ElderMedicalRecordFile();

class EditMedicalRecord extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaName: null,
      formData: {
        recordID: '',
        name: '',
        tag: '',
        report_date: null,
        metadata: [],
        media_id: '',
      },
    };
  }

  componentDidMount() {
    const { selectedRecord } = this.props.elderRecords;

    if (selectedRecord) {
      this.setState((state) => ({
        ...state,
        mediaName: get(selectedRecord, 'media.id', null),
        formData: {
          ...state.formData,
          recordID: get(selectedRecord, 'id'),
          name: get(selectedRecord, 'name', ''),
          tag: get(selectedRecord, 'tag', ''),
          report_date: get(selectedRecord, 'reportDate', null),
          metadata: get(selectedRecord, 'metadata', ''),
          media_id: get(selectedRecord, 'media.id', ''),
        },
      }));
    }
  }

  handleAddMetadataRow = () => {
    let metadata = Object.assign([], this.state.formData.metadata);
    metadata.push({
      name: '',
      unit: '',
      result: '',
    });

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        metadata,
      },
    }));
  };

  handleUpdateMetadataValue = (fieldName, fieldValue, fieldIndex) => {
    let metadata = Object.assign([], this.state.formData.metadata);
    metadata[fieldIndex][fieldName] = fieldValue;

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        metadata,
      },
    }));
  };

  handleRemoveMetadataRow = (removeIndex) => {
    let metadata = Object.assign([], this.state.formData.metadata);

    metadata = metadata.filter((item, index) => {
      return index !== removeIndex;
    });

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        metadata,
      },
    }));
  };

  handleFieldUpdate = (fieldName, fieldValue) => {
    let value = '';
    if (fieldName === 'report_date') {
      if (fieldValue !== null) {
        value = moment(fieldValue._d).format('YYYY-MM-DD 00:00:00');
      } else {
        value = moment().format('YYYY-MM-DD 00:00:00');
      }
    } else {
      value = fieldValue;
    }

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        [`${fieldName}`]: value,
      },
    }));
  };

  formValidation = () => {
    const { name, tag, report_date, metadata, media_id } = this.state.formData;

    if (!name || !tag || !report_date) {
      this.props.openNotification('Error', 'All fields are required.', 0);
      return false;
    }

    if (metadata && metadata.length) {
      for (let data of metadata) {
        if (!data.name || !data.unit || !data.result) {
          this.props.openNotification(
            'Error',
            'Report Data fields cannot be empty.',
            0
          );
          return false;
        }
      }
    }

    if (!media_id) {
      this.props.openNotification('Error', 'Uploading Record is required.', 0);
      return false;
    }

    return true;
  };

  handleEditRecord = () => {
    const valid = this.formValidation();

    if (valid) {
      this.props.startLoader();

      const dataPayload = {
        ...this.state.formData,
        user_id: this.props.currentElderIdentifier,
      };

      ElderMedicalRecordManager.editMedicalRecord(dataPayload)
        .then((responseData) => {
          this.props.stopLoader();

          this.props.medicalRecordsAction(responseData.data);
          this.props.selectedMedicalRecordAction();
          this.props.openNotification(
            'Success!',
            'Record Updated successfully.',
            1
          );

          this.props.editMedicalRecordAction();
        })
        .catch((errorData) => {
          console.log('UNABLE TO EDIT', errorData);

          this.props.stopLoader();

          this.props.openNotification(
            'Error!',
            errorData.response.data.message,
            0
          );
        });
    }
  };

  handleMediaUpload = (media_id, name) => {
    this.setState((state) => ({
      ...state,
      mediaName: name,
      formData: {
        ...state.formData,
        media_id,
      },
    }));
  };

  handleLoader = (status) => {
    status ? this.props.startLoader() : this.props.stopLoader();
  };

  render() {
    const { formData, mediaName } = this.state;

    return (
      <div className='elder-record-edit' style={styles}>
        <h5>Edit Record</h5>

        <div className='elder-record-content'>
          <Form.Group controlId='Name'>
            <Form.Label>Name</Form.Label>{' '}
            <Form.Control
              name='Name'
              placeholder='Name'
              value={get(formData, 'name')}
              onChange={(event) =>
                this.handleFieldUpdate('name', event.target.value)
              }
            />
          </Form.Group>

          <Form.Group controlId='Tag'>
            <Form.Label>Tag</Form.Label>
            <Form.Control
              name='Tag'
              placeholder='tag'
              value={get(formData, 'tag')}
              onChange={(event) =>
                this.handleFieldUpdate('tag', event.target.value)
              }
            />
          </Form.Group>

          <Form.Group controlId='report_date'>
            <Form.Label>Date</Form.Label>
            <DatePicker
              value={formData.report_date ? moment(formData.report_date) : null}
              onChange={(e) => this.handleFieldUpdate('report_date', e)}
              disabledDate={(d) => d.isAfter(moment())}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Report Data</Form.Label>

            {formData.metadata &&
              formData.metadata.length !== 0 &&
              formData.metadata.map((item, index) => {
                return (
                  <div
                    className='multiparty-inputs-row d-flex align-items-end justify-content-start'
                    key={index}
                  >
                    <Form.Group>
                      <Form.Label>Name</Form.Label>

                      <Form.Control
                        type='text'
                        placeholder='Name'
                        value={item.name}
                        onChange={(event) =>
                          this.handleUpdateMetadataValue(
                            'name',
                            event.target.value,
                            index
                          )
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Unit</Form.Label>

                      <Form.Control
                        type='text'
                        placeholder='Unit'
                        value={item.unit}
                        onChange={(event) =>
                          this.handleUpdateMetadataValue(
                            'unit',
                            event.target.value,
                            index
                          )
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Result</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Result'
                        value={item.result}
                        onChange={(event) =>
                          this.handleUpdateMetadataValue(
                            'result',
                            event.target.value,
                            index
                          )
                        }
                      />
                    </Form.Group>

                    <Button
                      type='button'
                      className='btn btn-link'
                      onClick={() => this.handleRemoveMetadataRow(index)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </div>
                );
              })}

            <button
              type='button'
              className='btn btn-link'
              onClick={() => this.handleAddMetadataRow()}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Another
            </button>
          </Form.Group>

          {mediaName && (
            <div className='existing-attachments'>
              <div className='existing-attachments-item d-flex align-items-center justify-content-between'>
                <p className='existing-attachments-text'>{mediaName}</p>
              </div>
            </div>
          )}

          <S3FileUploader
            file_type={'ehr'}
            obj_type={'ehr'}
            loader={this.handleLoader}
            uploadS3API={UPLOAD_S3_URL}
            allowedStrings={'jpeg,png,jpg,pdf'}
            uploadSuccessCallback={this.handleMediaUpload}
          />

          <button
            type='button'
            className='btn btn-primary'
            onClick={() => this.handleEditRecord()}
          >
            Update Record
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  elderRecords: state.elder.records,
});

const mapDispatchToProps = {
  medicalRecordsAction,
  selectedMedicalRecordAction,
  editMedicalRecordAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditMedicalRecord);

import React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  editMedicalRecordAction,
  addMedicalRecordAction,
} from '../../actions/ElderActions.js';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'antd';

import styles from './active-medical-record.scss';

const { confirm } = Modal;

class ActiveMedicalRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  editRecordHandler = () => {
    this.props.editMedicalRecordAction();

    if (this.props.elderRecords.addRecord) {
      this.props.addMedicalRecordAction();
    }
  };

  confirmDeleteRecord = () => {
    confirm({
      title: 'Are you sure you wish to remove this record?',
      okType: 'danger',
      okText: 'Yes, Continue',
      cancelText: 'No, Abort',
      centered: true,
      onOk: () => {
        this.props.handleRemoveRecord();
      },
      onCancel() {
        return;
      },
    });
  };

  render() {
    const { selectedRecord, editRecord } = this.props.elderRecords;

    return (
      <div className='elder-record-preview' style={styles}>
        <div className='preview-title'>
          <h5>Report Details</h5>
        </div>

        <div className='preview-content d-flex align-items-start justify-content-start'>
          <div className='preview-document'>
            {get(selectedRecord, 'media.mime_type') === 'application/pdf' ? (
              <FontAwesomeIcon icon={faFilePdf} />
            ) : (
              <img
                src={get(selectedRecord, 'media.url')}
                alt='Preview Thumbnail'
              />
            )}
          </div>

          <div className='preview-information'>
            <div className='preview-pod d-flex align-items-start justify-content-start'>
              <span className='preview-param'>Report Name:</span>
              <span className='preview-value'>
                {get(selectedRecord, 'name', 'N/A')}
              </span>
            </div>

            <div className='preview-pod d-flex align-items-start justify-content-start'>
              <span className='preview-param'>Report Date:</span>
              <span className='preview-value'>
                {get(selectedRecord, 'report_date', 'N/A')}
              </span>
            </div>

            <div className='preview-pod d-flex align-items-start justify-content-start'>
              <span className='preview-param'>Report Tag:</span>
              <span className='preview-value'>
                {get(selectedRecord, 'tag', 'N/A')}
              </span>
            </div>

            <div className='preview-information-actions'>
              <a
                target='_blank'
                className='btn btn-primary'
                href={get(selectedRecord, 'media.url', '#')}
              >
                Download
              </a>

              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => this.editRecordHandler()}
              >
                {editRecord ? 'Cancel' : 'Edit'}
              </button>

              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => this.confirmDeleteRecord()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  elderRecords: state.elder.records,
});

const mapDispatchToProps = {
  editMedicalRecordAction,
  addMedicalRecordAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveMedicalRecord);

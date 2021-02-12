import React, { Component } from 'react';

import { get } from 'lodash';
import { Empty } from 'antd';
import { connect } from 'react-redux';
import {
  selectedMedicalRecordAction,
  editMedicalRecordAction,
  medicalRecordsAction,
  addMedicalRecordAction,
} from '../../actions/ElderActions';

import ElderDocument from '../ElderDocument';
import ActiveMedicalRecord from '../ActiveMedicalRecord';
import EditMedicalRecord from '../EditMedicalRecord';

import MedicalRecordDataManager from './dataManager';

import styles from './medical-records.scss';

class MedicalRecords extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.directoryData = null;

    this.medicalRecordDataManager = new MedicalRecordDataManager();
  }

  getDirectoryData = () => {
    const { selectedDirectory, elderRecords } = this.props;

    if (
      selectedDirectory &&
      elderRecords &&
      elderRecords.medicalRecords &&
      elderRecords.medicalRecords.length
    ) {
      for (let directory of elderRecords.medicalRecords) {
        if (directory.id === selectedDirectory) {
          return directory;
        }
      }
    }
  };

  selectedRecordHandler = (selectedRecord) => {
    this.props.selectedMedicalRecordAction(selectedRecord);
    if (this.props.elderRecords.addRecord) {
      this.props.addMedicalRecordAction();
    }
  };

  handleRemoveRecord = () => {
    const { selectedRecord } = this.props.elderRecords;

    if (selectedRecord && selectedRecord.id) {
      this.props.startLoader();

      const dataPayload = {
        recordID: selectedRecord.id,
        user_id: this.props.currentElderIdentifier,
      };

      this.medicalRecordDataManager
        .deleteRecord(dataPayload)
        .then((responseData) => {
          this.props.stopLoader();
          this.props.openNotification(
            'Success',
            'Record Deleted Successfully.',
            1
          );
          this.props.selectedMedicalRecordAction();
          this.props.medicalRecordsAction(responseData.data);
        })
        .catch((errorData) => {
          this.props.stopLoader();
          const errorMessage = get(errorData, 'response.data.message', null);

          this.props.openNotification(
            'Error!',
            errorMessage || 'Something went wrong. Please try again later',
            0
          );
        });
    }
  };

  render() {
    const { elderRecords } = this.props;

    this.directoryData = this.getDirectoryData();

    const medical_records = get(this.directoryData, 'medical_records', []);

    return (
      <React.Fragment style={styles}>
        {this.directoryData &&
        medical_records &&
        medical_records.length !== 0 ? (
          medical_records.map((record, index) => {
            return (
              <ElderDocument
                key={index}
                documentName={record.name}
                className='records-wrapper-item'
                selectedOnClick={() => this.selectedRecordHandler(record)}
              />
            );
          })
        ) : (
          <Empty />
        )}

        {elderRecords && elderRecords.selectedRecord && (
          <ActiveMedicalRecord handleRemoveRecord={this.handleRemoveRecord} />
        )}

        {elderRecords && elderRecords.editRecord && (
          <EditMedicalRecord {...this.props} />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  elderRecords: state.elder.records,
});

const mapDispatchToProps = {
  selectedMedicalRecordAction,
  editMedicalRecordAction,
  medicalRecordsAction,
  addMedicalRecordAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalRecords);

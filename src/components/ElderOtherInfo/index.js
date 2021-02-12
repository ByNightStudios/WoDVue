import React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { DatePicker, Checkbox, Radio, Input } from 'antd';
import ElderOtherInfoManager, {
  selectionOptions,
  stateLableMapping,
} from './dataManager';

import { checkForMedicalTab } from '../../utils/checkElderEditPermission';

import styles from './elder-other-info.scss';

class ElderOtherInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'other_info',
      formData: {
        routineDoctorCheckup: '',
        needAssitanceWithDocter: '',
        otherRoutineAppointments: '',
        elderNeedsAssitance: ''
      },
    };

    this.ElderOtherInfoManager = new ElderOtherInfoManager();
    this.stateLableMapping = stateLableMapping;
  }

  componentDidMount() {
    if (this.props.formData !== null) {
      this.setState({
        formData: this.props.formData,
      });
    }
  }

  setStateValues = (e, item) => {
    let formData = Object.assign({}, this.state.formData);
    let value = '';

    value = e.target.value;

    formData[item] = value;

    this.setState((state) => ({
      ...state,
      formData: formData,
    }));

    let clearFields = this.ElderOtherInfoManager.clearDependentFieldValues(item, value);

    if (clearFields.length > 0) {
      clearFields.map((field) => {
        formData[field] = ''
        this.setState((state) => ({
          ...state,
          formData: formData
        }))
      })
    }
  };

  submitData = () => {
    const { formData, type } = this.state;

    console.log('FormData: ', formData);

    const { validated, label } = this.ElderOtherInfoManager.validate(formData);

    if (!validated) {
      const value = this.stateLableMapping[label];
      this.props.openNotification('Error!', `Please fill the ${value}`, 0);
    } else {
      this.props.startLoader();
      const finalPayload = {
        column: type,
        elder_id: this.props.currentElderIdentifier,
        data: formData,
      };
      this.ElderOtherInfoManager.updateElderOtherData(finalPayload)
        .then((response) => {
          this.props.stopLoader();
          this.props.openNotification(
            'Success!',
            `Form Fields Updated Successfully`,
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
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.formData, this.props.formData)) {
      this.setState({
        formData: this.props.formData,
      });
    }
  }

  render() {
    const { formData } = this.state;

    return (
      <div className='elder-otherinfo' style={styles}>
        {/* <h4>Elder Other's Information</h4>

        {/* <Form.Group controlId='healthInsurance'>
          <Form.Label>Insurance Name</Form.Label>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Insurance Name'
                value={_.get(formData, 'healthInsuranceName', '')}
                onChange={(e) => this.setStateValues(e, 'healthInsuranceName')}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='healthInsuranceNumber'>
          <Form.Label>Insurance number</Form.Label>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Health Insurance Number'
                value={_.get(formData, 'healthInsuranceNumber', '')}
                onChange={(e) =>
                  this.setStateValues(e, 'healthInsuranceNumber')
                }
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='religion'>
          <Form.Label>Religious Preferences</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'religionOptions', [])}
              value={_.get(formData, 'selectedReligion', [])}
              onChange={(e) => this.setStateValues(e, 'selectedReligion')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            />
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Other religion'
                disabled={!selectedReligion.includes('Other')}
                value={
                  !selectedReligion.includes('Other')
                    ? ''
                    : formData.otherReligion
                }
                onChange={(e) => this.setStateValues(e, 'otherReligion')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='doctorSpeciality'>
          <Form.Label>Docter Speciality </Form.Label>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Docter Speciality'
                value={_.get(formData, 'doctorSpeciality', '')}
                onChange={(e) => this.setStateValues(e, 'doctorSpeciality')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='docterName'>
          <Form.Label>Docter name</Form.Label>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Docter name'
                value={_.get(formData, 'docterName', '')}
                onChange={(e) => this.setStateValues(e, 'docterName')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='docterAddress'>
          <Form.Label>Docter Address</Form.Label>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Docter Address'
                value={_.get(formData, 'docterAddress', '')}
                onChange={(e) => this.setStateValues(e, 'docterAddress')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='docterPhoneNumber'>
          <Form.Label>Doctor Phone number</Form.Label>
          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Doctor Phone number'
                value={_.get(formData, 'docterPhoneNumber', '')}
                onChange={(e) => this.setStateValues(e, 'docterPhoneNumber')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>
        <Form.Group controlId='otherName'>
          <Form.Label>Other Name</Form.Label>
          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Other Name'
                value={_.get(formData, 'otherName', '')}
                onChange={(e) => this.setStateValues(e, 'otherName')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>
        <Form.Group controlId='otherAddress'>
          <Form.Label>Other Address</Form.Label>
          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Other Address'
                value={_.get(formData, 'otherAddress', '')}
                onChange={(e) => this.setStateValues(e, 'otherAddress')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>
        <Form.Group controlId='otherPhoneNumber'>
          <Form.Label>Other Phone number</Form.Label>
          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Other Phone number'
                value={_.get(formData, 'otherPhoneNumber', '')}
                onChange={(e) => this.setStateValues(e, 'otherPhoneNumber')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group> */}
        <Form.Group controlId='routineDoctorCheckup'>
          <Form.Label>Routine Doctor Checkup</Form.Label>
          <div className='form-multicheck'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'routineDoctorCheckup')}
              value={_.get(formData, 'routineDoctorCheckup', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>
        </Form.Group>

        <Form.Group controlId='needAssitanceWithDocter'>
          <Form.Label>
            Need Assitance with Doctor Checkup. If yes, Please Specify
          </Form.Label>
          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) =>
                this.setStateValues(e, 'needAssitanceWithDocter')
              }
              value={_.get(formData, 'needAssitanceWithDocter', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.needAssitanceWithDocter === 'yes' ? (
                <Form.Group style={{ marginBottom: 0 }}>
                  <Form.Label>Assistance Needed</Form.Label>
                  <Form.Control
                    value={_.get(formData, 'doctorAssitance', '')}
                    onChange={(e) => this.setStateValues(e, 'doctorAssitance')}
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='otherRoutineAppointments'>
          <Form.Label>
            Other Routine Appointments. If yes, Please Specify
          </Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) =>
                this.setStateValues(e, 'otherRoutineAppointments')
              }
              value={_.get(formData, 'otherRoutineAppointments', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.otherRoutineAppointments === 'yes' ? (
                <Form.Group style={{ marginBottom: 0 }}>
                  <Form.Label>Other Appointments</Form.Label>
                  <Form.Control
                    value={_.get(formData, 'otherRoutineAppointmentName', '')}
                    onChange={(e) =>
                      this.setStateValues(e, 'otherRoutineAppointmentName')
                    }
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='elderNeedsAssitance'>
          <Form.Label>
            Does elder need assistance with this?. If yes, Please Specify
          </Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'elderNeedsAssitance')}
              value={_.get(formData, 'elderNeedsAssitance', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.elderNeedsAssitance === 'yes' ? (
                <Form.Group style={{ marginBottom: 0 }}>
                  <Form.Label>Assistance Needed</Form.Label>
                  <Form.Control
                    value={_.get(formData, 'eldersAssitances', '')}
                    onChange={(e) => this.setStateValues(e, 'eldersAssitances')}
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
              ) : null}
            </div>
          </div>
        </Form.Group>

        {/* <Form.Group controlId='completionDateAndTime'>
          <Form.Label>Date and Time of Completion</Form.Label>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                showToday={false}
                format={'YYYY-MM-DD HH:mm'}
                value={
                  formData && formData.dateCompleted
                    ? moment(formData.dateCompleted, 'YYYY-MM-DD HH:mm A')
                    : null
                }
                onChange={(e) => this.setStateValues(e, 'dateCompleted')}
                disabledDate={(value) => value.isAfter(moment())}
              />
            </div>
          </div>
        </Form.Group> */}

        <Button
          type='button'
          className='btn btn-primary'
          onClick={(event) => this.submitData()}
          disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
        >
          Save
        </Button>
      </div>
    );
  }

  componentWillUnmount() { }
}

export default ElderOtherInfo;

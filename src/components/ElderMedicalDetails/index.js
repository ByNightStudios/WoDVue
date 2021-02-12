import React from 'react';
import moment from 'moment';
import * as _ from 'lodash';

import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import {
  Checkbox,
  Radio,
  Input,
  notification,
  DatePicker
} from 'antd';
import uuid from 'uuid';
import ElderMedicalDetailsManager, {
  selectionOptions,
  stateLabelMapping,
} from './dataManager';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkForMedicalTab } from '../../utils/checkElderEditPermission';
import styles from './elder-medical-details.scss';

class ElderMedicalDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'medical_conditions',
      formData: {
        selectedMedicalConditions: [],
        otherMedicalConditions: '',
        selectedDifferentlyAbledOptions: [],
        isSmoking: '',
        smokingSince: '',
        smokingFrequency: '',
        isAlchol: '',
        alcholSince: '',
        alcholFrequency: '',
        isNarcotics: '',
        narcoticsSince: '',
        narcoticsFrequency: '',
        isTobacco: '',
        tobaccoSince: '',
        tobaccoFrequency: '',
        surgicalHistory: '',
        recentHospitalization: '',
        hospitalizationReason: '',
        hospitalizationDischargeDate: '',
        isFoodAllergy: '',
        foodAllergy: '',
        isDrugAllergy: '',
        drugAllergy: '',
        isOtherAllergy: '',
        otherAllergy: '',
        historyOfFall: '',
        numberOfFallsinLastYear: '',
        fallsResultedInInjury: '',
        riskForFall: '',
        selectedFamilyHistoryOptions: [],
        selectedmobilityConditionsOptions: [],
        otherMobilityCondition: '',
        selectedNutritionOptions: [],
        selectedEliminationOptions: [],
        otherEliminationOption: '',
        selectedwoundCareOptions: [],
        otherWoundCare: '',
        pressureUlcer: '',
        pressureUlcerSize: '',
        pressureUlcerLocation: '',
        pressureUlcerStage: '',
        pressureUlcerRisk: '',
        selectedShcCaseOptions: [],
        otherShcOptions: '',
        selectedVisualAidOptions: [],
        selectedMobilityAidOptions: [],
        otherMobilityAid: '',
        diet: '',
        onSpecialDiet: '',
        otherSpecialDiet: '',
        selectedSpecialDietOptions: [],
        sittingUp: 'Independent',
        sittingUpAssistance: '',
        eating: 'Independent',
        eatingAssistance: '',
        drinking: 'Independent',
        drinkingAssistance: '',
        toileting: 'Independent',
        toiletingAssistance: '',
        transferring: 'Independent',
        transferringAssistance: '',
        walking: 'Independent',
        walkingAssistance: '',
        medication: [{
          name: '',
          route: '',
          action: '',
          dose: '',
          startDate: '',
          endDate: '',
          frequency: '',
        }],
        doctorsData: [{
          randomId: uuid.v4(),
          name: '',
          speciality: '',
          contactNumber: '',
          city: '',
          address: ''
        }]
      },
    };

    this.elderMedicalDetailsManager = new ElderMedicalDetailsManager();
    this.stateLabelMapping = stateLabelMapping;
  }

  componentDidMount() {
    if (this.props.formData !== null) {
      this.setState({
        formData: this.props.formData,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.formData, this.props.formData)) {
      this.setState({
        formData: {
          ...this.props.formData,
          doctorsData: _.get(this.props.formData, 'doctorsData') && this.props.formData.doctorsData.length !== 0 ? this.props.formData.doctorsData : this.state.formData.doctorsData
        }
      });
    }
  }

  openNotification = (message, description, status) => {
    const style = { color: status ? 'green' : 'red' };
    const args = {
      message,
      description,
      duration: 0,
      style,
    };

    notification.open(args);
  };

  submitData = () => {
    const { formData, type } = this.state;
    const { validated, label } = this.elderMedicalDetailsManager.validate(
      formData
    );
    let value = '';
    if (label.length > 0) {
      label.map((item, index) => {
        label[index] = this.stateLabelMapping[item]
      })
      value = label.join(", ")
      value = "Please fill the " + value
    }
    if (!validated) {
      this.props.openNotification('Error!', value, 0);
    } else {
      this.props.startLoader();
      const finalPayload = {
        column: type,
        elder_id: this.props.currentElderIdentifier,
        data: formData,
      };

      this.elderMedicalDetailsManager
        .updateMedicalDetails(finalPayload)
        .then(() => {
          this.props.stopLoader();
          this.openNotification(
            'Success!',
            `Form Fields Updated Successfully`,
            1
          );
        })
        .catch((errorData) => {
          this.props.stopLoader();
          this.openNotification('Error!', errorData.response.data.message, 0);
        });
    }
  };

  setMedicationValues = (e, index, key) => {
    const formData = Object.assign({}, this.state.formData);
    const { medication } = formData;
    let value = '';
    switch (key) {
      case 'startDate':
      case 'endDate':
        if (e !== null) {
          value = moment(e._d).format('YYYY-MM-DD 00:00:00');
        }
        break;
      default:
        value = e.target.value;
    }
    medication[index][key] = value;
    this.setState((state) => ({
      ...state,
      ...formData,
      medication: medication,
    }));
  };

  handleAddMedicationRow = (e) => {
    const formData = Object.assign({}, this.state.formData);
    const { medication } = formData;
    medication.push({
      name: '',
      route: '',
      action: '',
      dose: '',
      startDate: '',
      endDate: '',
      frequency: '',
    });
    this.setState((state) => ({
      ...state,
      ...formData,
      medication: medication,
    }));
  };

  handleRemoveMedicationRow = (e, index) => {
    const medication = Object.assign([], this.state.formData.medication);
    const newMedication = medication.filter((item, medicationIndex) => {
      return medicationIndex !== index;
    });
    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        medication: newMedication,
      },
    }));
  };

  setDoctorValues = (e, index, key) => {
    const formData = Object.assign({}, this.state.formData);
    const { doctorsData } = formData;

    doctorsData[index][key] = e.target.value;

    this.setState((state) => ({
      ...state,
      ...formData,
      doctorsData
    }));
  };

  /* Doctors Events Start */

  handleAddDoctorRow = () => {
    const formData = Object.assign({}, this.state.formData);
    const { doctorsData } = formData;
    doctorsData.push({
      randomId: uuid.v4(),
      name: '',
      speciality: '',
      contactNumber: '',
      city: '',
      address: ''
    });

    this.setState(prevState => ({
      ...prevState,
      ...formData,
      doctorsData
    }));
  };

  handleRemoveDoctorRow = id => {
    const doctorsData = Object.assign([], this.state.formData.doctorsData);
    const updatedDoctors = doctorsData.filter(doctorRow => doctorRow.randomId !== id);

    this.setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        doctorsData: updatedDoctors,
      },
    }));
  };

  /* Doctors Events End */

  setStateValues = (e, item) => {
    let formData = Object.assign({}, this.state.formData);
    let value = '';
    switch (item) {
      case 'bloodGroup':
      case 'selectedMedicalConditions':
      case 'selectedDifferentlyAbledOptions':
      case 'selectedFamilyHistoryOptions':
      case 'selectedmobilityConditionsOptions':
      case 'selectedNutritionOptions':
      case 'selectedEliminationOptions':
      case 'selectedwoundCareOptions':
      case 'selectedShcCaseOptions':
      case 'selectedVisualAidOptions':
      case 'selectedMobilityAidOptions':
      case 'selectedSpecialDietOptions':
        value = e;
        break;
      default:
        value = e.target.value;
    }
    formData[item] = value;
    this.setState((state) => ({
      ...state,
      formData: formData,
    }));
    /* clear dependent fields logic */
    let clearFields = this.elderMedicalDetailsManager.clearDependentFieldValues(item, value)
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

  doctorsDetailsComponent = () => {
    const {
      formData: {
        doctorsData
      }
    } = this.state;

    return (
      <>
        {doctorsData && doctorsData.length !== 0 && Object.keys(doctorsData).map((doctor, index) => {
          return (
            <div
              className='replication-pod d-flex align-items-end justify-content-start'
              key={index}
            >
              <div className='replication-pod-item'>
                <Form.Group controlId={`name ${doctor} ${index}`}>
                  <Form.Label>Doctor Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Doctor Name'
                    value={_.get(doctorsData[index], 'name', '')}
                    onChange={e =>
                      this.setDoctorValues(e, index, 'name')
                    }
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
              </div>

              <div className='replication-pod-item'>
                <Form.Label>Speciality</Form.Label>
                <Form.Control
                  as='select'
                  value={_.get(doctorsData[index], 'speciality', '')}
                  onChange={(e) =>
                    this.setDoctorValues(e, index, 'speciality')
                  }
                  disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                >
                  <option value=''>Choose One</option>
                  <option value='allergy_and_immunology'>Allergy and Immunology</option>
                  <option value='anesthesiology'>Anesthesiology</option>
                  <option value='dermatology'>Dermatology</option>
                  <option value='diagnostic_radiology'>Diagnostic Radiology</option>
                  <option value='emergency_medicine'>Emergency Medicine</option>
                  <option value='family_medicine_geriatrics'>Family Medicine Geriatrics</option>
                  <option value='internal_medicine'>Internal Medicine</option>
                  <option value='medical_genetics'>Medical Genetics</option>
                  <option value='neurology'>Neurology</option>
                  <option value='nuclear_medicine'>Nuclear Medicine</option>
                  <option value='obstetrics_and_gynecology'>Obstetrics and Gynecology</option>
                  <option value='ophthalmology'>Ophthalmology</option>
                  <option value='pathology'>Pathology</option>
                  <option value='pediatrics'>Pediatrics</option>
                  <option value='physical_medicine_and_rehabilitation'>Physical Medicine and Rehabilitation</option>
                  <option value='preventive_medicine'>Preventive Medicine</option>
                  <option value='psychiatry'>Psychiatry</option>
                  <option value='radiation_oncology'>Radiation Oncology</option>
                  <option value='surgery'>Surgery</option>
                  <option value='urology'>Urology</option>
                </Form.Control>
              </div>

              <div className='replication-pod-item'>
                <Form.Group controlId={`contact ${doctor} ${index}`}>
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type='text'
                    maxLength={10}
                    placeholder='Contact Number'
                    value={_.get(doctorsData[index], 'contactNumber', '')}
                    onChange={(e) => {
                      const convertedValue = _.toNumber(e.target.value);

                      if (!_.isNaN(convertedValue)) {
                        this.setDoctorValues(e, index, 'contactNumber');
                      }
                    }}
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
              </div>

              <div className='replication-pod-item'>
                <Form.Group controlId={`city ${doctor} ${index}`}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='City'
                    value={_.get(doctorsData[index], 'city', '')}
                    onChange={(e) =>
                      this.setDoctorValues(e, index, 'city')
                    }
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
              </div>

              <div className='replication-pod-item'>
                <Form.Group controlId={`address ${doctor} ${index}`}>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Address'
                    value={_.get(doctorsData[index], 'address', '')}
                    onChange={(e) =>
                      this.setDoctorValues(e, index, 'address')
                    }
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
              </div>

              <button
                type='button'
                className='btn btn-link'
                disabled={doctorsData.length <= 1 || checkForMedicalTab(this.props.user, this.props.elderData)}
                onClick={() => this.handleRemoveDoctorRow(doctorsData[index].randomId)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          );
        })}
        <button
          type='button'
          className='btn btn-link'
          onClick={this.handleAddDoctorRow}
          disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Another
        </button>
      </>
    )
  }

  render() {
    const {
      formData,
      formData: {
        selectedMedicalConditions,
        selectedmobilityConditionsOptions,
        selectedEliminationOptions,
        selectedwoundCareOptions,
        selectedShcCaseOptions,
        selectedMobilityAidOptions,
        selectedSpecialDietOptions,
        medication,
        doctorsData
      }
    } = this.state;

    return (
      <div className='elder-medical' style={styles}>
        <h4>Elder Health Profile</h4>
        <Form.Group controlId='elderMedicalConditions'>
          <Form.Label>Elder Medical Conditions</Form.Label>
          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(
                selectionOptions,
                'elderMedicalConditionsOptions',
                []
              )}
              value={_.get(formData, 'selectedMedicalConditions', [])}
              onChange={(e) =>
                this.setStateValues(e, 'selectedMedicalConditions')
              }
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            />
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                required
                type='text'
                placeholder='Other'
                disabled={!selectedMedicalConditions.includes('Other')}
                value={_.get(formData, 'otherMedicalConditions', '')}
                onChange={(e) =>
                  this.setStateValues(e, 'otherMedicalConditions')
                }
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='differentlyAbled'>
          <Form.Label>Differently Abled</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'differentlyAbledOptions', [])}
              value={_.get(formData, 'selectedDifferentlyAbledOptions', [])}
              onChange={(e) =>
                this.setStateValues(e, 'selectedDifferentlyAbledOptions')
              }
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            />
          </div>
        </Form.Group>

        <Form.Group controlId='SmokingAddiction'>
          <Form.Label>Smoking</Form.Label>

          <div className='form-multicheck form-multicheck-spaced form-multicheck-spaced--margined'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'isSmoking')}
              value={_.get(formData, 'isSmoking', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {' '}
              {formData.isSmoking === 'yes' ? (
                <React.Fragment>
                  <Form.Group>
                    <Form.Label>Smoking Since</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'smokingSince', '')}
                      onChange={(e) => this.setStateValues(e, 'smokingSince')}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Smoking Frequency</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'smokingFrequency', '')}
                      onChange={(e) =>
                        this.setStateValues(e, 'smokingFrequency')
                      }
                    />
                  </Form.Group>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='alcholAddiction'>
          <Form.Label>Alcohol</Form.Label>

          <div className='form-multicheck form-multicheck-spaced form-multicheck-spaced--margined'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'isAlchol')}
              value={_.get(formData, 'isAlchol', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>
          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.isAlchol === 'yes' ? (
                <React.Fragment>
                  <Form.Group>
                    <Form.Label>Alcohol Since</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'alcholSince', '')}
                      onChange={(e) => this.setStateValues(e, 'alcholSince')}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Alcohol Frequency</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'alcholFrequency', '')}
                      onChange={(e) =>
                        this.setStateValues(e, 'alcholFrequency')
                      }
                    />
                  </Form.Group>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='narcoticsAddiction'>
          <Form.Label>Narcotics</Form.Label>

          <div className='form-multicheck form-multicheck-spaced form-multicheck-spaced--margined'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'isNarcotics')}
              value={_.get(formData, 'isNarcotics', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.isNarcotics === 'yes' ? (
                <React.Fragment>
                  <Form.Group>
                    <Form.Label>Narcotics Since</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'narcoticsSince', '')}
                      onChange={(e) => this.setStateValues(e, 'narcoticsSince')}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Narcotics Frequency</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'narcoticsFrequency', '')}
                      onChange={(e) =>
                        this.setStateValues(e, 'narcoticsFrequency')
                      }
                    />
                  </Form.Group>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='tobaccoAddiction'>
          <Form.Label>Tobacco</Form.Label>

          <div className='form-multicheck form-multicheck-spaced form-multicheck-spaced--margined'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'isTobacco')}
              value={_.get(formData, 'isTobacco', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.isTobacco === 'yes' ? (
                <React.Fragment>
                  <Form.Group>
                    <Form.Label>Tobacco Since</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'tobaccoSince', '')}
                      onChange={(e) => this.setStateValues(e, 'tobaccoSince')}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Tobacco Frequency</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'tobaccoFrequency', '')}
                      onChange={(e) =>
                        this.setStateValues(e, 'tobaccoFrequency')
                      }
                    />
                  </Form.Group>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='surgicalHistory'>
          <Form.Label>Surgical History</Form.Label>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Surgical History'
                value={_.get(formData, 'surgicalHistory', '')}
                onChange={(e) => this.setStateValues(e, 'surgicalHistory')}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='hospitalization'>
          <Form.Label>Recent Hospitalization</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'recentHospitalization')}
              value={_.get(formData, 'recentHospitalization', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.recentHospitalization === 'yes' ? (
                <React.Fragment>
                  <Form.Group>
                    <Form.Label>Reason</Form.Label>
                    <Input
                      value={_.get(formData, 'hospitalizationReason', '')}
                      onChange={(e) =>
                        this.setStateValues(e, 'hospitalizationReason')
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Date of Discharge</Form.Label>
                    <Input
                      value={_.get(
                        formData,
                        'hospitalizationDischargeDate',
                        ''
                      )}
                      onChange={(e) =>
                        this.setStateValues(e, 'hospitalizationDischargeDate')
                      }
                    />
                  </Form.Group>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='foodAllergy'>
          <Form.Label>Food Allergy</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'isFoodAllergy')}
              value={_.get(formData, 'isFoodAllergy', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.isFoodAllergy === 'yes' ? (
                <Form.Group>
                  <Form.Label>Allergic To</Form.Label>
                  <Form.Control
                    value={_.get(formData, 'foodAllergy', '')}
                    onChange={(e) => this.setStateValues(e, 'foodAllergy')}
                  />
                </Form.Group>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='drugAllergy'>
          <Form.Label>Drug Allergy</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'isDrugAllergy')}
              value={_.get(formData, 'isDrugAllergy', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.isDrugAllergy === 'yes' ? (
                <Form.Group>
                  <Form.Label>Allergic To</Form.Label>
                  <Form.Control
                    value={_.get(formData, 'drugAllergy', '')}
                    onChange={(e) => this.setStateValues(e, 'drugAllergy')}
                  />
                </Form.Group>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='otherAllergy'>
          <Form.Label>Other Allergy</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'isOtherAllergy')}
              value={_.get(formData, 'isOtherAllergy', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.isOtherAllergy === 'yes' ? (
                <Form.Group>
                  <Form.Label>Allergic To</Form.Label>
                  <Form.Control
                    value={_.get(formData, 'otherAllergy', '')}
                    onChange={(e) => this.setStateValues(e, 'otherAllergy')}
                  />
                </Form.Group>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='fallHistory'>
          <Form.Label>Does The Elder Have A History Of Falls?</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'historyOfFall')}
              value={_.get(formData, 'historyOfFall', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.historyOfFall === 'yes' ? (
                <Form.Group>
                  <Form.Label>
                    How many fall has the elder had in last 1 year?
                  </Form.Label>
                  <Form.Control
                    value={_.get(formData, 'numberOfFallsinLastYear', '')}
                    onChange={(e) =>
                      this.setStateValues(e, 'numberOfFallsinLastYear')
                    }
                  />
                </Form.Group>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='fallsResultedInInjury'>
          <Form.Label>
            Has The Elder Had Any Falls That Resulted In Injury?
          </Form.Label>

          <div className='form-multicheck'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'fallsResultedInInjury')}
              value={_.get(formData, 'fallsResultedInInjury', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>
        </Form.Group>

        <Form.Group controlId='riskForFall'>
          <Form.Label>Risk for fall (using Morse Scale)</Form.Label>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Risk for fall '
                value={_.get(formData, 'riskForFall', '')}
                onChange={(e) => this.setStateValues(e, 'riskForFall')}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='familyHistory'>
          <Form.Label>Family History</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'familyHistoryOptions', [])}
              value={_.get(formData, 'selectedFamilyHistoryOptions', [])}
              onChange={(e) =>
                this.setStateValues(e, 'selectedFamilyHistoryOptions')
              }
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            />
          </div>
        </Form.Group>

        <Form.Group controlId='mobilityDifficulties'>
          <Form.Label>Mobility Difficulties</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'mobilityConditionsOptions', [])}
              value={_.get(formData, 'selectedmobilityConditionsOptions', [])}
              onChange={(e) =>
                this.setStateValues(e, 'selectedmobilityConditionsOptions')
              }
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            />
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Other Mobility Difficulty'
                disabled={!selectedmobilityConditionsOptions.includes('Others')}
                value={
                  !selectedmobilityConditionsOptions.includes('Others')
                    ? ''
                    : formData.otherMobilityCondition
                }
                onChange={(e) =>
                  this.setStateValues(e, 'otherMobilityCondition')
                }
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='nutrition'>
          <Form.Label>Nutrition</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'nutritionOptions', [])}
              value={_.get(formData, 'selectedNutritionOptions', [])}
              onChange={(e) =>
                this.setStateValues(e, 'selectedNutritionOptions')
              }
            />
          </div>
        </Form.Group>

        <Form.Group controlId='elimination'>
          <Form.Label>Elimination</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'eliminationOptions', [])}
              value={_.get(formData, 'selectedEliminationOptions', [])}
              onChange={(e) =>
                this.setStateValues(e, 'selectedEliminationOptions')
              }
            />
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Other Elimintation option'
                disabled={!selectedEliminationOptions.includes('Others')}
                value={
                  !selectedEliminationOptions.includes('Others')
                    ? ''
                    : formData.otherEliminationOption
                }
                onChange={(e) =>
                  this.setStateValues(e, 'otherEliminationOption')
                }
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='woundCare'>
          <Form.Label>Wound Care</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'woundCareOptions', [])}
              value={_.get(formData, 'selectedwoundCareOptions', [])}
              onChange={(e) =>
                this.setStateValues(e, 'selectedwoundCareOptions')
              }
            />
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Other Wound Care'
                disabled={!selectedwoundCareOptions.includes('Others')}
                value={
                  !selectedwoundCareOptions.includes('Others')
                    ? ''
                    : formData.otherWoundCare
                }
                onChange={(e) => this.setStateValues(e, 'otherWoundCare')}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='pressureUlcer'>
          <Form.Label>Pressure Ulcer</Form.Label>

          <div className='form-multicheck form-multicheck-spaced form-multicheck-spaced--margined'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'pressureUlcer')}
              value={_.get(formData, 'pressureUlcer', '')}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              {formData.pressureUlcer === 'yes' ? (
                <React.Fragment>
                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'pressureUlcerLocation', '')}
                      onChange={(e) =>
                        this.setStateValues(e, 'pressureUlcerLocation')
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Stage</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'pressureUlcerStage', '')}
                      onChange={(e) =>
                        this.setStateValues(e, 'pressureUlcerStage')
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Size</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'pressureUlcerSize', '')}
                      onChange={(e) =>
                        this.setStateValues(e, 'pressureUlcerSize')
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Risk:</Form.Label>
                    <Form.Control
                      value={_.get(formData, 'pressureUlcerRisk', '')}
                      onChange={(e) =>
                        this.setStateValues(e, 'pressureUlcerRisk')
                      }
                    />
                  </Form.Group>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </Form.Group>

        <h6>B11.Adaptive Devices /Equipments</h6>

        <Form.Group controlId='shcCase'>
          <Form.Label>For SHC Case</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'shcCaseOptions', [])}
              value={_.get(formData, 'selectedShcCaseOptions', [])}
              onChange={(e) => this.setStateValues(e, 'selectedShcCaseOptions')}
            />
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Other SHC Case'
                disabled={!selectedShcCaseOptions.includes('Others')}
                value={
                  !selectedShcCaseOptions.includes('Others')
                    ? ''
                    : formData.otherShcOptions
                }
                onChange={(e) => this.setStateValues(e, 'otherShcOptions')}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='visualAid'>
          <Form.Label>Visual Aid</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'visualAidOptions', [])}
              value={_.get(formData, 'selectedVisualAidOptions', [])}
              onChange={(e) =>
                this.setStateValues(e, 'selectedVisualAidOptions')
              }
            />
          </div>
        </Form.Group>

        <Form.Group controlId='mobilityAid'>
          <Form.Label>Mobility Aid</Form.Label>

          <div className='form-multicheck'>
            <Checkbox.Group
              options={_.get(selectionOptions, 'mobilityAidOptions', [])}
              value={_.get(formData, 'selectedMobilityAidOptions', [])}
              onChange={(e) =>
                this.setStateValues(e, 'selectedMobilityAidOptions')
              }
            />
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Other Mobility Aid'
                disabled={!selectedMobilityAidOptions.includes('Others')}
                value={
                  !selectedMobilityAidOptions.includes('Others')
                    ? ''
                    : formData.otherMobilityAid
                }
                onChange={(e) => this.setStateValues(e, 'otherMobilityAid')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <h6>
          How much assistance elder need with activities of daily living ADL?
        </h6>

        <Form.Group controlId='sittingUp'>
          <Form.Label>Sitting Up</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'sittingUp')}
              value={_.get(formData, 'sittingUp', '')}
            >
              <Radio value={'Independent'}>Independent</Radio>
              <Radio value={'Supervision'}>Supervision</Radio>
              <Radio value={'Total Dependent'}>Total Dependent</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Sitting Up Assistance'
                value={_.get(formData, 'sittingUpAssistance', '')}
                onChange={(e) => this.setStateValues(e, 'sittingUpAssistance')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='eating'>
          <Form.Label>Eating</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'eating')}
              value={_.get(formData, 'eating', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'Independent'}>Independent</Radio>
              <Radio value={'Supervision'}>Supervision</Radio>
              <Radio value={'Total Dependent'}>Total Dependent</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Eating Assistance'
                value={_.get(formData, 'eatingAssistance', '')}
                onChange={(e) => this.setStateValues(e, 'eatingAssistance')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='drinking'>
          <Form.Label>Drinking</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'drinking')}
              value={_.get(formData, 'drinking', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'Independent'}>Independent</Radio>
              <Radio value={'Supervision'}>Supervision</Radio>
              <Radio value={'Total Dependent'}>Total Dependent</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Drinking Assistance'
                value={_.get(formData, 'drinkingAssistance', '')}
                onChange={(e) => this.setStateValues(e, 'drinkingAssistance')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='toileting'>
          <Form.Label>Toileting</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'toileting')}
              value={_.get(formData, 'toileting', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'Independent'}>Independent</Radio>
              <Radio value={'Supervision'}>Supervision</Radio>
              <Radio value={'Total Dependent'}>Total Dependent</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Toileting Assistance'
                value={_.get(formData, 'toiletingAssistance', '')}
                onChange={(e) => this.setStateValues(e, 'toiletingAssistance')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='transferring'>
          <Form.Label>Transferring</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'transferring')}
              value={_.get(formData, 'transferring', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'Independent'}>Independent</Radio>
              <Radio value={'Supervision'}>Supervision</Radio>
              <Radio value={'Total Dependent'}>Total Dependent</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Transferring Assistance'
                value={_.get(formData, 'transferringAssistance', '')}
                onChange={(e) =>
                  this.setStateValues(e, 'transferringAssistance')
                }
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId='walking'>
          <Form.Label>Walking</Form.Label>

          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'walking')}
              value={_.get(formData, 'walking', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'Independent'}>Independent</Radio>
              <Radio value={'Supervision'}>Supervision</Radio>
              <Radio value={'Total Dependent'}>Total Dependent</Radio>
            </Radio.Group>
          </div>

          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Control
                type='text'
                placeholder='Walking Assistance'
                value={_.get(formData, 'walkingAssistance', '')}
                onChange={(e) => this.setStateValues(e, 'walkingAssistance')}
                disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
              />
            </div>
          </div>
        </Form.Group>

        <h6>Medication</h6>

        <div className='elder-medical-replicable'>
          {Object.keys(medication).map((singleMedication, index) => {
            return (
              <div
                className='replication-pod d-flex align-items-end justify-content-start'
                key={index}
              >
                <div className='replication-pod-item'>
                  <Form.Group controlId={`name ${singleMedication} ${index}`}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Medication Name'
                      value={_.get(medication[index], 'name', '')}
                      onChange={(e) =>
                        this.setMedicationValues(e, index, 'name')
                      }
                      disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                    />
                  </Form.Group>
                </div>
                <div className='replication-pod-item'>
                  <Form.Label>Route</Form.Label>
                  <Form.Control
                    as='select'
                    value={_.get(medication[index], 'route', '')}
                    onChange={(e) =>
                      this.setMedicationValues(e, index, 'route')
                    }
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  >
                    <option value=''>Choose One</option>
                    <option value='Oral'>Oral</option>
                    <option value='IV'>IV</option>
                    <option value='Intramuscularly'>Intramuscularly</option>
                    <option value='Topical'>Topical</option>
                    <option value='Subcutaneous'>Subcutaneous</option>
                    <option value='Rectal'>Rectal</option>
                    <option value='OD'>OD</option>
                    <option value='OS'>OS</option>
                    <option value='OU'>OU-</option>
                  </Form.Control>
                </div>
                <div className='replication-pod-item'>
                  <Form.Group controlId={`action ${singleMedication} ${index}`}>
                    <Form.Label>Action</Form.Label>

                    <Form.Control
                      type='text'
                      placeholder='Action'
                      value={_.get(medication[index], 'action', '')}
                      onChange={(e) =>
                        this.setMedicationValues(e, index, 'action')
                      }
                      disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                    />
                  </Form.Group>
                </div>
                <div className='replication-pod-item'>
                  <Form.Group controlId={`dose ${singleMedication} ${index}`}>
                    <Form.Label>Dose</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Dose'
                      value={_.get(medication[index], 'dose', '')}
                      onChange={(e) =>
                        this.setMedicationValues(e, index, 'dose')
                      }
                      disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                    />
                  </Form.Group>
                </div>
                <div className='replication-pod-item'>
                  <Form.Label>Start Date</Form.Label>
                  <DatePicker
                    onChange={(e) =>
                      this.setMedicationValues(e, index, 'startDate')
                    }
                    value={
                      formData && formData.medication[index].startDate
                        ? moment(
                          medication[index].startDate,
                          'YYYY-MM-DD HH:mm A'
                        )
                        : null
                    }
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </div>
                <div className='replication-pod-item'>
                  <Form.Label>End Date</Form.Label>
                  <DatePicker
                    onChange={(e) =>
                      this.setMedicationValues(e, index, 'endDate')
                    }
                    value={
                      formData && formData.medication[index].endDate
                        ? moment(
                          medication[index].endDate,
                          'YYYY-MM-DD HH:mm A'
                        )
                        : null
                    }
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </div>
                <div className='replication-pod-item'>
                  <Form.Label>Frequency</Form.Label>
                  <Form.Control
                    as='select'
                    value={medication[index].frequency}
                    onChange={(e) =>
                      this.setMedicationValues(e, index, 'frequency')
                    }
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  >
                    <option value='QD – One a day'>QD – One a day</option>
                    <option value='BID – Twice a day'>BID – Twice a day</option>
                    <option value='TID – 3x a day'>TID – 3x a day</option>
                    <option value='QID – 4x a day'>QID – 4x a day</option>
                    <option value='QHS – before bed'>QHS – before bed</option>
                    <option value='Q4H – Every 4 hours'>
                      Q4H – Every 4 hours
                    </option>
                    <option value='Q6H – Every 6 hours'>
                      Q6H – Every 6 hours
                    </option>
                    <option value='QOD – Every other day'>
                      QOD – Every other day
                    </option>
                    <option value='PRN - As needed'>PRN - As needed-</option>
                  </Form.Control>
                </div>
                <button
                  type='button'
                  className='btn btn-link'
                  disabled={medication.length <= 1}
                  onClick={(e) => this.handleRemoveMedicationRow(e, index)}
                  disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            );
          })}
          <button
            type='button'
            className='btn btn-link'
            onClick={() => this.handleAddMedicationRow()}
            disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Another
          </button>
        </div>

        <Form.Group controlId='onSpecialDiet'>
          <Form.Label>Is Elder On any Special Medical Diet?</Form.Label>
          <div className='form-multicheck form-multicheck-spaced'>
            <Radio.Group
              onChange={(e) => this.setStateValues(e, 'onSpecialDiet')}
              value={_.get(formData, 'onSpecialDiet', '')}
              disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
            >
              <Radio value={'yes'}>Yes</Radio>
              <Radio value={'no'}>No</Radio>
            </Radio.Group>
            {formData.onSpecialDiet === 'yes' ? (
              <Form.Group controlId='specialDietOptions'>
                <Form.Label>Special Diets</Form.Label>
                <div className='form-multicheck'>
                  <Checkbox.Group
                    options={_.get(selectionOptions, 'specialDietOptions', [])}
                    value={_.get(formData, 'selectedSpecialDietOptions', [])}
                    onChange={(e) =>
                      this.setStateValues(e, 'selectedSpecialDietOptions')
                    }
                    disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                  />
                </div>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <Form.Control
                      type='text'
                      placeholder='Other Diet'
                      disabled={!selectedSpecialDietOptions.includes('Others')}
                      value={
                        !selectedSpecialDietOptions.includes('Others')
                          ? ''
                          : formData.otherSpecialDiet
                      }
                      onChange={(e) =>
                        this.setStateValues(e, 'otherSpecialDiet')
                      }
                      disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
                    />
                  </div>
                </div>
              </Form.Group>
            ) : null}
          </div>
        </Form.Group>

        {/* Doctor Section Start. */}
        <h6>Doctor Details</h6>
        {this.doctorsDetailsComponent()}
        {/* Doctor Section End. */}

        <div>
          <Button
            type='button'
            className='btn btn-primary'
            onClick={this.submitData}
            disabled={checkForMedicalTab(this.props.user, this.props.elderData)}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ElderMedicalDetails);

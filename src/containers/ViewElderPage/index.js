import React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import { DatePicker, notification, Select } from 'antd';
import { connect } from 'react-redux';
import { Button, Form, Table } from 'react-bootstrap';
import { getRenderingHeader } from '../../common/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faEdit,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { getElderData, removeElderData } from '../../actions/ElderActions';
import { getCountryCodesList } from '../../actions/ConfigActions';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import PageLoader from '../../components/PageLoader';
import ImageUploader from '../../components/ImageUploader';
import SideNavigation from '../../components/SideNavigation';
import ManageAddresses from '../../components/ManageAddresses';
import FamilyMembers from '../../components/FamilyMembers';
import EmergencyContacts from '../../components/EmergencyContacts';
import ElderManagerFile from './dataManager';
import requireAuth from '../../hoc/requireAuth';
import hasPermission from '../../hoc/hasPermission';
import ElderNotes from '../../components/ElderNotes';

import styles from './view-elder-page.scss';

const ElderManager = new ElderManagerFile();

class ViewElderPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      navigationDeployed: true,
      editProfile: false,
      countryCodesList: [],
      medicalConditionsList: [],
      showZohoFields: false,
      formData: {
        userID: null,
        firstName: '',
        lastName: '',
        dob: null,
        bloodGroup: '',
        mobileNumber: null,
        countryCode: '91',
        image_uuid: null,
        imageURL: null,
        showZohoData: false,
        locationCode: '',
        lead_source: '',
        lead_date: null,
        lead_sub_source: '',
        lead_first_stage: '',
        lead_second_stage: '',
        lead_third_stage: '',
        lead_fourth_stage: '',
        data_source: '',
        customer_id: '',
        interested_service: '',
        customer_type: '',
        sensor_installation: '',
        sales_remarks: '',
        other_remarks: '',
        nri_status: '',
        relationship_with_elder: '',
        marital_status: '',
        home_type: '',
        created_by: '',
        modified_by: '',
        most_liked_feature: '',
        covid_diposition: '',
        currency: '',
        bedrooms: '',
        service_end_date: null,
        product_package: '',
        payment_status: '',
        proceed_to_af2b: '',
        proceed_to_af2a: '',
        target_group_type: '',
        assessment_date: null,
        appointment_created_date: null,
        other_service: '',
        who_did_you_meet: '',
        select_days_month: '',
        service_length: '',
        salutation: '',
        ad_set_name: '',
        campaign_name: '',
        form_source_url: '',
        spouse_name: '',
        spouse_dob: null,
        google_link: '',
        af21_remarks: '',
        owner_name: '',
        first_name_customer_calling: '',
        last_name_customer_calling: '',
        nok_phone: '',
        nok_email: '',
        nok_name: '',
        is_nok_the_primary_emergency_contact: '',
        primary_emergency_contact_number: '',
        primary_emergency_contact_name: '',
        secondary_emergency_contact_number: '',
        secondary_emergency_contact_name: '',
        sales_status: '',
        allergies: [''],
        current_medical_conditions: [''],
        age: null,
        current_living_condition: '',
        payment_source: '',
      },
    };
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Elder Profile';

    this.getElderData(this.props.match.params.id);
    this.getCountryCodesList();
  }

  getCountryCodesList() {
    this.props
      .getCountryCodesList('medical_conditions')
      .then((result) => {
        this.setState({
          countryCodesList: result.country_codes,
          medicalConditionsList: [...result.medical_conditions],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getElderData = (id) => {
    ElderManager.getElderData({ id })
      .then((res) => {
        this._stopPageLoader();
        if (res.data && res.data.length) {
          this.dispatchElderData(res.data[0]);
        }
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification('Error', error.response.data.message, 0);
      });
  };

  dispatchElderData = (elderData) => {
    this.props.getElderData(elderData);
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

  handleUploadedImage = (imageIdentifier) => {
    this.setState((state) => ({
      ...state,
      formData: { ...state.formData, image_uuid: imageIdentifier },
    }));
  };

  setStateValues = (field, e) => {
    let value;
    if (field === 'countryCode') {
      value = e;
    } else if (
      field !== 'dob' &&
      field !== 'lead_date' &&
      field !== 'service_end_date' &&
      field !== 'assessment_date' &&
      field !== 'appointment_created_date' &&
      field !== 'spouse_dob'
    ) {
      value = e.currentTarget.value;
    } else {
      value = e ? moment(e._d).format('YYYY-MM-DD 00:00:00') : null;
    }
    let formData = this.state.formData;
    formData[`${field}`] = value;
    this.setState({ formData });
  };

  triggerEditProfile = () => {
    this.setState({ editProfile: true });

    let formData = Object.assign({}, this.state.formData);

    const {
      first_name,
      last_name,
      country_code,
      mobile_number,
      owner,
      image_url,
    } = this.props.elderData;

    let dob, blood_group, locationCode;

    let newCurrentMedicalConditionsArr = [];
    if (owner) {
      dob = owner.dob;
      blood_group = owner.blood_group;
      locationCode = owner.location_code;

      let currentMedicalConditionsArr = owner.current_medical_conditions;
      for (let index = 0; index < currentMedicalConditionsArr.length; index++) {
        newCurrentMedicalConditionsArr.push(currentMedicalConditionsArr[index]);
      }
    }

    formData = {
      firstName: first_name,
      lastName: last_name,
      dob: dob,
      bloodGroup: blood_group,
      mobileNumber: mobile_number,
      countryCode: country_code ? country_code : '91',
      image_uuid: null,
      imageURL: image_url,
      userID: this.props.elderData.id,
      locationCode: locationCode,
      lead_source: owner.lead_source,
      lead_date: owner.lead_date,
      lead_sub_source: owner.lead_sub_source,
      lead_first_stage: owner.lead_first_stage,
      lead_second_stage: owner.lead_second_stage,
      lead_third_stage: owner.lead_third_stage,
      lead_fourth_stage: owner.lead_fourth_stage,
      data_source: owner.data_source,
      customer_id: owner.customer_id,
      interested_service: owner.interested_service,
      customer_type: owner.customer_type,
      sensor_installation: owner.sensor_installation,
      sales_remarks: owner.sales_remarks,
      other_remarks: owner.other_remarks,
      nri_status: owner.nri_status,
      relationship_with_elder: owner.relationship_with_elder,
      marital_status: owner.marital_status,
      home_type: owner.home_type,
      created_by: owner.created_by,
      modified_by: owner.modified_by,
      most_liked_feature: owner.most_liked_feature,
      covid_diposition: owner.covid_diposition,
      currency: owner.currency,
      bedrooms: owner.bedrooms,
      service_end_date: owner.service_end_date,
      product_package: owner.product_package,
      payment_status: owner.payment_status,
      proceed_to_af2b: owner.proceed_to_af2b,
      proceed_to_af2a: owner.proceed_to_af2a,
      target_group_type: owner.target_group_type,
      assessment_date: owner.assessment_date,
      appointment_created_date: owner.appointment_created_date,
      other_service: owner.other_service,
      who_did_you_meet: owner.who_did_you_meet,
      select_days_month: owner.select_days_month,
      service_length: owner.service_length,
      salutation: owner.salutation,
      ad_set_name: owner.ad_set_name,
      campaign_name: owner.campaign_name,
      form_source_url: owner.form_source_url,
      spouse_name: owner.spouse_name,
      spouse_dob: owner.spouse_dob,
      google_link: owner.google_link,
      af21_remarks: owner.af21_remarks,
      owner_name: owner.owner_name,
      first_name_customer_calling: owner.first_name_customer_calling,
      last_name_customer_calling: owner.last_name_customer_calling,
      nok_phone: owner.nok_phone,
      nok_email: owner.nok_email,
      nok_name: owner.nok_name,
      is_nok_the_primary_emergency_contact:
        owner.is_nok_the_primary_emergency_contact,
      primary_emergency_contact_number: owner.primary_emergency_contact_number,
      primary_emergency_contact_name: owner.primary_emergency_contact_name,
      secondary_emergency_contact_number:
        owner.secondary_emergency_contact_number,
      secondary_emergency_contact_name: owner.secondary_emergency_contact_name,
      sales_status: owner.sales_status,
      allergies: owner.allergies.length !== 0 ? owner.allergies : [''],
      current_medical_conditions:
        newCurrentMedicalConditionsArr.length !== 0
          ? newCurrentMedicalConditionsArr
          : [''],
      age: owner.age ? owner.age : null,
      current_living_condition: owner.current_living_condition,
      payment_source: owner.payment_source,
    };

    this.setState({ formData });
  };

  editProfileHandler = () => {
    const isFormValid = ElderManager.editProfileValidator(this.state.formData);

    if (!isFormValid) {
      return this.openNotification(
        'Error',
        'You have either missed a field or data is in incorrect format. Please check and try again.',
        0
      );
    }

    this._startPageLoader();
    ElderManager.editElderProfile(this.state.formData)
      .then((res) => {
        this.openNotification('Success', 'Profile Updated Successfully.', 1);
        this.setState({ editProfile: false });
        this.getElderData(this.props.elderData.id);
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification('Error', error.response.data.message, 0);
      });
  };

  handleAllergyUpdate = (index, fieldValue) => {
    let updatedAllergies = this.state.formData.allergies;
    updatedAllergies[index] = fieldValue;

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        allergies: updatedAllergies,
      },
    }));
  };

  handleAddAllergyRow = () => {
    let updatedAllergies = this.state.formData.allergies;
    updatedAllergies.push('');

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        allergies: updatedAllergies,
      },
    }));
  };

  handleRemoveAllergyRow = (removeIndex) => {
    let updatedAllergies = this.state.formData.allergies;

    updatedAllergies = updatedAllergies.filter((item, index) => {
      return index !== removeIndex;
    });

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        allergies: updatedAllergies,
      },
    }));
  };

  handleCMCUpdate = (index, fieldValue) => {
    let updatedCurrentMedicalConditions = this.state.formData
      .current_medical_conditions;
    updatedCurrentMedicalConditions[index] = fieldValue;

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        current_medical_conditions: updatedCurrentMedicalConditions,
      },
    }));
  };

  handleAddCMCRow = () => {
    let updatedCurrentMedicalConditions = this.state.formData
      .current_medical_conditions;
    updatedCurrentMedicalConditions.push('');

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        current_medical_conditions: updatedCurrentMedicalConditions,
      },
    }));
  };

  handleRemoveCMCRow = (removeIndex) => {
    let updatedCurrentMedicalConditions = this.state.formData
      .current_medical_conditions;

    updatedCurrentMedicalConditions = updatedCurrentMedicalConditions.filter(
      (item, index) => {
        return index !== removeIndex;
      }
    );

    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        current_medical_conditions: updatedCurrentMedicalConditions,
      },
    }));
  };

  render() {
    const { navigationDeployed, formData } = this.state;

    const elderData = this.props.elderData;

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
                <h2>
                  {elderData
                    ? `${_.get(elderData, 'full_name', 'Elder')}'s`
                    : `Elder's Details`}
                </h2>
              </div>
            </div>

            <div className='internal-content'>
              <div className='elder-details'>
                <div className='row'>
                  <div className='col-12 col-sm-5'>
                    <div className='elder-details-area'>
                      <h4>User Details</h4>

                      <div className='detail-item d-flex align-items-center justify-content-start'>
                        <span className='detail-item-param'>First Name:</span>
                        <span className='detail-item-value'>
                          {_.get(elderData, 'first_name')}
                        </span>
                      </div>

                      <div className='detail-item d-flex align-items-center justify-content-start'>
                        <span className='detail-item-param'>Last Name:</span>
                        <span className='detail-item-value'>
                          {_.get(elderData, 'last_name')}
                        </span>
                      </div>

                      <div className='detail-item d-flex align-items-center justify-content-start'>
                        <span className='detail-item-param'>
                          Contact Number
                        </span>
                        <span className='detail-item-value'>
                          {_.get(elderData, 'mobile_number')
                            ? `+${_.get(elderData, 'country_code')}-${_.get(
                                elderData,
                                'mobile_number'
                              )}`
                            : `${_.get(elderData, 'last_name')}`}
                        </span>
                      </div>

                      <div className='detail-item d-flex align-items-center justify-content-start'>
                        <span className='detail-item-param'>Gender:</span>
                        <span className='detail-item-value'>
                          {_.get(elderData, 'gender') === 1 ? 'Male' : 'Female'}
                        </span>
                      </div>

                      <div className='detail-item d-flex align-items-center justify-content-start'>
                        <span className='detail-item-param'>
                          Date of Birth:
                        </span>
                        <span className='detail-item-value'>
                          {_.get(elderData, 'owner.dob')
                            ? moment(_.get(elderData, 'owner.dob')).format(
                                'Do MMM, YYYY'
                              )
                            : ''}
                        </span>
                      </div>

                      <div className='detail-item d-flex align-items-center justify-content-start'>
                        <span className='detail-item-param'>Blood Group:</span>
                        <span className='detail-item-value'>
                          {_.get(elderData, 'owner.blood_group')}
                        </span>
                      </div>

                      <div className='detail-item d-flex align-items-center justify-content-start'>
                        <span className='detail-item-param'>
                          Location Code:
                        </span>
                        <span className='detail-item-value'>
                          {_.get(elderData, 'owner.location_code')}
                        </span>
                      </div>

                      <div className='detail-item d-flex align-items-center justify-content-start'>
                        <span className='detail-item-param'>Customer ID:</span>
                        <span className='detail-item-value'>
                          {_.get(elderData, 'owner.customer_id')}
                        </span>
                      </div>

                      <div className='detail-item d-flex align-items-center justify-content-start'>
                        <Button
                          onClick={() => this.triggerEditProfile()}
                          type='button'
                          className='btn btn-link'
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit Details
                        </Button>
                      </div>

                      {elderData && elderData.zoho_object ? (
                        <div className='detail-item d-flex align-items-center justify-content-start'>
                          <Button
                            onClick={() =>
                              this.setState({
                                showZohoData: !this.state.showZohoData,
                              })
                            }
                            type='button'
                            className='btn btn-link'
                          >
                            <FontAwesomeIcon icon={faEdit} />{' '}
                            {`${
                              this.state.showZohoData
                                ? 'Hide Zoho Data'
                                : 'View Zoho Data'
                            }`}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className='col-12 col-sm-7'>
                    {this.state.editProfile ? (
                      <div className='elder-details-area'>
                        <h4>Edit Information</h4>

                        <div className='row'>
                          <div className='col-12 col-sm-4'>
                            <Form.Group controlId='displayPicture'>
                              <Form.Label>Display Picture</Form.Label>

                              <ImageUploader
                                type='Media'
                                file_type='2'
                                owner_type='User'
                                uploadTitle='No Photo'
                                image_url={formData.imageURL}
                                stopLoader={this._stopPageLoader}
                                startLoader={this._startPageLoader}
                                openNotification={this.openNotification}
                                onImageUpload={this.handleUploadedImage}
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Form.Group>
                              <Form.Label>First Name</Form.Label>

                              <Form.Control
                                type='text'
                                value={formData.firstName}
                                onChange={(e) =>
                                  this.setStateValues('firstName', e)
                                }
                                placeholder='Vijay'
                              />
                            </Form.Group>
                          </div>

                          <div className='col-12 col-sm-6'>
                            <Form.Group>
                              <Form.Label>Last Name</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Singh'
                                value={formData.lastName}
                                onChange={(e) =>
                                  this.setStateValues('lastName', e)
                                }
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Form.Group controlId='elder_gender'>
                              <Form.Label>Gender</Form.Label>

                              <Form.Control
                                as='select'
                                value={formData.gender}
                                onChange={(e) =>
                                  this.setStateValues('gender', e)
                                }
                              >
                                <option value={1}>Male</option>
                                <option value={2}>Female</option>
                              </Form.Control>
                            </Form.Group>
                          </div>

                          <div className='col-12 col-sm-6'>
                            <Form.Group controlId='elderDateOfBirth'>
                              <Form.Label>Date of Birth</Form.Label>
                              <DatePicker
                                defaultValue={
                                  formData.dob != null
                                    ? moment(formData.dob, 'YYYY-MM-DD')
                                    : null
                                }
                                onChange={(e) => this.setStateValues('dob', e)}
                                disabledDate={(d) => d.isAfter(moment())}
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Form.Group controlId='elderContactNumber'>
                              <Form.Label>Contact Number</Form.Label>
                              <div className='d-flex justify-content-start'>
                                <Select
                                  showSearch
                                  style={{ width: 125, marginRight: '8px' }}
                                  notFoundContent={null}
                                  showArrow={false}
                                  defaultValue={formData.countryCode}
                                  optionFilterProp='children'
                                  onChange={(value) =>
                                    this.setStateValues('countryCode', value)
                                  }
                                  placeholder='Please search for a country code'
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toString()
                                      .toLowerCase()
                                      .indexOf(input)
                                      .toString()
                                      .toLowerCase() >= 0
                                  }
                                >
                                  {this.state.countryCodesList.map(
                                    (code, index) => {
                                      return (
                                        <Select.Option key={code} value={code}>
                                          +{code}
                                        </Select.Option>
                                      );
                                    }
                                  )}
                                </Select>
                                <Form.Control
                                  type='text'
                                  value={formData.mobileNumber}
                                  placeholder='9876543210'
                                  onChange={(e) =>
                                    this.setStateValues('mobileNumber', e)
                                  }
                                />
                              </div>
                            </Form.Group>
                          </div>

                          <div className='col-12 col-sm-6'>
                            <Form.Group controlId='elder_gender'>
                              <Form.Label>Blood Group</Form.Label>

                              <Form.Control
                                as='select'
                                value={formData.bloodGroup}
                                onChange={(e) =>
                                  this.setStateValues('bloodGroup', e)
                                }
                              >
                                <option value='' disabled>
                                  Please select a blood group
                                </option>
                                <option value='A'>A</option>
                                <option value='A+'>A+</option>
                                <option value='A-'>A-</option>
                                <option value='B'>B</option>
                                <option value='B+'>B+</option>
                                <option value='B-'>B-</option>
                                <option value='AB'>AB</option>
                                <option value='AB+'>AB+</option>
                                <option value='AB-'>AB-</option>
                                <option value='O'>O</option>
                                <option value='O+'>O+</option>
                                <option value='O-'>O-</option>
                              </Form.Control>
                            </Form.Group>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <div className='multiparty-inputs'>
                              <Form.Label>Allergies</Form.Label>

                              {formData.allergies &&
                                formData.allergies.length !== 0 &&
                                formData.allergies.map((item, index) => {
                                  return (
                                    <div
                                      className='multiparty-inputs-row d-flex align-items-center justify-content-start'
                                      key={index}
                                    >
                                      <Form.Group>
                                        <Form.Control
                                          type='text'
                                          placeholder='Allergy'
                                          value={item}
                                          onChange={(event) =>
                                            this.handleAllergyUpdate(
                                              index,
                                              event.target.value
                                            )
                                          }
                                        />
                                      </Form.Group>

                                      <Button
                                        type='button'
                                        className='btn btn-link'
                                        disabled={
                                          formData.allergies.length <= 1
                                        }
                                        onClick={() =>
                                          this.handleRemoveAllergyRow(index)
                                        }
                                      >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                      </Button>
                                    </div>
                                  );
                                })}

                              <Button
                                type='button'
                                className='btn btn-link'
                                onClick={() => this.handleAddAllergyRow()}
                              >
                                <FontAwesomeIcon icon={faPlus} /> Add Another
                              </Button>
                            </div>
                          </div>

                          <div className='col-12 col-sm-6'>
                            <div className='multiparty-inputs'>
                              <Form.Label>
                                Current Medical Conditions
                              </Form.Label>

                              {formData.current_medical_conditions &&
                                formData.current_medical_conditions.length !==
                                  0 &&
                                formData.current_medical_conditions.map(
                                  (item, index) => {
                                    return (
                                      <div
                                        className='multiparty-inputs-row d-flex align-items-center justify-content-start'
                                        key={index}
                                      >
                                        <Form.Group>
                                          <Form.Control
                                            as='select'
                                            value={item}
                                            onChange={(event) =>
                                              this.handleCMCUpdate(
                                                index,
                                                event.target.value
                                              )
                                            }
                                          >
                                            <option value=''>
                                              Select a medical condition
                                            </option>
                                            {this.state.medicalConditionsList &&
                                              this.state.medicalConditionsList
                                                .length &&
                                              this.state.medicalConditionsList.map(
                                                (medicalCondition, index) => {
                                                  return (
                                                    <option
                                                      value={
                                                        medicalCondition.itemKey
                                                      }
                                                      key={index}
                                                    >
                                                      {medicalCondition.label}
                                                    </option>
                                                  );
                                                }
                                              )}
                                          </Form.Control>
                                        </Form.Group>

                                        <Button
                                          type='button'
                                          className='btn btn-link'
                                          disabled={
                                            formData.current_medical_conditions
                                              .length <= 1
                                          }
                                          onClick={() =>
                                            this.handleRemoveCMCRow(index)
                                          }
                                        >
                                          <FontAwesomeIcon icon={faTrashAlt} />
                                        </Button>
                                      </div>
                                    );
                                  }
                                )}

                              <Button
                                type='button'
                                className='btn btn-link'
                                onClick={() => this.handleAddCMCRow()}
                              >
                                <FontAwesomeIcon icon={faPlus} /> Add Another
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Form.Group>
                              <Form.Label>Location Code</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='G1'
                                value={formData.locationCode}
                                onChange={(e) =>
                                  this.setStateValues('locationCode', e)
                                }
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-12'>
                            <Button
                              type='button'
                              className='btn btn-link'
                              onClick={() =>
                                this.setState({
                                  showZohoFields: !this.state.showZohoFields,
                                })
                              }
                            >
                              <FontAwesomeIcon
                                icon={
                                  this.state.showZohoFields ? faMinus : faPlus
                                }
                              />{' '}
                              {this.state.showZohoFields
                                ? 'Hide Zoho Fields'
                                : 'Show Zoho Fields'}
                            </Button>
                          </div>
                        </div>

                        {this.state.showZohoFields && (
                          <React.Fragment>
                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Customer ID</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='EMGGN12345'
                                    value={formData.customer_id}
                                    onChange={(e) =>
                                      this.setStateValues('customer_id', e)
                                    }
                                  />
                                </Form.Group>
                              </div>

                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>AF2.1 Remarks</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='AF2.1 Remarks'
                                    value={formData.af21_remarks}
                                    onChange={(e) =>
                                      this.setStateValues('af21_remarks', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Lead Source</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Lead Source'
                                    onChange={(e) =>
                                      this.setStateValues('lead_source', e)
                                    }
                                    value={formData.lead_source}
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Seniority'>Seniority</option>
                                    <option value='RM Source'>RM Source</option>
                                    <option value='Doctor Referral'>
                                      Doctor Referral
                                    </option>
                                    <option value='RWA Activation'>
                                      RWA Activation
                                    </option>
                                    <option value='Business Partner'>
                                      Business Partner
                                    </option>
                                    <option value='EMOHA Ambassador'>
                                      EMOHA Ambassador
                                    </option>
                                    <option value='Digital Campaign'>
                                      Digital Campaign
                                    </option>
                                    <option value='Website'>Website</option>
                                    <option value='Internal Referral'>
                                      Internal Referral
                                    </option>
                                    <option value='Nursepreneur-Diksha'>
                                      Nursepreneur-Diksha
                                    </option>
                                    <option value='Nursepreneur-Vinod'>
                                      Nursepreneur-Vinod
                                    </option>
                                    <option value='Just Dial'>Just Dial</option>
                                    <option value='Emoha Event'>
                                      Emoha Event
                                    </option>
                                    <option value='Direct Call'>
                                      Direct Call
                                    </option>
                                    <option value='Walk In'>Walk In</option>
                                    <option value='Facebook'>Facebook</option>
                                    <option value='Facebook Ads'>
                                      Facebook Ads
                                    </option>
                                    <option value='Facebook Messengers Ads'>
                                      Facebook Messengers Ads
                                    </option>
                                    <option value='Twitter'>Twitter</option>
                                    <option value='Youtube'>Youtube</option>
                                    <option value='Instagram'>Instagram</option>
                                    <option value='LinkedIN'>LinkedIN</option>
                                    <option value='Google Ad-words'>
                                      Google Ad-words
                                    </option>
                                    <option value='Employee Referral'>
                                      Employee Referral
                                    </option>
                                    <option value='Word of mouth'>
                                      Word of mouth
                                    </option>
                                    <option value='Cred'>Cred</option>
                                    <option value='Samvada'>Samvada</option>
                                    <option value='SMS'>SMS</option>
                                    <option value="Elder's_First_Emergency_Support">
                                      Elder's_First_Emergency_Support
                                    </option>
                                    <option value='Other'>Other</option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Lead Sub Source</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Lead Sub Source'
                                    onChange={(e) =>
                                      this.setStateValues('lead_sub_source', e)
                                    }
                                    value={formData.lead_sub_source}
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Seniority'>Seniority</option>
                                    <option value='Website'>Website</option>
                                    <option value='Doctor Referral'>
                                      Doctor Referral
                                    </option>
                                    <option value='Events'>Events</option>
                                    <option value='Facebook'>Facebook</option>
                                    <option value='Google'>Google</option>
                                    <option value='Word of Mouth'>
                                      Word of Mouth
                                    </option>
                                    <option value='Samvad'>Samvad</option>
                                    <option value='SMS'>SMS</option>
                                    <option value="Elder's_First_Emergency_Support">
                                      Elder's_First_Emergency_Support
                                    </option>
                                    <option value='Email'>Email</option>
                                    <option value='Hospital'>Hospital</option>
                                    <option value='Marketing Display'>
                                      Marketing Display
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Lead Date</Form.Label>
                                  <DatePicker
                                    onChange={(e) =>
                                      this.setStateValues('lead_date', e)
                                    }
                                    defaultValue={
                                      formData.lead_date
                                        ? moment(formData.lead_date)
                                        : null
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Data Source</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Data Source'
                                    value={formData.data_source}
                                    onChange={(e) =>
                                      this.setStateValues('data_source', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Lead First Stage</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Lead first stage'
                                    value={formData.lead_first_stage}
                                    onChange={(e) =>
                                      this.setStateValues('lead_first_stage', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Lead Second Stage</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Lead second stage'
                                    value={formData.lead_second_stage}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'lead_second_stage',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Lead Third Stage</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Lead third stage'
                                    value={formData.lead_third_stage}
                                    onChange={(e) =>
                                      this.setStateValues('lead_third_stage', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Lead Fourth Stage</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Lead fourth stage'
                                    value={formData.lead_fourth_stage}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'lead_fourth_stage',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Customer Type</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Customer Type'
                                    onChange={(e) =>
                                      this.setStateValues('customer_type', e)
                                    }
                                    value={formData.customer_type}
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='COMPLEMENTARY SERVICE'>
                                      COMPLEMENTARY SERVICE
                                    </option>
                                    <option value='EMOHA ASSURE'>
                                      EMOHA ASSURE
                                    </option>
                                    <option value='EMOHA SMART CARE'>
                                      EMOHA SMART CARE
                                    </option>
                                    <option value='EMOHA SMART SENSOR BOX'>
                                      EMOHA SMART SENSOR BOX
                                    </option>
                                    <option value='EPOCH ASSISTED LIVING'>
                                      EPOCH ASSISTED LIVING
                                    </option>
                                    <option value='Assure Empower'>
                                      Assure Empower
                                    </option>
                                    <option value='Empower_2'>Empower_2</option>
                                    <option value="Elder's First">
                                      Elder's First
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Interested Service</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Interested Service'
                                    value={formData.interested_service}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'interested_service',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Elder's NRI Status</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder="Elder's NRI Status"
                                    onChange={(e) =>
                                      this.setStateValues('nri_status', e)
                                    }
                                    value={formData.nri_status}
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Kids are NRI'>
                                      Kids are NRI
                                    </option>
                                    <option value='Elder are an NRI'>
                                      Elder are an NRI
                                    </option>
                                    <option value='Not an NRI'>
                                      Not an NRI
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Sensor Installation</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Sensor Installation'
                                    value={formData.sensor_installation}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'sensor_installation',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Sales Remarks</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Sales Remarks'
                                    value={formData.sales_remarks}
                                    onChange={(e) =>
                                      this.setStateValues('sales_remarks', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Other Remarks</Form.Label>
                                  <Form.Control
                                    type='text'
                                    value={formData.other_remarks}
                                    placeholder='Other Remarks'
                                    onChange={(e) =>
                                      this.setStateValues('other_remarks', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    Relationship with Elder
                                  </Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Relationship with Elder'
                                    value={formData.relationship_with_elder}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'relationship_with_elder',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Marital Status</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Marital Status'
                                    value={formData.marital_status}
                                    onChange={(e) =>
                                      this.setStateValues('marital_status', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Home Type</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Home Type'
                                    value={formData.home_type}
                                    onChange={(e) =>
                                      this.setStateValues('home_type', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Number of Bedrooms</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Number of Bedrooms'
                                    value={formData.bedrooms}
                                    onChange={(e) =>
                                      this.setStateValues('bedrooms', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Most Liked Feature</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Most Liked Feature'
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'most_liked_feature',
                                        e
                                      )
                                    }
                                    value={formData.most_liked_feature}
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Emergency'>Emergency</option>
                                    <option value='Doctor visit'>
                                      Doctor visit
                                    </option>
                                    <option value='Physio visit'>
                                      Physio visit
                                    </option>
                                    <option value='Dietitian calls'>
                                      Dietitian calls
                                    </option>
                                    <option value='Safety sensors'>
                                      Safety sensors
                                    </option>
                                    <option value='Engagement'>
                                      Engagement
                                    </option>
                                    <option value='Support services'>
                                      Support services
                                    </option>
                                    <option value='Grocery_Related_Deliveries'>
                                      Grocery_Related_Deliveries
                                    </option>
                                    <option value='Chemist_Related_Deliveries'>
                                      Chemist_Related_Deliveries
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Covid Diposition</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Covid Diposition'
                                    onChange={(e) =>
                                      this.setStateValues('covid_diposition', e)
                                    }
                                    value={formData.covid_diposition}
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Webadmin_Ticket'>
                                      Webadmin_Ticket
                                    </option>
                                    <option value='Non_Contact'>
                                      Non_Contact
                                    </option>
                                    <option value='Requested_CB'>
                                      Requested_CB
                                    </option>
                                    <option value='General Enquiry'>
                                      General Enquiry
                                    </option>
                                    <option value='NI_Hungup'>NI_Hungup</option>
                                    <option value='Dropped'>Dropped</option>
                                    <option value='Living with Family'>
                                      Living with Family
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Proceed to AF2.A</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Proceed to AF2.A'
                                    onChange={(e) =>
                                      this.setStateValues('proceed_to_af2a', e)
                                    }
                                    value={formData.proceed_to_af2a}
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Yes'>Yes</option>
                                    <option value='No'>No</option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Proceed to AF2.B</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Proceed to AF2.B'
                                    onChange={(e) =>
                                      this.setStateValues('proceed_to_af2b', e)
                                    }
                                    value={formData.proceed_to_af2b}
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Yes'>Yes</option>
                                    <option value='No'>No</option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Currency</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Currency'
                                    value={formData.currency}
                                    onChange={(e) =>
                                      this.setStateValues('currency', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Target group type</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Target group type'
                                    value={formData.target_group_type}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'target_group_type',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Who did you meet</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Who did you meet'
                                    value={formData.who_did_you_meet}
                                    onChange={(e) =>
                                      this.setStateValues('who_did_you_meet', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Salutation</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Salutation'
                                    value={formData.salutation}
                                    onChange={(e) =>
                                      this.setStateValues('salutation', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Spouse Name</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Spouse Name'
                                    value={formData.spouse_name}
                                    onChange={(e) =>
                                      this.setStateValues('spouse_name', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Spouse DOB</Form.Label>
                                  <DatePicker
                                    onChange={(e) =>
                                      this.setStateValues('spouse_dob', e)
                                    }
                                    defaultValue={
                                      formData.spouse_dob
                                        ? moment(formData.spouse_dob)
                                        : null
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    First Name of Customer Calling
                                  </Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='First Name of Customer Calling'
                                    value={formData.first_name_customer_calling}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'first_name_customer_calling',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    Last Name of Customer Calling
                                  </Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Last Name of Customer Calling'
                                    value={formData.last_name_customer_calling}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'last_name_customer_calling',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Product Package</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Product Package'
                                    value={formData.product_package}
                                    onChange={(e) =>
                                      this.setStateValues('product_package', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Payment Status</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Payment Status'
                                    onChange={(e) =>
                                      this.setStateValues('payment_status', e)
                                    }
                                    value={formData.payment_status}
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Payment Received'>
                                      Payment Received
                                    </option>
                                    <option value='Partial Received'>
                                      Partial Received
                                    </option>
                                    <option value='Payment Pending'>
                                      Payment Pending
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Service Length</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Service Length'
                                    onChange={(e) =>
                                      this.setStateValues('service_length', e)
                                    }
                                    value={formData.service_length}
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Service End Date</Form.Label>
                                  <DatePicker
                                    onChange={(e) =>
                                      this.setStateValues('service_end_date', e)
                                    }
                                    defaultValue={
                                      formData.service_end_date
                                        ? moment(formData.service_end_date)
                                        : null
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Select Days/Month</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Select Days/Month'
                                    value={formData.select_days_month}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'select_days_month',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Other Service</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Other Service'
                                    value={formData.other_service}
                                    onChange={(e) =>
                                      this.setStateValues('other_service', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Ad Set Name</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Ad Set Name'
                                    value={formData.ad_set_name}
                                    onChange={(e) =>
                                      this.setStateValues('ad_set_name', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Campaign Name</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Campaign Name'
                                    value={formData.campaign_name}
                                    onChange={(e) =>
                                      this.setStateValues('campaign_name', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Form Source URL</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Form Source URL'
                                    value={formData.form_source_url}
                                    onChange={(e) =>
                                      this.setStateValues('form_source_url', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Google Link</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Google Link'
                                    value={formData.google_link}
                                    onChange={(e) =>
                                      this.setStateValues('google_link', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    Appointment Created Date
                                  </Form.Label>
                                  <DatePicker
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'appointment_created_date',
                                        e
                                      )
                                    }
                                    defaultValue={
                                      formData.appointment_created_date
                                        ? moment(
                                            formData.appointment_created_date
                                          )
                                        : null
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Assessment Date</Form.Label>
                                  <DatePicker
                                    onChange={(e) =>
                                      this.setStateValues('assessment_date', e)
                                    }
                                    defaultValue={
                                      formData.assessment_date
                                        ? moment(formData.assessment_date)
                                        : null
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>NOK Name</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='NOK Name'
                                    value={formData.nok_name}
                                    onChange={(e) =>
                                      this.setStateValues('nok_name', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>NOK Email</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='NOK Email'
                                    value={formData.nok_email}
                                    onChange={(e) =>
                                      this.setStateValues('nok_email', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>NOK Phone</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='NOK Phone'
                                    value={formData.nok_phone}
                                    onChange={(e) =>
                                      this.setStateValues('nok_phone', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    Is NOK the Primary Emergency Contact
                                  </Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Is NOK the Primary Emergency Contact'
                                    value={
                                      formData.is_nok_the_primary_emergency_contact
                                    }
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'is_nok_the_primary_emergency_contact',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    Primary Emergency Contact Name
                                  </Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Primary Emergency Contact Name'
                                    value={
                                      formData.primary_emergency_contact_name
                                    }
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'primary_emergency_contact_name',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    Primary Emergency Contact Number
                                  </Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Primary Emergency Contact Number'
                                    value={
                                      formData.primary_emergency_contact_number
                                    }
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'primary_emergency_contact_number',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    Secondary Emergency Contact Name
                                  </Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Secondary Emergency Contact Name'
                                    value={
                                      formData.secondary_emergency_contact_name
                                    }
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'secondary_emergency_contact_name',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    Secondary Emergency Contact Number
                                  </Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Secondary Emergency Contact Number'
                                    value={
                                      formData.secondary_emergency_contact_number
                                    }
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'secondary_emergency_contact_number',
                                        e
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Sales Status</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Sales Status'
                                    value={formData.sales_status}
                                    onChange={(e) =>
                                      this.setStateValues('sales_status', e)
                                    }
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Price Negotiation'>
                                      Price Negotiation
                                    </option>
                                    <option value='Active'>Active</option>
                                    <option value='Dropped'>Dropped</option>
                                    <option value='Service Completed'>
                                      Service Completed
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </div>

                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Payment Source</Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Payment Source'
                                    value={formData.payment_source}
                                    onChange={(e) =>
                                      this.setStateValues('payment_source', e)
                                    }
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Razor Pay'>Razor Pay</option>
                                    <option value='Website'>Website</option>
                                    <option value='Emoha_App'>Emoha_App</option>
                                    <option value='Cheque'>Cheque</option>
                                    <option value='Machine Pay'>
                                      Machine Pay
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>
                                    Current Living Condition
                                  </Form.Label>
                                  <Form.Control
                                    as='select'
                                    placeholder='Current Living Condition'
                                    value={formData.current_living_condition}
                                    onChange={(e) =>
                                      this.setStateValues(
                                        'current_living_condition',
                                        e
                                      )
                                    }
                                  >
                                    <option value='-None-'>-None-</option>
                                    <option value='Lives Alone'>
                                      Lives Alone
                                    </option>
                                    <option value='Lives With Spouse'>
                                      Lives With Spouse
                                    </option>
                                    <option value='Lives With Son'>
                                      Lives With Son
                                    </option>
                                    <option value='Lives With Daughter'>
                                      Lives With Daughter
                                    </option>
                                    <option value='Lives With paid helper'>
                                      Lives With paid helper
                                    </option>

                                    <option value='Other'>Other</option>
                                  </Form.Control>
                                </Form.Group>
                              </div>

                              <div className='col-12 col-sm-6'>
                                <Form.Group controlId='elderLastName'>
                                  <Form.Label>Age</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Age'
                                    onChange={(e) =>
                                      this.setStateValues('age', e)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>
                          </React.Fragment>
                        )}

                        <Button
                          onClick={() => this.editProfileHandler()}
                          type='button'
                          className='btn btn-primary'
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => this.setState({ editProfile: false })}
                          type='button'
                          className='btn btn-secondary'
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {elderData &&
                elderData.zoho_object &&
                this.state.showZohoData ? (
                  <div className='row'>
                    <div className='col-12'>
                      <Table
                        bordered
                        style={{
                          display: 'block',
                          height: '300px',
                          overflowY: 'scroll',
                        }}
                      >
                        <thead>
                          <tr>
                            <th style={{ width: '40%' }}>Field</th>
                            <th style={{ width: '60%' }}>Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(elderData.zoho_object).map(
                            (key, index) => {
                              if (!key.startsWith('$'))
                                return (
                                  <tr key={index}>
                                    <td>{key}</td>
                                    <td>
                                      {JSON.stringify(
                                        elderData.zoho_object[key]
                                      )}
                                    </td>
                                  </tr>
                                );
                            }
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Notes Management Component */}
              <ElderNotes
                startLoader={this._startPageLoader}
                stopLoader={this._stopPageLoader}
                openNotification={this.openNotification}
                currentElderIdentifier={this.props.match.params.id}
              />

              <ManageAddresses
                startLoader={this._startPageLoader}
                stopLoader={this._stopPageLoader}
                openNotification={this.openNotification}
              />

              <FamilyMembers
                startLoader={this._startPageLoader}
                stopLoader={this._stopPageLoader}
                openNotification={this.openNotification}
              />

              <EmergencyContacts
                startLoader={this._startPageLoader}
                stopLoader={this._stopPageLoader}
                openNotification={this.openNotification}
              />
            </div>
          </main>
        </div>

        {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
        {this.state.loader ? <PageLoader /> : null}
      </React.Fragment>
    );
  }

  componentWillUnmount() {
    this.props.removeElderData();
  }
}
const mapsStateToProps = (state) => ({
  user: state.user.user,
  elderData: state.elder.elderData,
});

const mapDispatchToProps = {
  getElderData,
  removeElderData,
  getCountryCodesList,
};

export default connect(
  mapsStateToProps,
  mapDispatchToProps
)(hasPermission(requireAuth(ViewElderPage)));

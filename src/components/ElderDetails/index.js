import React from 'react';
import moment from 'moment';
import * as _ from 'lodash';

import {
  DatePicker,
  Select,
  Switch,
  notification,
  Comment,
  Avatar,
} from 'antd';
import { get } from 'lodash';
import { Button, Form, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Card } from 'antd';
import {
  faEdit,
  faMinus,
  faCheck,
  faTimes,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

import { checkIsErmOrErmSuperVisor, checkIsErmOrErmSuperVisorElderActive } from 'utils/checkElderEditPermission';
import { getElderData, fetchElderNotes } from '../../actions/ElderActions';
import LanguagesSpoken from '../LanguagesSpoken/index';
import ImageUploader from '../ImageUploader';
import ElderDetailsDataManager from './dataManager';
import Sensor from './Sensor/index';

import {
  updateUserStatus,
  updateElderBriefingStatus,
  updateElderNokStatus,
  updateWelcomePackStatus,
  updatePrimaryElderStatus,
} from '../../actions/UserActions';
import { getCountryCodesList } from '../../actions/ConfigActions';

import { RHHUB } from '../../common/constants';
import { rhHUb } from '../../common/rbHub';

const { Option } = Select;

class ElderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.genderMapping = {
      1: 'Male',
      2: 'Female',
      1: 'Male',
      2: 'Female',
    };
    this.state = {
      editProfile: false,
      countryCodesList: [],
      showZohoFields: false,
      medicalConditionsList: [],
      isDifferentWhatsAppNumber: 'no',
      isWhatsAppNumberVerified: 0,
      is_active: false,
      nok_briefing_date: null,
      elder_briefing_date: null,
      welcome_pack_date: null,
      sensor: '',
      formData: {
        dob: null,
        mobileNumber: null,
        age: null,
        userID: null,
        lastName: '',
        currency: '',
        bedrooms: '',
        nok_name: '',
        nok_email: '',
        firstName: '',
        nok_phone: '',
        home_type: '',
        imageURL: null,
        bloodGroup: '',
        nri_status: '',
        created_by: '',
        modified_by: '',
        data_source: '',
        lead_source: '',
        owner_name: '',
        salutation: '',
        spouse_name: '',
        ad_set_name: '',
        google_link: '',
        allergies: [''],
        sales_status: '',
        af21_remarks: '',
        lead_date: null,
        locationCode: '',
        image_uuid: null,
        spouse_dob: null,
        countryCode: '91',
        customer_type: '',
        sales_remarks: '',
        other_service: '',
        other_remarks: '',
        campaign_name: '',
        service_length: '',
        form_source_url: '',
        payment_status: '',
        payment_source: '',
        marital_status: '',
        proceed_to_af2b: '',
        proceed_to_af2a: '',
        product_package: '',
        showZohoData: false,
        lead_sub_source: '',
        who_did_you_meet: '',
        lead_third_stage: '',
        covid_diposition: '',
        lead_first_stage: '',
        lead_second_stage: '',
        lead_fourth_stage: '',
        target_group_type: '',
        select_days_month: '',
        interested_service: '',
        most_liked_feature: '',
        assessment_date: null,
        service_end_date: null,
        sensor_installation: '',
        relationship_with_elder: '',
        current_living_condition: '',
        last_name_customer_calling: '',
        appointment_created_date: null,
        first_name_customer_calling: '',
        current_medical_conditions: [''],
        primary_emergency_contact_name: '',
        primary_emergency_contact_number: '',
        secondary_emergency_contact_name: '',
        secondary_emergency_contact_number: '',
        is_nok_the_primary_emergency_contact: '',
        whatsapp_country_code: '91',
        whatsapp_mobile_number: '',
        languages: [],
        other_language: '',
        elder_briefing: 0,
        nok_briefing: false,
        welcome_pack: 0,
        rhHub: '',
      },
      currentPage: 0,
      searchText: '',
      isMoreAvailable: false,
      notes: '',
      is_real_elder: '',
    };

    this.elderDetailsDataManager = new ElderDetailsDataManager();
    this.rendeNotes = this.rendeNotes.bind(this);
  }

  getGenderMapping = value => {
    const stringIntMapping = {
      1: 1,
      2: 2,
      1: 1,
      2: 2,
    };
    return stringIntMapping[value];
  };

  componentDidMount() {
    this.props.startLoader();
    this.getElderData(this.props.currentElderIdentifier);
    this.getCountryCodesList();
    this.getElderNotesData();
  }

  getElderNotesData = () => {
    this.props.startLoader();

    const { currentPage, searchText } = this.state;

    const dataPayload = {
      page: currentPage,
      search: searchText,
      elderIdentifier: this.props.currentElderIdentifier,
    };

    this.elderDetailsDataManager
      .getElderNotes(dataPayload)
      .then(responseData => {
        this.props.stopLoader();
        this.setState({
          notes: responseData.data[0],
        });
        // Store Data Inside Storage
        this.props.fetchElderNotes(responseData.data);

        if (
          (dataPayload.page + 1) * responseData.meta.pagination.perPage <
          responseData.meta.pagination.total
        ) {
          this.setState({
            isMoreAvailable: true,
          });
        } else {
          this.setState({
            isMoreAvailable: false,
          });
        }
      })
      .catch(errorData => {
        this.props.stopLoader();
      });
  };

  getElderData = id => {
    this.elderDetailsDataManager
      .getElderData({ id })
      .then(responseData => {
        this.props.stopLoader();
        if (responseData.data && responseData.data.length) {
          this.props.getElderData(responseData.data[0]);
          this.setState({
            is_active: responseData.data[0].is_active,
            elder_briefing: responseData.data[0].owner.elder_briefing ? 1 : 0,
            nok_briefing: !!responseData.data[0].owner.nok_briefing,
            elder_briefing_date: responseData.data[0].owner.elder_briefing_date,
            nok_briefing_date: responseData.data[0].owner.nok_briefing_date,
            welcome_pack_date: responseData.data[0].owner.welcome_pack_date,
            welcome_pack: responseData.data[0].owner.welcome_pack,
            isWhatsAppNumberVerified:
              responseData.data[0].owner.is_whatsapp_verify,
            is_real_elder: responseData.data[0].owner.is_real_elder,
          });
        }
      })
      .catch(errorData => {
        this.props.stopLoader();
        this.props.openNotification(
          'Error',
          errorData.response.data.message,
          0,
        );
      });
  };

  handleUploadedImage = imageIdentifier => {
    this.setState(state => ({
      ...state,
      formData: { ...state.formData, image_uuid: imageIdentifier },
    }));
  };

  getCountryCodesList() {
    const include = 'relationships,medical_conditions';

    this.props
      .getCountryCodesList(include)
      .then(result => {
        this.setState({
          countryCodesList: result.country_codes,
          relationshipsList: result.relationships,
          medicalConditionsList: [...result.medical_conditions],
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

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

  handleSetStateValue = (field, e) => {
    const { value } = e.currentTarget;
    if (value === 'no') {
      this.setState(state => ({
        ...state,
        [field]: value,
        formData: {
          ...state.formData,
          whatsapp_country_code: '91',
          whatsapp_mobile_number: '',
        },
      }));
    } else {
      this.setState({
        [field]: value,
      });
    }
  };

  setLanguages = language => {
    this.setStateValues('languages', language);
  };

  setStateValues = (field, e) => {
    let value;
    if (
      field === 'countryCode' ||
      field === 'whatsapp_country_code' ||
      field === 'languages'
    ) {
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
    const { formData } = this.state;
    formData[`${field}`] = value;
    this.setState({ formData });
    if (field === 'languages') {
      if (!this.state.formData.languages.includes('Other')) {
        this.setState(state => ({
          ...state,
          other_language: '',
        }));
      }
    }
  };

  getGenderMapping = value => {
    const stringIntMapping = {
      1: 1,
      2: 2,
      1: 1,
      2: 2,
    };
    return stringIntMapping[value];
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
      gender,
    } = this.props.elderData;

    let dob;
    let blood_group;
    let locationCode;

    const newCurrentMedicalConditionsArr = [];
    if (owner) {
      dob = owner.dob;
      blood_group = owner.blood_group;
      locationCode = owner.location_code;

      const currentMedicalConditionsArr = owner.current_medical_conditions;
      for (let index = 0; index < currentMedicalConditionsArr.length; index++) {
        newCurrentMedicalConditionsArr.push(currentMedicalConditionsArr[index]);
      }
    }

    formData = {
      dob,
      image_uuid: null,
      lastName: last_name,
      imageURL: image_url,
      firstName: first_name,
      bloodGroup: blood_group,
      nok_name: owner.nok_name,
      currency: owner.currency,
      languages: owner.languages,
      other_language: owner.other_language,
      gender: this.getGenderMapping(gender),
      bedrooms: owner.bedrooms,
      nok_phone: owner.nok_phone,
      nok_email: owner.nok_email,
      lead_date: owner.lead_date,
      locationCode,
      home_type: owner.home_type,
      mobileNumber: mobile_number,
      salutation: owner.salutation,
      spouse_dob: owner.spouse_dob,
      owner_name: owner.owner_name,
      created_by: owner.created_by,
      nri_status: owner.nri_status,
      spouse_name: owner.spouse_name,
      ad_set_name: owner.ad_set_name,
      google_link: owner.google_link,
      lead_source: owner.lead_source,
      data_source: owner.data_source,
      modified_by: owner.modified_by,
      userID: this.props.elderData.id,
      af21_remarks: owner.af21_remarks,
      sales_status: owner.sales_status,
      age: owner.age ? owner.age : null,
      other_service: owner.other_service,
      campaign_name: owner.campaign_name,
      customer_type: owner.customer_type,
      sales_remarks: owner.sales_remarks,
      other_remarks: owner.other_remarks,
      payment_status: owner.payment_status,
      payment_source: owner.payment_source,
      service_length: owner.service_length,
      marital_status: owner.marital_status,
      form_source_url: owner.form_source_url,
      proceed_to_af2b: owner.proceed_to_af2b,
      assessment_date: owner.assessment_date,
      proceed_to_af2a: owner.proceed_to_af2a,
      product_package: owner.product_package,
      lead_sub_source: owner.lead_sub_source,
      who_did_you_meet: owner.who_did_you_meet,
      service_end_date: owner.service_end_date,
      lead_third_stage: owner.lead_third_stage,
      lead_first_stage: owner.lead_first_stage,
      covid_diposition: owner.covid_diposition,
      lead_second_stage: owner.lead_second_stage,
      select_days_month: owner.select_days_month,
      target_group_type: owner.target_group_type,
      lead_fourth_stage: owner.lead_fourth_stage,
      interested_service: owner.interested_service,
      most_liked_feature: owner.most_liked_feature,
      sensor_installation: owner.sensor_installation,
      countryCode: country_code || '91',
      relationship_with_elder: owner.relationship_with_elder,
      appointment_created_date: owner.appointment_created_date,
      current_living_condition: owner.current_living_condition,
      first_name_customer_calling: owner.first_name_customer_calling,
      last_name_customer_calling: owner.last_name_customer_calling,
      is_nok_the_primary_emergency_contact:
        owner.is_nok_the_primary_emergency_contact,
      primary_emergency_contact_name: owner.primary_emergency_contact_name,
      primary_emergency_contact_number: owner.primary_emergency_contact_number,
      secondary_emergency_contact_number:
        owner.secondary_emergency_contact_number,
      secondary_emergency_contact_name: owner.secondary_emergency_contact_name,
      allergies: owner.allergies.length !== 0 ? owner.allergies : [''],
      current_medical_conditions:
        newCurrentMedicalConditionsArr.length !== 0
          ? newCurrentMedicalConditionsArr
          : [''],
      whatsapp_country_code: owner.whatsapp_country_code
        ? owner.whatsapp_country_code
        : '91',
      whatsapp_mobile_number: owner.whatsapp_mobile_number,
      rhHub: owner.rh_hub,
    };

    const isDifferentWhatsAppNumber = owner.whatsapp_mobile_number
      ? 'yes'
      : 'no';

    this.setState({ formData, isDifferentWhatsAppNumber });
  };

  editProfileHandler = () => {
    const {
      mobileNumber,
      countryCode,
      whatsapp_country_code,
      whatsapp_mobile_number,
      nok_phone,
      primary_emergency_contact_number,
      secondary_emergency_contact_number,
      languages,
      other_language,
      rhHub,
    } = this.state.formData;
    const isFormValid = this.elderDetailsDataManager.editProfileValidator(
      this.state.formData,
      this.state.isDifferentWhatsAppNumber,
    );
    const regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    const mobileRegex = /^[0-9]*$/;
    const zohoregx = /^[0-9]{6,14}$/;

    if (mobileNumber === null || mobileNumber === '') {
      return this.openNotification('Error', 'Mobile number is required.', 0);
    }

    // this.state.formData.mobileNumber = this.state.formData.mobileNumber.replace(
    //   /-/g,
    //   ''
    // );

    if (!mobileRegex.test(mobileNumber)) {
      return this.openNotification('Error', 'Mobile number is invalid.', 0);
    }

    const formatted_mobile_number = `+${countryCode}${mobileNumber}`;

    if (!regex.test(formatted_mobile_number))
      return this.openNotification('Error', 'Mobile number is invalid.', 0);

    // whatsapp phone number validation
    if (
      this.state.isDifferentWhatsAppNumber === 'yes' &&
      (!whatsapp_country_code || !whatsapp_mobile_number)
    ) {
      return this.openNotification(
        'Error',
        'Whatsapp Mobile Number is required',
        0,
      );
    }

    // this.state.formData.whatsapp_mobile_number = this.state.formData.whatsapp_mobile_number.replace(
    //   /-/g,
    //   ''
    // );

    // if (
    //   this.state.isDifferentWhatsAppNumber === 'yes' &&
    //   !mobileRegex.test(whatsapp_mobile_number)
    // ) {
    //   return this.openNotification(
    //     'Error',
    //     'whatsapp mobile number is invalid.',
    //     0
    //   );
    // }

    const formatted_whatsapp_mobile_number = `+${whatsapp_country_code}${whatsapp_mobile_number}`;

    // error notification when the length of the number is more than that of the regx . Number should be in range of 5-14 digit.
    // if (
    //   this.state.isDifferentWhatsAppNumber === 'yes' &&
    //   !regex.test(formatted_whatsapp_mobile_number)
    // )
    //   return this.openNotification(
    //     'Error',
    //     'whatsapp mobile number is invalid.',
    //     0
    //   );

    // zoho  NOk phone number validation

    if (
      this.state.showZohoFields === true &&
      nok_phone &&
      !zohoregx.test(nok_phone)
    ) {
      return this.openNotification('Error', 'Nok phone not valid', 0);
    }
    // zoho nok primary emergency contact

    if (
      this.state.showZohoFields === true &&
      primary_emergency_contact_number &&
      !zohoregx.test(primary_emergency_contact_number)
    ) {
      return this.openNotification(
        'Error',
        'Nok primary emergency contact number not valid',
        0,
      );
    }
    // zoho secondary emergency contact

    if (
      this.state.showZohoFields === true &&
      secondary_emergency_contact_number &&
      !zohoregx.test(secondary_emergency_contact_number)
    ) {
      return this.openNotification(
        'Error',
        'Nok  secondary emergency contact number not valid',
        0,
      );
    }

    if (!isFormValid) {
      return this.props.openNotification(
        'Error',
        'You have either missed a field or data is in incorrect format. Please check and try again.',
        0,
      );
    }
    this.state.formData.is_whatsapp_verify = this.state.isWhatsAppNumberVerified;
    this.props.startLoader();
    this.elderDetailsDataManager
      .editElderProfile(this.state.formData)
      .then(res => {
        this.props.openNotification(
          'Success',
          'Profile Updated Successfully.',
          1,
        );
        this.setState({ editProfile: false });
        this.getElderData(this.props.elderData.id);
      })
      .catch(error => {
        this.props.stopLoader();
        this.props.openNotification('Error', error.response.data.message, 0);
      });
  };

  handleAllergyUpdate = (index, fieldValue) => {
    const updatedAllergies = this.state.formData.allergies;
    updatedAllergies[index] = fieldValue;

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        allergies: updatedAllergies,
      },
    }));
  };

  handleAddAllergyRow = () => {
    const updatedAllergies = this.state.formData.allergies;
    updatedAllergies.push('');

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        allergies: updatedAllergies,
      },
    }));
  };

  handleRemoveAllergyRow = removeIndex => {
    let updatedAllergies = this.state.formData.allergies;

    updatedAllergies = updatedAllergies.filter(
      (item, index) => index !== removeIndex,
    );

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        allergies: updatedAllergies,
      },
    }));
  };

  handleCMCUpdate = (index, fieldValue) => {
    const updatedCurrentMedicalConditions = this.state.formData
      .current_medical_conditions;
    updatedCurrentMedicalConditions[index] = fieldValue;

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        current_medical_conditions: updatedCurrentMedicalConditions,
      },
    }));
  };

  handleAddCMCRow = () => {
    const updatedCurrentMedicalConditions = this.state.formData
      .current_medical_conditions;
    updatedCurrentMedicalConditions.push('');

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        current_medical_conditions: updatedCurrentMedicalConditions,
      },
    }));
  };

  handleRemoveCMCRow = removeIndex => {
    let updatedCurrentMedicalConditions = this.state.formData
      .current_medical_conditions;

    updatedCurrentMedicalConditions = updatedCurrentMedicalConditions.filter(
      (item, index) => index !== removeIndex,
    );

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        current_medical_conditions: updatedCurrentMedicalConditions,
      },
    }));
  };

  updateElderStatusHandler = () => {
    let elderStatus;
    if (this.state.is_active) elderStatus = 0;
    else elderStatus = 1;

    this.props.startLoader();

    this.props
      .updateUserStatus(this.props.currentElderIdentifier, elderStatus)
      .then(result => {
        this.setState({ is_active: elderStatus });
        this.props.stopLoader();
        this.props.openNotification('Success', 'Elder Status Updated', 1);
      })
      .catch(error => {
        this.props.stopLoader();

        this.props.openNotification('Error', error.message, 0);
      });
  };

  updateElderBriefingHandler = () => {
    let elderBriefing;
    if (this.state.elder_briefing) elderBriefing = 0;
    else elderBriefing = 1;

    this.props.startLoader();
    this.props
      .updateElderBriefingStatus(this.props.elderData.owner.id, elderBriefing)
      .then(result => {
        this.setState({
          elder_briefing: elderBriefing,
          elder_briefing_date: _.get(result, 'data[0].elder_briefing_date'),
        });
        this.props.stopLoader();
        this.props.openNotification('Success', 'Elder Briefing Updated', 1);
      })
      .catch(error => {
        this.props.stopLoader();

        this.props.openNotification('Error', error.message, 0);
      });
  };

  updateElderNokHandler = () => {
    let elderNok;
    if (this.state.nok_briefing) elderNok = 0;
    else elderNok = 1;

    this.props.startLoader();

    this.props
      .updateElderNokStatus(this.props.elderData.owner.id, elderNok)
      .then(result => {
        this.setState({
          nok_briefing: elderNok,
          nok_briefing_date: _.get(result, 'data[0].nok_briefing_date'),
        });
        this.props.stopLoader();
        this.props.openNotification('Success', 'Elder NOK Updated', 1);
      })
      .catch(error => {
        this.props.stopLoader();

        this.props.openNotification('Error', error.message, 0);
      });
  };

  updateWelcomPackHandler = () => {
    let welcomePack;
    if (this.state.welcome_pack) welcomePack = 0;
    else welcomePack = 1;

    this.props.startLoader();

    this.props
      .updateWelcomePackStatus(this.props.elderData.owner.id, welcomePack)
      .then(result => {
        this.setState({
          welcome_pack: welcomePack,
          welcome_pack_date: _.get(result, 'data[0].welcome_pack_date'),
        });
        this.props.stopLoader();
        this.props.openNotification('Success', 'Welcome Pack Updated', 1);
      })
      .catch(error => {
        this.props.stopLoader();

        this.props.openNotification('Error', error.message, 0);
      });
  };

  getElderPlanMapping = id => {
    const planMap = {
      1: 'Active',
      4: 'On Hold',
    };
    return planMap[id];
  };

  languageClean = languages => {
    const langs = languages.filter((item, index) => item !== 'Other');
    return langs.join(', ');
  };

  getWhatsAppNumberVerified = value => {
    if (value === true || value === 1 || value === '1') {
      return '1';
    }
    return '0';
  };

  rendeNotes(notes) {
    if (notes) {
      return (
        <Comment
          actions={[]}
          author={<a>{_.get(notes, 'admin_name', 'n/a')}</a>}
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt={_.get(notes, 'admin_name', '-')}
            />
          }
          content={<p>{_.get(notes, 'note', '-')}</p>}
          datetime={<span>{_.get(notes, 'updated_at', '-')}</span>}
        />
      );
    }
    return 'No notes found';
  }

  handleChange(value) {
    this.setState({ sensor: value });
  }

  rendeSensor() {
    return (
      <Select
        style={{ width: 280 }}
        onChange={event => this.handleChange(event)}
        value={this.state.sensor}
        getPopupContainer={trigger => trigger.parentNode}
      >
        <Option value="HOME_ALERT_CONTROLLER">HOME ALERT CONTROLLER</Option>
        <Option value="WIRELESS_PIR_MOTION_SENSOR_ALARM">
          WIRELESS PIR MOTION SENSOR ALARM
        </Option>
        <Option value="WIRELESS_DOOR/WINDOW_OPEN_SENSOR">
          WIRELESS DOOR/WINDOW OPEN SENSOR
        </Option>
        <Option value="WIRELESS_FIRE_AND_SMOKE_SENSOR">
          WIRELESS FIRE AND SMOKE SENSOR
        </Option>
        <Option value="WIRELESS_GAS_LEAKAGE_ALERT">
          WIRELESS GAS LEAKAGE ALERT
        </Option>
        <Option value="WIRELESS_PANIC_BUTTON_WITH_ROPE">
          WIRELESS PANIC BUTTON WITH ROPE
        </Option>
        <Option value="WIRELESS_SENSOR_REMOTE">WIRELESS SENSOR REMOTE</Option>
      </Select>
    );
  }

  changeRealPrimaryElder() {
    const payloadPrimary = {
      user_id: this.props.elderData.owner.id,
    };
    this.props.updatePrimaryElderStatus(payloadPrimary);
    this.setState({ is_real_elder: true });
  }

  render() {
    const { formData, notes } = this.state;
    const { elderData } = this.props;
    const currentDate = moment();
    const elderCreatedAt = moment(get(elderData, 'created_at', ''));

    return (
      <Card bordered className="elder-details" style={{ maxWidth: '100%', marginBottom: 0 }}>
        <div className="row">
          <div className="col-12">
            <div className="elder-details-area elder-account-area">
              <h4>Account Details</h4>
              <div className="status-toggle">
                <span className="status-toggle-param">Age of Record:</span>
                <strong className="status-toggle-value">
                  {currentDate.diff(elderCreatedAt, 'days')} Days
                </strong>
              </div>
              <div className="status-toggle">
                <span className="status-toggle-param">Created At:</span>
                <span className="status-toggle-value">
                  {moment(get(elderData, 'created_at', '')).format(
                    'DD/MM/YYYY',
                  )}
                </span>
              </div>
              <div className="status-toggle">
                <span className="status-toggle-param">Acquisition Source:</span>
                <span className="status-toggle-value">
                  {elderData && elderData.acquisition
                    ? elderData.acquisition
                    : 'N/A'}
                </span>
              </div>

              <div className="status-toggle">
                <span className="status-toggle-param">
                  Registration Source:
                </span>
                <span className="status-toggle-value">
                  {elderData && elderData.source ? elderData.source : 'N/A'}
                </span>
              </div>

              <div className="status-toggle">
                <span className="status-toggle-param">
                  Elder Account Status:
                </span>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  checked={!!this.state.is_active}
                  onChange={() => this.updateElderStatusHandler()}
                  disabled={checkIsErmOrErmSuperVisorElderActive(
                    this.props.user,
                    elderData,
                  )}
                />
              </div>
              <div className="status-toggle">
                <span className="status-toggle-param">Primary Elder:</span>
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled={
                    this.state.is_real_elder ||
                    checkIsErmOrErmSuperVisor(this.props.user, elderData)
                  }
                  onChange={() => this.changeRealPrimaryElder()}
                />
              </div>
              {/* <div className="status-toggle">
                <span className="status-toggle-param">Elder briefing:</span>
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  checked={!!this.state.elder_briefing}
                  onChange={e =>
                    !this.state.elder_briefing &&
                    this.updateElderBriefingHandler()
                  }
                  disabled={checkIsErmOrErmSuperVisor(
                    this.props.user,
                    elderData,
                  )}
                />
                <span>
                  {' '}
                  {this.state.elder_briefing_date &&
                    moment(this.state.elder_briefing_date).format(
                      'dddd, MMMM Do YYYY',
                    )}
                </span>
              </div> */}
              {/* <div className="status-toggle">
                <span className="status-toggle-param">NOK briefing:</span>
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  checked={!!this.state.nok_briefing}
                  onChange={e => this.updateElderNokHandler()}
                  disabled={checkIsErmOrErmSuperVisor(
                    this.props.user,
                    elderData,
                  )}
                />
                <br />
                <span>
                  {' '}
                  {this.state.nok_briefing_date &&
                    moment(this.state.nok_briefing_date).format(
                      'dddd, MMMM Do YYYY hh:mm:ss a',
                    )}
                </span>
              </div> */}
              {/* <div className="status-toggle">
                <span className="status-toggle-param">Welcome pack:</span>
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  checked={this.state.welcome_pack}
                  onChange={e =>
                    !this.state.welcome_pack && this.updateWelcomPackHandler()
                  }
                  disabled={checkIsErmOrErmSuperVisor(
                    this.props.user,
                    elderData,
                  )}
                />
                <br />
                <span>
                  {this.state.welcome_pack_date &&
                    moment(this.state.welcome_pack_date).format(
                      'dddd, MMMM Do YYYY hh:mm:ss a',
                    )}
                </span>
              </div> */}

              {/* <div className="status-toggle">
                <span className="status-toggle-param">RH Hub:</span>
                <span className="status-toggle-param">
                  {rhHUb(_.toInteger(_.get(elderData, 'owner.rh_hub', 0)))}
                </span>
              </div> */}
              <div className="status-toggle">
                <span className="status-toggle-param">Notes:</span>
                {this.rendeNotes(notes)}
              </div>
              {/* <Sensor elderData={elderData} /> */}
              {/* <div className="status-toggle">
                <span className="status-toggle-param">Plan Name:</span>
                <span className="status-toggle-value">
                  {elderData &&
                    elderData.owner &&
                    elderData.owner.plan &&
                    elderData.owner.plan.length > 0
                    ? elderData.owner.plan[0].name
                    : 'N/A'}
                </span>
              </div> */}
              {/* <div className="status-toggle">
                <span className="status-toggle-param">Plan Status:</span>
                <span className="status-toggle-value">
                  {elderData &&
                    elderData.owner &&
                    elderData.owner.plan &&
                    elderData.owner.plan.length > 0
                    ? this.getElderPlanMapping(elderData.owner.plan[0].status)
                    : 'N/A'}
                </span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="row">
          {/* <div className="col-12 col-sm-5">
            <div className="elder-details-area">
              <h4>User Details</h4>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">First Name: </span>
                <span className="detail-item-value">
                  {_.get(elderData, 'first_name')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Last Name:</span>
                <span className="detail-item-value">
                  {_.get(elderData, 'last_name')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Contact Number</span>
                <span className="detail-item-value">
                  {_.get(elderData, 'mobile_number')
                    ? `+${_.get(elderData, 'country_code')}-${_.get(
                        elderData,
                        'mobile_number',
                      )}`
                    : `${_.get(elderData, 'last_name')}`}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Whatsapp Number</span>
                <span className="detail-item-value">
                  <>
                    {_.get(elderData, 'owner.whatsapp_mobile_number', false)
                      ? `+${_.get(
                          elderData,
                          'owner.whatsapp_country_code',
                        )}-${_.get(elderData, 'owner.whatsapp_mobile_number')}`
                      : `+${_.get(elderData, 'country_code')}-${_.get(
                          elderData,
                          'mobile_number',
                        )}`}
                    {_.get(elderData, 'owner.is_whatsapp_verify', false) ? (
                      <span>
                        {' '}
                        | Verified Yes (
                        <FontAwesomeIcon color="green" icon={faCheck} />)
                      </span>
                    ) : (
                      <span>
                        {' '}
                        | Verified No (
                        <FontAwesomeIcon color="red" icon={faTimes} />)
                      </span>
                    )}
                  </>
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Gender:</span>
                <span className="detail-item-value">
                  {this.genderMapping[_.get(elderData, 'gender')]}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Date of Birth:</span>
                <span className="detail-item-value">
                  {_.get(elderData, 'owner.dob')
                    ? moment(_.get(elderData, 'owner.dob')).format(
                        'Do MMM, YYYY',
                      )
                    : ''}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Blood Group:</span>
                <span className="detail-item-value">
                  {_.get(elderData, 'owner.blood_group', 'N/A')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Location Code:</span>
                <span className="detail-item-value">
                  {_.get(elderData, 'owner.location_code', 'N/A')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Customer ID:</span>
                <span className="detail-item-value">
                  {_.get(elderData, 'owner.customer_id', 'N/A')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Using App:</span>
                <span className="detail-item-value">
                  {_.get(elderData, 'app_using') !== null ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Preferred Languages: </span>
                <span className="detail-item-value">
                  {elderData &&
                  elderData.owner &&
                  elderData.owner.languages.length > 0
                    ? this.languageClean(elderData.owner.languages)
                    : 'N/A'}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Other Langauge:</span>
                <span className="detail-item-value">
                  {_.get(elderData, 'owner.other_language') || 'N/A'}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <Button
                  onClick={() => this.triggerEditProfile()}
                  type="button"
                  className="btn btn-link"
                  disabled={checkIsErmOrErmSuperVisor(
                    this.props.user,
                    elderData,
                  )}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit Details
                </Button>
              </div>

              {elderData && elderData.zoho_object ? (
                <div className="detail-item d-flex align-items-center justify-content-start">
                  <Button
                    onClick={() =>
                      this.setState({
                        showZohoData: !this.state.showZohoData,
                      })
                    }
                    type="button"
                    className="btn btn-link"
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
          </div> */}
          <div className="col-12 col-sm-7">
            {this.state.editProfile ? (
              <div className="elder-details-area">
                <h4>Edit Information</h4>

                <div className="row">
                  <div className="col-12 col-sm-4">
                    <Form.Group controlId="displayPicture">
                      <Form.Label>Display Picture</Form.Label>

                      <ImageUploader
                        type="Media"
                        file_type="2"
                        owner_type="User"
                        uploadTitle="No Photo"
                        image_url={formData.imageURL}
                        stopLoader={this.props.stopLoader}
                        startLoader={this.props.startLoader}
                        openNotification={this.props.openNotification}
                        onImageUpload={this.handleUploadedImage}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>

                      <Form.Control
                        type="text"
                        value={formData.firstName}
                        onChange={e => this.setStateValues('firstName', e)}
                        placeholder="Vijay"
                      />
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Singh"
                        value={formData.lastName}
                        onChange={e => this.setStateValues('lastName', e)}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="elder_gender">
                      <Form.Label>Gender</Form.Label>

                      <Form.Control
                        as="select"
                        value={formData.gender}
                        onChange={e => this.setStateValues('gender', e)}
                      >
                        <option value={1}>Male</option>
                        <option value={2}>Female</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="elderDateOfBirth">
                      <Form.Label>Date of Birth</Form.Label>
                      <DatePicker
                        defaultValue={
                          formData.dob != null
                            ? moment(formData.dob, 'YYYY-MM-DD')
                            : null
                        }
                        onChange={e => this.setStateValues('dob', e)}
                        disabledDate={d => d.isAfter(moment())}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="elderContactNumber">
                      <Form.Label>Contact Number</Form.Label>
                      <div className="d-flex justify-content-start">
                        <Select
                          showSearch
                          style={{ width: 125, marginRight: '8px' }}
                          notFoundContent={null}
                          showArrow={false}
                          defaultValue={formData.countryCode}
                          optionFilterProp="children"
                          onChange={value =>
                            this.setStateValues('countryCode', value)
                          }
                          placeholder="Please search for a country code"
                          filterOption={(input, option) =>
                            option.props.children
                              .toString()
                              .toLowerCase()
                              .indexOf(input)
                              .toString()
                              .toLowerCase() >= 0
                          }
                          disabled={this.state.editProfile}
                        >
                          {this.state.countryCodesList.map((code, index) => (
                            <Select.Option key={code} value={code}>
                              +{code}
                            </Select.Option>
                          ))}
                        </Select>
                        <Form.Control
                          type="number"
                          className="no-arrow"
                          value={formData.mobileNumber}
                          placeholder="9876543210"
                          onChange={e => this.setStateValues('mobileNumber', e)}
                          disabled={this.state.editProfile}
                        />
                      </div>
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="elder_gender">
                      <Form.Label>Blood Group</Form.Label>

                      <Form.Control
                        as="select"
                        value={formData.bloodGroup}
                        onChange={e => this.setStateValues('bloodGroup', e)}
                      >
                        <option value="" disabled>
                          Please select a blood group
                        </option>
                        <option value="A">A</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B">B</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB">AB</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O">O</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <div className="multiparty-inputs">
                      <Form.Label>Allergies</Form.Label>

                      {formData.allergies &&
                        formData.allergies.length !== 0 &&
                        formData.allergies.map((item, index) => (
                          <div
                            className="multiparty-inputs-row d-flex align-items-center justify-content-start"
                            key={index}
                          >
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Allergy"
                                value={item}
                                onChange={event =>
                                  this.handleAllergyUpdate(
                                    index,
                                    event.target.value,
                                  )
                                }
                              />
                            </Form.Group>

                            <Button
                              type="button"
                              className="btn btn-link"
                              disabled={formData.allergies.length <= 1}
                              onClick={() => this.handleRemoveAllergyRow(index)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </div>
                        ))}

                      <Button
                        type="button"
                        className="btn btn-link"
                        onClick={() => this.handleAddAllergyRow()}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add Another
                      </Button>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="multiparty-inputs">
                      <Form.Label>Current Medical Conditions</Form.Label>

                      {formData.current_medical_conditions &&
                        formData.current_medical_conditions.length !== 0 &&
                        formData.current_medical_conditions.map(
                          (item, index) => (
                            <div
                              className="multiparty-inputs-row d-flex align-items-center justify-content-start"
                              key={index}
                            >
                              <Form.Group>
                                <Form.Control
                                  as="select"
                                  value={item}
                                  onChange={event =>
                                    this.handleCMCUpdate(
                                      index,
                                      event.target.value,
                                    )
                                  }
                                >
                                  <option value="">
                                    Select a medical condition
                                  </option>
                                  {this.state.medicalConditionsList &&
                                    this.state.medicalConditionsList.length &&
                                    this.state.medicalConditionsList.map(
                                      (medicalCondition, index) => (
                                        <option
                                          value={medicalCondition.itemKey}
                                          key={index}
                                        >
                                          {medicalCondition.label}
                                        </option>
                                      ),
                                    )}
                                </Form.Control>
                              </Form.Group>

                              <Button
                                type="button"
                                className="btn btn-link"
                                disabled={
                                  formData.current_medical_conditions.length <=
                                  1
                                }
                                onClick={() => this.handleRemoveCMCRow(index)}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </Button>
                            </div>
                          ),
                        )}

                      <Button
                        type="button"
                        className="btn btn-link"
                        onClick={() => this.handleAddCMCRow()}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add Another
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>Location Code</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="G1"
                        value={formData.locationCode}
                        onChange={e => this.setStateValues('locationCode', e)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>Different WhatsApp Number</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={e =>
                          this.handleSetStateValue(
                            'isDifferentWhatsAppNumber',
                            e,
                          )
                        }
                        value={this.state.isDifferentWhatsAppNumber}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>WhatsApp Number Verified?</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={e =>
                          this.handleSetStateValue(
                            'isWhatsAppNumberVerified',
                            e,
                          )
                        }
                        value={this.getWhatsAppNumberVerified(
                          this.state.isWhatsAppNumberVerified,
                        )}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6">
                    {this.state.isDifferentWhatsAppNumber === 'yes' && (
                      <Form.Group>
                        <Form.Label>Enter WhatsApp Number</Form.Label>
                        <div className="d-flex justify-content-start">
                          <Select
                            showSearch
                            style={{ width: 125, marginRight: '8px' }}
                            notFoundContent={null}
                            showArrow={false}
                            value={formData.whatsapp_country_code}
                            optionFilterProp="children"
                            onChange={value =>
                              this.setStateValues(
                                'whatsapp_country_code',
                                value,
                              )
                            }
                            placeholder="Please search for a country code"
                            filterOption={(input, option) =>
                              option.props.children
                                .toString()
                                .toLowerCase()
                                .indexOf(input)
                                .toString()
                                .toLowerCase() >= 0
                            }
                          >
                            {this.state.countryCodesList.map((code, index) => (
                              <Select.Option key={code} value={code}>
                                +{code}
                              </Select.Option>
                            ))}
                          </Select>
                          <Form.Control
                            type="number"
                            className="no-arrow"
                            value={formData.whatsapp_mobile_number}
                            placeholder="9876543210"
                            onChange={e =>
                              this.setStateValues('whatsapp_mobile_number', e)
                            }
                          />
                        </div>
                      </Form.Group>
                    )}
                  </div>
                </div>
                <LanguagesSpoken
                  option={this.state.formData.languages}
                  onChange={this.setLanguages}
                />

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="otherLanguage">
                      <Form.Label>Other Language</Form.Label>
                      <Form.Control
                        type="text"
                        disabled={
                          !this.state.formData.languages.includes('Other')
                        }
                        value={
                          this.state.formData.languages.includes('Other')
                            ? this.state.formData.other_language
                            : ''
                        }
                        placeholder="Other Langauge"
                        onChange={e => this.setStateValues('other_language', e)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>RH Hub</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={e => this.setStateValues('rhHub', e)}
                        value={this.state.formData.rhHub}
                      >
                        <option value=""> Select RH Hub</option>
                        {Object.keys(RHHUB).map(key => (
                          <option key={key} value={key}>
                            {RHHUB[key]}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Button
                      type="button"
                      className="btn btn-link"
                      onClick={() =>
                        this.setState({
                          showZohoFields: !this.state.showZohoFields,
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={this.state.showZohoFields ? faMinus : faPlus}
                      />{' '}
                      {this.state.showZohoFields
                        ? 'Hide Zoho Fields'
                        : 'Show Zoho Fields'}
                    </Button>
                  </div>
                </div>

                {this.state.showZohoFields && (
                  <React.Fragment>
                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>AF2.1 Remarks</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="AF2.1 Remarks"
                            value={formData.af21_remarks}
                            onChange={e =>
                              this.setStateValues('af21_remarks', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Lead Source</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Lead Source"
                            onChange={e =>
                              this.setStateValues('lead_source', e)
                            }
                            value={formData.lead_source}
                          >
                            <option value="-None-">-None-</option>
                            <option value="Seniority">Seniority</option>
                            <option value="RM Source">RM Source</option>
                            <option value="Doctor Referral">
                              Doctor Referral
                            </option>
                            <option value="RWA Activation">
                              RWA Activation
                            </option>
                            <option value="Business Partner">
                              Business Partner
                            </option>
                            <option value="EMOHA Ambassador">
                              EMOHA Ambassador
                            </option>
                            <option value="Digital Campaign">
                              Digital Campaign
                            </option>
                            <option value="Website">Website</option>
                            <option value="Internal Referral">
                              Internal Referral
                            </option>
                            <option value="Nursepreneur-Diksha">
                              Nursepreneur-Diksha
                            </option>
                            <option value="Nursepreneur-Vinod">
                              Nursepreneur-Vinod
                            </option>
                            <option value="Just Dial">Just Dial</option>
                            <option value="Emoha Event">Emoha Event</option>
                            <option value="Direct Call">Direct Call</option>
                            <option value="Walk In">Walk In</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Facebook Ads">Facebook Ads</option>
                            <option value="Facebook Messengers Ads">
                              Facebook Messengers Ads
                            </option>
                            <option value="Twitter">Twitter</option>
                            <option value="Youtube">Youtube</option>
                            <option value="Instagram">Instagram</option>
                            <option value="LinkedIN">LinkedIN</option>
                            <option value="Google Ad-words">
                              Google Ad-words
                            </option>
                            <option value="Employee Referral">
                              Employee Referral
                            </option>
                            <option value="Word of mouth">Word of mouth</option>
                            <option value="Cred">Cred</option>
                            <option value="Samvada">Samvada</option>
                            <option value="SMS">SMS</option>
                            <option value="Elder's_First_Emergency_Support">
                              Elder's_First_Emergency_Support
                            </option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Lead Sub Source</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Lead Sub Source"
                            onChange={e =>
                              this.setStateValues('lead_sub_source', e)
                            }
                            value={formData.lead_sub_source}
                          >
                            <option value="-None-">-None-</option>
                            <option value="Seniority">Seniority</option>
                            <option value="Website">Website</option>
                            <option value="Doctor Referral">
                              Doctor Referral
                            </option>
                            <option value="Events">Events</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Google">Google</option>
                            <option value="Word of Mouth">Word of Mouth</option>
                            <option value="Samvad">Samvad</option>
                            <option value="SMS">SMS</option>
                            <option value="Elder's_First_Emergency_Support">
                              Elder's_First_Emergency_Support
                            </option>
                            <option value="Email">Email</option>
                            <option value="Hospital">Hospital</option>
                            <option value="Marketing Display">
                              Marketing Display
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Lead Date</Form.Label>
                          <DatePicker
                            onChange={e => this.setStateValues('lead_date', e)}
                            defaultValue={
                              formData.lead_date
                                ? moment(formData.lead_date)
                                : null
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Data Source</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Data Source"
                            value={formData.data_source}
                            onChange={e =>
                              this.setStateValues('data_source', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Lead First Stage</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Lead first stage"
                            value={formData.lead_first_stage}
                            onChange={e =>
                              this.setStateValues('lead_first_stage', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Lead Second Stage</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Lead second stage"
                            value={formData.lead_second_stage}
                            onChange={e =>
                              this.setStateValues('lead_second_stage', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Lead Third Stage</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Lead third stage"
                            value={formData.lead_third_stage}
                            onChange={e =>
                              this.setStateValues('lead_third_stage', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Lead Fourth Stage</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Lead fourth stage"
                            value={formData.lead_fourth_stage}
                            onChange={e =>
                              this.setStateValues('lead_fourth_stage', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Customer Type</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Customer Type"
                            onChange={e =>
                              this.setStateValues('customer_type', e)
                            }
                            value={formData.customer_type}
                          >
                            <option value="-None-">-None-</option>
                            <option value="COMPLEMENTARY SERVICE">
                              COMPLEMENTARY SERVICE
                            </option>
                            <option value="EMOHA ASSURE">EMOHA ASSURE</option>
                            <option value="EMOHA SMART CARE">
                              EMOHA SMART CARE
                            </option>
                            <option value="EMOHA SMART SENSOR BOX">
                              EMOHA SMART SENSOR BOX
                            </option>
                            <option value="EPOCH ASSISTED LIVING">
                              EPOCH ASSISTED LIVING
                            </option>
                            <option value="Assure Empower">
                              Assure Empower
                            </option>
                            <option value="Empower_2">Empower_2</option>
                            <option value="Elder's First">Elder's First</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Interested Service</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Interested Service"
                            value={formData.interested_service}
                            onChange={e =>
                              this.setStateValues('interested_service', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Elder's NRI Status</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Elder's NRI Status"
                            onChange={e => this.setStateValues('nri_status', e)}
                            value={formData.nri_status}
                          >
                            <option value="-None-">-None-</option>
                            <option value="Kids are NRI">Kids are NRI</option>
                            <option value="Elder are an NRI">
                              Elder are an NRI
                            </option>
                            <option value="Not an NRI">Not an NRI</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Sensor Installation</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Sensor Installation"
                            value={formData.sensor_installation}
                            onChange={e =>
                              this.setStateValues('sensor_installation', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Sales Remarks</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Sales Remarks"
                            value={formData.sales_remarks}
                            onChange={e =>
                              this.setStateValues('sales_remarks', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Other Remarks</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.other_remarks}
                            placeholder="Other Remarks"
                            onChange={e =>
                              this.setStateValues('other_remarks', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Relationship with Elder</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Relationship with Elder"
                            value={formData.relationship_with_elder}
                            onChange={e =>
                              this.setStateValues('relationship_with_elder', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Marital Status</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Marital Status"
                            value={formData.marital_status}
                            onChange={e =>
                              this.setStateValues('marital_status', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Home Type</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Home Type"
                            value={formData.home_type}
                            onChange={e => this.setStateValues('home_type', e)}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Number of Bedrooms</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Number of Bedrooms"
                            value={formData.bedrooms}
                            onChange={e => this.setStateValues('bedrooms', e)}
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Most Liked Feature</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Most Liked Feature"
                            onChange={e =>
                              this.setStateValues('most_liked_feature', e)
                            }
                            value={formData.most_liked_feature}
                          >
                            <option value="-None-">-None-</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Doctor visit">Doctor visit</option>
                            <option value="Physio visit">Physio visit</option>
                            <option value="Dietitian calls">
                              Dietitian calls
                            </option>
                            <option value="Safety sensors">
                              Safety sensors
                            </option>
                            <option value="Engagement">Engagement</option>
                            <option value="Support services">
                              Support services
                            </option>
                            <option value="Grocery_Related_Deliveries">
                              Grocery_Related_Deliveries
                            </option>
                            <option value="Chemist_Related_Deliveries">
                              Chemist_Related_Deliveries
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Covid Diposition</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Covid Diposition"
                            onChange={e =>
                              this.setStateValues('covid_diposition', e)
                            }
                            value={formData.covid_diposition}
                          >
                            <option value="-None-">-None-</option>
                            <option value="Webadmin_Ticket">
                              Webadmin_Ticket
                            </option>
                            <option value="Non_Contact">Non_Contact</option>
                            <option value="Requested_CB">Requested_CB</option>
                            <option value="General Enquiry">
                              General Enquiry
                            </option>
                            <option value="NI_Hungup">NI_Hungup</option>
                            <option value="Dropped">Dropped</option>
                            <option value="Living with Family">
                              Living with Family
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Proceed to AF2.A</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Proceed to AF2.A"
                            onChange={e =>
                              this.setStateValues('proceed_to_af2a', e)
                            }
                            value={formData.proceed_to_af2a}
                          >
                            <option value="-None-">-None-</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Proceed to AF2.B</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Proceed to AF2.B"
                            onChange={e =>
                              this.setStateValues('proceed_to_af2b', e)
                            }
                            value={formData.proceed_to_af2b}
                          >
                            <option value="-None-">-None-</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Currency</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Currency"
                            value={formData.currency}
                            onChange={e => this.setStateValues('currency', e)}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Target group type</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Target group type"
                            value={formData.target_group_type}
                            onChange={e =>
                              this.setStateValues('target_group_type', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Who did you meet</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Who did you meet"
                            value={formData.who_did_you_meet}
                            onChange={e =>
                              this.setStateValues('who_did_you_meet', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Salutation</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Salutation"
                            value={formData.salutation}
                            onChange={e => this.setStateValues('salutation', e)}
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Spouse Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Spouse Name"
                            value={formData.spouse_name}
                            onChange={e =>
                              this.setStateValues('spouse_name', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Spouse DOB</Form.Label>
                          <DatePicker
                            onChange={e => this.setStateValues('spouse_dob', e)}
                            defaultValue={
                              formData.spouse_dob
                                ? moment(formData.spouse_dob)
                                : null
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>
                            First Name of Customer Calling
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="First Name of Customer Calling"
                            value={formData.first_name_customer_calling}
                            onChange={e =>
                              this.setStateValues(
                                'first_name_customer_calling',
                                e,
                              )
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Last Name of Customer Calling</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Last Name of Customer Calling"
                            value={formData.last_name_customer_calling}
                            onChange={e =>
                              this.setStateValues(
                                'last_name_customer_calling',
                                e,
                              )
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Product Package</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Product Package"
                            value={formData.product_package}
                            onChange={e =>
                              this.setStateValues('product_package', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Payment Status</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Payment Status"
                            onChange={e =>
                              this.setStateValues('payment_status', e)
                            }
                            value={formData.payment_status}
                          >
                            <option value="-None-">-None-</option>
                            <option value="Payment Received">
                              Payment Received
                            </option>
                            <option value="Partial Received">
                              Partial Received
                            </option>
                            <option value="Payment Pending">
                              Payment Pending
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Service Length</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Service Length"
                            onChange={e =>
                              this.setStateValues('service_length', e)
                            }
                            value={formData.service_length}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Service End Date</Form.Label>
                          <DatePicker
                            onChange={e =>
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

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Select Days/Month</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Select Days/Month"
                            value={formData.select_days_month}
                            onChange={e =>
                              this.setStateValues('select_days_month', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Other Service</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Other Service"
                            value={formData.other_service}
                            onChange={e =>
                              this.setStateValues('other_service', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Ad Set Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ad Set Name"
                            value={formData.ad_set_name}
                            onChange={e =>
                              this.setStateValues('ad_set_name', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Campaign Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Campaign Name"
                            value={formData.campaign_name}
                            onChange={e =>
                              this.setStateValues('campaign_name', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Form Source URL</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Form Source URL"
                            value={formData.form_source_url}
                            onChange={e =>
                              this.setStateValues('form_source_url', e)
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Google Link</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Google Link"
                            value={formData.google_link}
                            onChange={e =>
                              this.setStateValues('google_link', e)
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Appointment Created Date</Form.Label>
                          <DatePicker
                            onChange={e =>
                              this.setStateValues('appointment_created_date', e)
                            }
                            defaultValue={
                              formData.appointment_created_date
                                ? moment(formData.appointment_created_date)
                                : null
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Assessment Date</Form.Label>
                          <DatePicker
                            onChange={e =>
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

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>NOK Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="NOK Name"
                            value={formData.nok_name}
                            onChange={e => this.setStateValues('nok_name', e)}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>NOK Email</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="NOK Email"
                            value={formData.nok_email}
                            onChange={e => this.setStateValues('nok_email', e)}
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderContactNumber">
                          <Form.Label>NOK Phone</Form.Label>
                          <div className="d-flex justify-content-start">
                            <Select
                              showSearch
                              style={{ width: 125, marginRight: '8px' }}
                              notFoundContent={null}
                              showArrow={false}
                              defaultValue={formData.countryCode}
                              optionFilterProp="children"
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
                                (code, index) => (
                                  <Select.Option key={code} value={code}>
                                    +{code}
                                  </Select.Option>
                                ),
                              )}
                            </Select>
                            <Form.Control
                              type="number"
                              className="no-arrow"
                              placeholder="NOK Phone"
                              value={formData.nok_phone}
                              onChange={e =>
                                this.setStateValues('nok_phone', e)
                              }
                            />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>
                            Is NOK the Primary Emergency Contact
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Is NOK the Primary Emergency Contact"
                            value={
                              formData.is_nok_the_primary_emergency_contact
                            }
                            onChange={e =>
                              this.setStateValues(
                                'is_nok_the_primary_emergency_contact',
                                e,
                              )
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>
                            Primary Emergency Contact Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Primary Emergency Contact Name"
                            value={formData.primary_emergency_contact_name}
                            onChange={e =>
                              this.setStateValues(
                                'primary_emergency_contact_name',
                                e,
                              )
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>
                            Primary Emergency Contact Number
                          </Form.Label>
                          <div className="d-flex justify-content-start">
                            <Select
                              showSearch
                              style={{ width: 125, marginRight: '8px' }}
                              notFoundContent={null}
                              showArrow={false}
                              defaultValue={formData.countryCode}
                              optionFilterProp="children"
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
                                (code, index) => (
                                  <Select.Option key={code} value={code}>
                                    +{code}
                                  </Select.Option>
                                ),
                              )}
                            </Select>
                            <Form.Control
                              type="number"
                              className="no-arrow"
                              placeholder="Primary Emergency Contact Number"
                              value={formData.primary_emergency_contact_number}
                              onChange={e =>
                                this.setStateValues(
                                  'primary_emergency_contact_number',
                                  e,
                                )
                              }
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>
                            Secondary Emergency Contact Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Secondary Emergency Contact Name"
                            value={formData.secondary_emergency_contact_name}
                            onChange={e =>
                              this.setStateValues(
                                'secondary_emergency_contact_name',
                                e,
                              )
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>
                            Secondary Emergency Contact Number
                          </Form.Label>
                          <div className="d-flex justify-content-start">
                            <Select
                              showSearch
                              style={{ width: 125, marginRight: '8px' }}
                              notFoundContent={null}
                              showArrow={false}
                              defaultValue={formData.countryCode}
                              optionFilterProp="children"
                              placeholder="Please search for a country code"
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
                                (code, index) => (
                                  <Select.Option key={code} value={code}>
                                    +{code}
                                  </Select.Option>
                                ),
                              )}
                            </Select>
                            <Form.Control
                              type="number"
                              className="no-arrow"
                              placeholder="Secondary Emergency Contact Number"
                              value={
                                formData.secondary_emergency_contact_number
                              }
                              onChange={e =>
                                this.setStateValues(
                                  'secondary_emergency_contact_number',
                                  e,
                                )
                              }
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Sales Status</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Sales Status"
                            value={formData.sales_status}
                            onChange={e =>
                              this.setStateValues('sales_status', e)
                            }
                          >
                            <option value="-None-">-None-</option>
                            <option value="Price Negotiation">
                              Price Negotiation
                            </option>
                            <option value="Active">Active</option>
                            <option value="Dropped">Dropped</option>
                            <option value="Service Completed">
                              Service Completed
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </div>

                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Payment Source</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Payment Source"
                            value={formData.payment_source}
                            onChange={e =>
                              this.setStateValues('payment_source', e)
                            }
                          >
                            <option value="-None-">-None-</option>
                            <option value="Razor Pay">Razor Pay</option>
                            <option value="Website">Website</option>
                            <option value="Emoha_App">Emoha_App</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Machine Pay">Machine Pay</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Current Living Condition</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Current Living Condition"
                            value={formData.current_living_condition}
                            onChange={e =>
                              this.setStateValues('current_living_condition', e)
                            }
                          >
                            <option value="-None-">-None-</option>
                            <option value="Lives Alone">Lives Alone</option>
                            <option value="Lives With Spouse">
                              Lives With Spouse
                            </option>
                            <option value="Lives With Son">
                              Lives With Son
                            </option>
                            <option value="Lives With Daughter">
                              Lives With Daughter
                            </option>
                            <option value="Lives With paid helper">
                              Lives With paid helper
                            </option>

                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>

                      <div className="col-12 col-sm-6">
                        <Form.Group controlId="elderLastName">
                          <Form.Label>Age</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Age"
                            value={formData.age}
                            onChange={e => this.setStateValues('age', e)}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </React.Fragment>
                )}

                <Button
                  onClick={() => this.editProfileHandler()}
                  type="button"
                  className="btn btn-primary"
                >
                  Save
                </Button>
                <Button
                  onClick={() => this.setState({ editProfile: false })}
                  type="button"
                  className="btn btn-secondary"
                >
                  Cancel
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* <div className="row">
          <div className="col-12">
            <div className="elder-details-area">
              <h4>Ops. Status</h4>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">ERM Allocated:</span>
                <span className="detail-item-value">
                  {_.get(elderData, 'owner.erm_allocated')
                    ? _.get(elderData, 'owner.erm_allocated')
                    : 'N/A'}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">
                  House Mapping Completed:
                </span>
                <span className="detail-item-value">
                  {_.get(elderData, 'owner.house_mapping')
                    ? _.get(elderData, 'owner.house_mapping')
                    : 'N/A'}{' '}
                  |{' '}
                  {_.get(elderData, 'owner.house_mapping_admin')
                    ? _.get(elderData, 'owner.house_mapping_admin')
                    : 'N/A'}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">
                  Daily Calls Initiated:
                </span>
                <span className="detail-item-value">
                  {_.get(elderData, 'owner.calls_initiated')
                    ? _.get(elderData, 'owner.calls_initiated')
                    : 'N/A'}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">
                  Service Initiation Completed:
                </span>
                <span className="detail-item-value">
                  {_.get(elderData, 'owner.service_initiation')
                    ? _.get(elderData, 'owner.service_initiation')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div> */}

        {elderData && elderData.zoho_object && this.state.showZohoData ? (
          <div className="row">
            <div className="col-12">
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
                  {Object.keys(elderData.zoho_object).map((key, index) => {
                    if (!key.startsWith('$'))
                      return (
                        <tr key={index}>
                          <td>{key}</td>
                          <td>{JSON.stringify(elderData.zoho_object[key])}</td>
                        </tr>
                      );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        ) : null}
      </Card>
    );
  }

  componentWillUnmount() { }
}

const mapStateToProps = state => ({
  user: state.user.user,
  elderData: state.elder.elderData,
});

const mapDispatchToProps = {
  getElderData,
  getCountryCodesList,
  updateUserStatus,
  updateElderBriefingStatus,
  updateElderNokStatus,
  updateWelcomePackStatus,
  fetchElderNotes,
  updatePrimaryElderStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ElderDetails);

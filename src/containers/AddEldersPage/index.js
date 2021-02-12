/*global google*/
import React from 'react';
import { Input, DatePicker, notification, Select } from 'antd';
import { Button, Form } from 'react-bootstrap';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import moment from 'moment';
import { debounce } from 'lodash';
import styles from './add-elders-page.scss';
import { addConsumer } from '../../actions/ConsumerActions';
import requireAuth from '../../hoc/requireAuth';
import hasPermission from '../../hoc/hasPermission';
import { connect } from 'react-redux';
import { getCountryCodesList } from '../../actions/ConfigActions';
import { RHHUB } from '../../common/constants';
import {
  getCities,
  getStates,
  getCountries,
} from '../../actions/LocationAction';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import LanguagesSpoken from '../../components/LanguagesSpoken';

class AddEldersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        first_name: null,
        last_name: null,
        mobile_number: null,
        gender: 1,
        dob: null,
        blood_group: 'A+',
        address: [],
        country_code: '91',
        formatted_mobile_number: null,
        location_code: '',
        lead_source: '',
        lead_date: null,
        lead_sub_source: '',
        lead_first_stage: '',
        lead_second_stage: '',
        lead_third_stage: '',
        lead_fourth_stage: '',
        data_source: '',
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
        whatsapp_country_code: '91',
        whatsapp_mobile_number: '',
        languages: [],
        other_language: '',
        rh_hub: '',
      },
      navigationDeployed: true,
      addressCount: 0,
      loader: false,
      statesList: [],
      countryCodesList: [],
      world: [],
      countries: null,
      showZohoFields: false,
      medicalConditionsList: [],
      isDifferentWhatsAppNumber: 'no',
    };
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Add an elder';
    this.getCountryCodesList();
  }

  getStatesList(country, index) {
    this.setState({ loader: true });
    this.props
      .getStates(country)
      .then((result) => {
        let { world } = this.state;
        world[index]['states'] = result.data;
        this.setState({ world, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  }

  getCountriesList(index) {
    this.setState({ loader: true });
    this.props
      .getCountries()
      .then((result) => {
        this.setState({ countries: result.data, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  }

  getCitiesList(state, index) {
    this.setState({ loader: true });
    this.props
      .getCities(state)
      .then((result) => {
        let { world } = this.state;
        world[index]['cities'] = result.data;
        this.setState({ world, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
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

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  setLanguages = (language) => {
    this.setStateValues(language, 'languages');
  };

  setStateValues = (e, field) => {
    let value;
    if (
      field === 'whatsapp_country_code' ||
      field === 'country_code' ||
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
    )
      value = e.currentTarget.value;
    else value = e ? moment(e._d).format('YYYY-MM-DD 00:00:00') : null;
    let { formData } = this.state;
    formData[`${field}`] = value;
    this.setState({ formData });

    if (field === 'languages') {
      if (!this.state.formData.languages.includes('Other')) {
        this.setState((state) => ({
          ...state,
          other_language: '',
        }));
      }
    }
  };

  handleSetWhatsappValue = (field, e) => {
    let value = e.currentTarget.value;
    if (value === 'no') {
      this.setState((state) => ({
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

  setAddressStateValues = (e, field, index) => {
    let value;
    let geo_latitude;
    let geo_longitude;
    let { address } = this.state.formData;
    // address[index]['address_line_1']="fafadsadas";
    if (field === 'address_line_1') {
      value = e.currentTarget.value;
      address[index]['address_line_1'] = value;
      this.setState({ formData: { ...this.state.formData, address } });
    } else if (field === 'address_line_2') {
      value = e.currentTarget.value;
      address[index]['address_line_2'] = value;
      this.setState({ formData: { ...this.state.formData, address } });
    } else if (field === 'city') {
      value = e.currentTarget.value;
      address[index]['city'] = value;
      this.setState({ formData: { ...this.state.formData, address } });
    } else if (field === 'state') {
      value = e.currentTarget.value;
      address[index]['state'] = value;
      address[index]['city'] = null;
      this.setState({ formData: { ...this.state.formData, address } });
      this.getCitiesList(value, index);
    } else if (field === 'country') {
      value = e.currentTarget.value;
      address[index]['country'] = value;
      address[index]['state'] = null;
      address[index]['city'] = null;
      this.setState({ formData: { ...this.state.formData, address } });
      this.getStatesList(value, index);
    } else {
      value = e.position;
      geo_latitude = e.position.lat;
      geo_longitude = e.position.lng;
      address[index]['geo_latitude'] = geo_latitude;
      address[index]['geo_longitude'] = geo_longitude;
      this.setState({ formData: { ...this.state.formData, address } });
    }
  };

  addAnotherAddressHandler = async () => {
    await this.setState({
      addressCount: this.state.addressCount + 1,
      formData: {
        ...this.state.formData,
        address: [
          ...this.state.formData.address,
          { address_line_1: null, geo_latitude: null, geo_longitude: null },
        ],
      },
      world: [
        ...this.state.world,
        { countries: null, states: null, cities: null },
      ],
    });
    this.renderGoogleMaps(this.state.addressCount);
    this.getCountriesList();
  };

  removeAddressHandler = async () => {
    let { formData, world } = this.state;
    formData.address.pop();
    world.pop();
    await this.setState({
      addressCount: this.state.addressCount - 1,
      formData,
      world,
    });
  };

  addElderHandler = async (e) => {
    // Save button handler , positioned at the bottom of the form
    e.preventDefault();
    let {
      first_name,
      mobile_number,
      address,
      country_code,
      whatsapp_country_code,
      whatsapp_mobile_number,
      nok_phone,
      primary_emergency_contact_number,
      secondary_emergency_contact_number,
      languages,
      other_language,
      rh_hub
    } = this.state.formData;
    let {
      addressCount,
      isDifferentWhatsAppNumber,
      showZohoFields,
    } = this.state;

    let addressStatus = 1;
    let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    const mobileRegex = /^[0-9]*$/;

    if (first_name === null || first_name === '')
      return this.openNotification('Error', 'First name is required.', 0);

    if (mobile_number === null || mobile_number === '') {
      return this.openNotification('Error', 'Contact number is required.', 0);
    }

    // mobile_number = mobile_number.replace(/-/g, '');

    if (
      !mobileRegex.test(mobile_number) ||
      (showZohoFields === true && !mobileRegex.test(mobile_number))
    ) {
      return this.openNotification('Error', 'Contact number is invalid.', 0);
    }

    let formatted_mobile_number = `+${country_code}${mobile_number}`;

    if (!regex.test(formatted_mobile_number))
      return this.openNotification('Error', 'Contact number is invalid.', 0);

    if (addressCount > 0) {
      address.forEach((addr) => {
        if (addr.address_line_1 === null || addr.address_line_1 === '') {
          addressStatus = 0;
          return this.openNotification(
            'Error',
            'Address Line 1 is required.',
            0
          );
        }
        if (addr.address_line_2 === null || addr.address_line_2 === '') {
          addressStatus = 0;
          return this.openNotification(
            'Error',
            'Address Line 2 is required.',
            0
          );
        }
        if (addr.country === null || addr.country === '') {
          addressStatus = 0;
          return this.openNotification('Error', 'Country is required.', 0);
        }
        if (addr.state === null || addr.state === '') {
          addressStatus = 0;
          return this.openNotification('Error', 'State is required.', 0);
        }
        if (addr.geo_latitude === null || addr.geo_latitude === '') {
          addressStatus = 0;
          return this.openNotification('Error', 'Please select a location.', 0);
        }
      });
      if (!addressStatus) return;
    }
    if (languages.includes('Other') && other_language === '') {
      return this.openNotification('Error', 'Please fill other language.', 0);
    }
    // whatsapp phone number validation
    if (
      isDifferentWhatsAppNumber === 'yes' &&
      (!whatsapp_country_code || !whatsapp_mobile_number)
    ) {
      return this.openNotification(
        'Error',
        'Whatsapp contact number is required',
        0
      );
    }

    // whatsapp_mobile_number = whatsapp_mobile_number.replace(/-/g, '');

    if (
      isDifferentWhatsAppNumber === 'yes' &&
      !mobileRegex.test(whatsapp_mobile_number)
    ) {
      return this.openNotification(
        'Error',
        'Whatsapp contact number is invalid.',
        0
      );
    }

    let formatted_whatsapp_mobile_number = `+${whatsapp_country_code}${whatsapp_mobile_number}`;

    // error notification when the length of the number is more than that of the regx . Number should be in range of 5-14 digit.
    if (
      isDifferentWhatsAppNumber === 'yes' &&
      !regex.test(formatted_whatsapp_mobile_number)
    )
      return this.openNotification(
        'Error',
        'Whatsapp contact number is invalid.',
        0
      );

    // zoho  NOk phone number validation

    if (showZohoFields === true && nok_phone && !mobileRegex.test(nok_phone)) {
      return this.openNotification('Error', 'Nok phone number not valid', 0);
    }

    if (
      showZohoFields === true &&
      primary_emergency_contact_number &&
      !mobileRegex.test(primary_emergency_contact_number)
    ) {
      return this.openNotification(
        'Error',
        'Nok primary emergency contact feild not valid',
        0
      );
    }

    // zoho Secondary Emergency Contact Number feild

    if (
      showZohoFields === true &&
      secondary_emergency_contact_number &&
      !mobileRegex.test(secondary_emergency_contact_number)
    ) {
      return this.openNotification(
        'Error',
        'Nok secondary emergency contact feild not valid',
        0
      );
    }

    // setting the state
    this.setState(
      {
        loader: true,
        formData: {
          ...this.state.formData,
          formatted_mobile_number,
          mobile_number,
          formatted_whatsapp_mobile_number,
          whatsapp_mobile_number,
          nok_phone,
          primary_emergency_contact_number,
          secondary_emergency_contact_number,
          languages,
          other_language,
        },
      },
      () => {
        let payload = Object.assign({}, this.state.formData);

        let newCurrentMedicalConditionsArr = [];
        let currentMedicalConditionsArr = [
          ...new Set(payload.current_medical_conditions),
        ];
        for (
          let index = 0;
          index < currentMedicalConditionsArr.length;
          index++
        ) {
          newCurrentMedicalConditionsArr.push({
            inputValue: currentMedicalConditionsArr[index],
          });
        }

        payload.current_medical_conditions = newCurrentMedicalConditionsArr;
        console.log(payload);
        this.props
          .addConsumer(this.props.user.id, payload)
          .then((result) => {
            this.setState({ loader: false });
            this.openNotification('Success', 'Elder Added Successfully.', 1);
            this.props.history.push('/elders');
          })
          .catch((error) => {
            this.setState({ loader: false });
            this.openNotification('Error', error.message, 0);
          });
      }
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

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  renderGoogleMaps = (index) => {
    var map = new google.maps.Map(document.getElementById('map-' + index), {
      center: { lat: 28.6109872, lng: 77.1628123 },
      zoom: 11,
      mapTypeId: 'roadmap',
    });
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input-' + index);
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
    });
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      var places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            draggable: true,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
        let { address } = this.state.formData;
        google.maps.event.addListener(markers[0], 'dragend', (marker) => {
          address[index - 1]['geo_latitude'] = marker.latLng.lat();
          address[index - 1]['geo_longitude'] = marker.latLng.lng();
          this.setState({ formData: { ...this.state.formData, address } });
        });
        address[index - 1]['geo_latitude'] = place.geometry.location.lat();
        address[index - 1]['geo_longitude'] = place.geometry.location.lng();
        this.setState({ formData: { ...this.state.formData, address } });
      });
      map.fitBounds(bounds);
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

  debouncedFunction = debounce((e) => {
    this.addElderHandler(e);
  }, 1000)

  render() {
    const { TextArea } = Input;
    const { navigationDeployed, formData } = this.state;
    let addresses = [];
    //for(var i = 0; i < this.state.addressCount ; i++) {
    formData.address.map((addr, index) => {
      return addresses.push(
        <div className='row'>
          <div className='col-12 col-sm-12 col-xl-12'>
            <Form.Group controlId='elderAddress'>
              <Form.Label>Address {index + 1}</Form.Label>
              <Form.Control
                style={{ width: '100%' }}
                placeholder='Address Line 1'
                onChange={(e) =>
                  this.setAddressStateValues(e, 'address_line_1', index)
                }
              />
            </Form.Group>
            <Form.Group controlId='elderAddress2'>
              <Form.Control
                style={{ width: '100%' }}
                placeholder='Address Line 2'
                onChange={(e) =>
                  this.setAddressStateValues(e, 'address_line_2', index)
                }
              />
            </Form.Group>
            <Form.Group controlId='elderState'>
              <Form.Control
                as='select'
                onChange={(e) =>
                  this.setAddressStateValues(e, 'country', index)
                }
                value={
                  formData.address[index].country
                    ? formData.address[index].country
                    : 'VOID'
                }
              >
                <option value='VOID' disabled>
                  Please select a country
                </option>
                {this.state.countries &&
                  this.state.countries.length &&
                  this.state.countries.map((country) => {
                    return (
                      <option value={country.country}>{country.country}</option>
                    );
                  })}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='elderState'>
              <Form.Control
                as='select'
                onChange={(e) => this.setAddressStateValues(e, 'state', index)}
                disabled={formData.address[index].country ? false : true}
                value={
                  formData.address[index].state
                    ? formData.address[index].state
                    : 'VOID'
                }
              >
                <option value='VOID'>Please select a state</option>
                {this.state.world.length &&
                  this.state.world[index].states &&
                  this.state.world[index].states.map((state) => {
                    return <option value={state.state}>{state.state}</option>;
                  })}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='elderState'>
              <Form.Control
                as='select'
                onChange={(e) => this.setAddressStateValues(e, 'city', index)}
                disabled={formData.address[index].state ? false : true}
                value={
                  formData.address[index].city
                    ? formData.address[index].city
                    : 'VOID'
                }
              >
                <option value='VOID'>Please select a city</option>
                {this.state.world.length &&
                  this.state.world[index].cities &&
                  this.state.world[index].cities.length &&
                  this.state.world[index].cities.map((city) => {
                    return <option value={city.city}>{city.city}</option>;
                  })}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='elderLocation'>
              <Form.Label>Location</Form.Label>

              <TextArea
                rows={1}
                style={{ width: '100%' }}
                placeholder='Enter your location...'
                id={`pac-input-${index + 1}`}
              />
              <div
                id={`map-${index + 1}`}
                style={{ height: '300px', position: 'relative' }}
              ></div>
            </Form.Group>
          </div>
        </div>
      );
    });
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
                <h2>Add an Elder</h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-12 col-sm-8'>
                  <div className='form-container'>
                    <Form className='map-responder-form'>
                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderFirstName'>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Vikram'
                              onChange={(e) =>
                                this.setStateValues(e, 'first_name')
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderLastName'>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Batra'
                              onChange={(e) =>
                                this.setStateValues(e, 'last_name')
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderContactNumber'>
                            <Form.Label>Contact Number</Form.Label>
                            <div className='d-flex justify-content-start'>
                              {/* <Form.Control as='select' value={this.state.country_code} onChange={(e) => this.setStateValues(e, 'country_code')} style={{width : '60px', marginRight : '5px'}}>
                                {this.state.countryCodesList.map(code => {
                                  return <option value={code}>+{code}</option>
                                })}
                              </Form.Control> */}
                              <Select
                                showSearch
                                style={{ width: 125, marginRight: '8px' }}
                                notFoundContent={null}
                                showArrow={false}
                                defaultValue={formData.country_code}
                                optionFilterProp='children'
                                onChange={(e) =>
                                  this.setStateValues(e, 'country_code')
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
                                type='number'
                                className='no-arrow'
                                placeholder='9876543210'
                                onChange={(e) =>
                                  this.setStateValues(e, 'mobile_number')
                                }
                              />
                            </div>
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderFirstName'>
                            <Form.Label>Date of Birth</Form.Label>
                            <DatePicker
                              onChange={(e) => this.setStateValues(e, 'dob')}
                              disabledDate={this.disabledDate}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderGender'>
                            <Form.Label>Gender</Form.Label>
                            <Form.Control
                              as='select'
                              onChange={(e) => this.setStateValues(e, 'gender')}
                            >
                              <option value={1}>Male</option>
                              <option value={2}>Female</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderFirstName'>
                            <Form.Label>Blood Group</Form.Label>
                            <Form.Control
                              as='select'
                              onChange={(e) =>
                                this.setStateValues(e, 'blood_group')
                              }
                            >
                              <option value='-None-'>-None-</option>
                              <option value='A'>A</option>
                              <option value='A+'>A+</option>
                              <option value='A-'>A-</option>
                              <option value='B'>B</option>
                              <option value='B+'>B+</option>
                              <option value='B-'>B-</option>
                              <option value='O'>O</option>
                              <option value='O+'>O+</option>
                              <option value='O-'>O-</option>
                              <option value='AB+'>AB</option>
                              <option value='AB+'>AB+</option>
                              <option value='AB-'>AB-</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                      </div>

                      {/* <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderEmergencyName'>
                            <Form.Label>Emergency Contact Name</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Vikram'
                              onChange={e =>
                                this.setStateValues(e, 'emergency_contact_name')
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderEmergencyContact'>
                            <Form.Label>Emergency Contact Number</Form.Label>
                            <div className='d-flex justify-content-start'>
                              <Select
                                showSearch
                                style={{ width: 125, marginRight: '8px' }}
                                notFoundContent={null}
                                showArrow={false}
                                defaultValue={this.state.emergency_country_code}
                                optionFilterProp='children'
                                onChange={value =>
                                  this.setState({
                                    emergency_country_code: value
                                  })
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
                                placeholder='9876543210'
                                onChange={e =>
                                  this.setStateValues(
                                    e,
                                    'emergency_contact_number'
                                  )
                                }
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </div> */}

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
                                      disabled={formData.allergies.length <= 1}
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
                            <Form.Label>Current Medical Conditions</Form.Label>

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
                          <Form.Group controlId='elderLastName'>
                            <Form.Label>Location Code</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='G2'
                              onChange={(e) =>
                                this.setStateValues(e, 'location_code')
                              }
                            />
                          </Form.Group>
                        </div>

                        <div className='col-12 col-sm-6'>
                          <Form.Group>
                            <Form.Label>Different WhatsApp Number</Form.Label>
                            <Form.Control
                              as='select'
                              onChange={(e) =>
                                this.handleSetWhatsappValue(
                                  'isDifferentWhatsAppNumber',
                                  e
                                )
                              }
                              value={this.state.isDifferentWhatsAppNumber}
                            >
                              <option value='no'>No</option>
                              <option value='yes'>Yes</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                      </div>

                      {this.state.isDifferentWhatsAppNumber === 'yes' && (
                        <div className='row'>
                          <div className='col-12 col-sm-6'></div>

                          <div className='col-12 col-sm-6'>
                            <div className='d-flex justify-content-start'>
                              <Select
                                showSearch
                                style={{ width: 125, marginRight: '8px' }}
                                notFoundContent={null}
                                showArrow={false}
                                value={formData.whatsapp_country_code}
                                optionFilterProp='children'
                                onChange={(value) =>
                                  this.setStateValues(
                                    value,
                                    'whatsapp_country_code'
                                  )
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
                                type='number'
                                className='no-arrow'
                                value={formData.whatsapp_mobile_number}
                                placeholder='9876543210'
                                onChange={(e) =>
                                  this.setStateValues(
                                    e,
                                    'whatsapp_mobile_number'
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <LanguagesSpoken
                        option={this.state.formData.languages}
                        onChange={this.setLanguages}
                      />
                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='otherLanguage'>
                            <Form.Label>Other Language</Form.Label>
                            <Form.Control
                              type='text'
                              disabled={
                                !this.state.formData.languages.includes('Other')
                              }
                              value={
                                this.state.formData.languages.includes('Other')
                                  ? this.state.formData.other_language
                                  : ''
                              }
                              placeholder='Other Langauge'
                              onChange={(e) =>
                                this.setStateValues(e, 'other_language')
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='rhHub'>
                            <Form.Label>RH Hub</Form.Label>
                            <Form.Control
                              as='select'
                              onChange={(e) =>
                                this.setStateValues(
                                  e,
                                  'rhHub',
                                )
                              }
                              value={this.state.formData.rh_hub}
                            >
                              <option value=''> Select RH Hub</option>
                              {
                                Object.keys(RHHUB).map((key) => (
                                  <option key={key} value={key}>{RHHUB[key]}</option>
                                ))
                              }
                            </Form.Control>
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
                                <Form.Label>AF2.1 Remarks</Form.Label>
                                <Form.Control
                                  type='text'
                                  placeholder='AF2.1 Remarks'
                                  onChange={(e) =>
                                    this.setStateValues(e, 'af21_remarks')
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
                                    this.setStateValues(e, 'lead_source')
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
                                    this.setStateValues(e, 'lead_sub_source')
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
                                    this.setStateValues(e, 'lead_date')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'data_source')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'lead_first_stage')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'lead_second_stage')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'lead_third_stage')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'lead_fourth_stage')
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
                                    this.setStateValues(e, 'customer_type')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'interested_service')
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
                                    this.setStateValues(e, 'nri_status')
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
                                  <option value='Not an NRI'>Not an NRI</option>
                                </Form.Control>
                              </Form.Group>
                            </div>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='elderLastName'>
                                <Form.Label>Sensor Installation</Form.Label>
                                <Form.Control
                                  type='text'
                                  placeholder='Sensor Installation'
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e,
                                      'sensor_installation'
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'sales_remarks')
                                  }
                                />
                              </Form.Group>
                            </div>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='elderLastName'>
                                <Form.Label>Other Remarks</Form.Label>
                                <Form.Control
                                  type='text'
                                  placeholder='Other Remarks'
                                  onChange={(e) =>
                                    this.setStateValues(e, 'other_remarks')
                                  }
                                />
                              </Form.Group>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='elderLastName'>
                                <Form.Label>Relationship with Elder</Form.Label>
                                <Form.Control
                                  type='text'
                                  placeholder='Relationship with Elder'
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e,
                                      'relationship_with_elder'
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'marital_status')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'home_type')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'bedrooms')
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
                                    this.setStateValues(e, 'most_liked_feature')
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
                                  <option value='Engagement'>Engagement</option>
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
                                    this.setStateValues(e, 'covid_diposition')
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
                                    this.setStateValues(e, 'proceed_to_af2a')
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
                                    this.setStateValues(e, 'proceed_to_af2b')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'currency')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'target_group_type')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'who_did_you_meet')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'salutation')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'spouse_name')
                                  }
                                />
                              </Form.Group>
                            </div>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='elderLastName'>
                                <Form.Label>Spouse DOB</Form.Label>
                                <DatePicker
                                  onChange={(e) =>
                                    this.setStateValues(e, 'spouse_dob')
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
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e,
                                      'first_name_customer_calling'
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
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e,
                                      'last_name_customer_calling'
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'product_package')
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
                                    this.setStateValues(e, 'payment_status')
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
                                    this.setStateValues(e, 'service_length')
                                  }
                                />
                              </Form.Group>
                            </div>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='elderLastName'>
                                <Form.Label>Service End Date</Form.Label>
                                <DatePicker
                                  onChange={(e) =>
                                    this.setStateValues(e, 'service_end_date')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'select_days_month')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'other_service')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'ad_set_name')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'campaign_name')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'form_source_url')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'google_link')
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
                                      e,
                                      'appointment_created_date'
                                    )
                                  }
                                />
                              </Form.Group>
                            </div>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='elderLastName'>
                                <Form.Label>Assessment Date</Form.Label>
                                <DatePicker
                                  onChange={(e) =>
                                    this.setStateValues(e, 'assessment_date')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'nok_name')
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
                                  onChange={(e) =>
                                    this.setStateValues(e, 'nok_email')
                                  }
                                />
                              </Form.Group>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='elderContactNumber'>
                                <Form.Label>NOK Phone</Form.Label>
                                <div className='d-flex justify-content-start'>
                                  <Select
                                    showSearch
                                    style={{ width: 125, marginRight: '8px' }}
                                    notFoundContent={null}
                                    showArrow={false}
                                    defaultValue={formData.country_code}
                                    optionFilterProp='children'
                                    onChange={(e) =>
                                      this.setStateValues(e, 'country_code')
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
                                          <Select.Option
                                            key={code}
                                            value={code}
                                          >
                                            +{code}
                                          </Select.Option>
                                        );
                                      }
                                    )}
                                  </Select>
                                  <Form.Control
                                    type='number'
                                    className='no-arrow'
                                    placeholder='NOK Phone'
                                    onChange={(e) =>
                                      this.setStateValues(e, 'nok_phone')
                                    }
                                  />
                                </div>
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
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e,
                                      'is_nok_the_primary_emergency_contact'
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
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e,
                                      'primary_emergency_contact_name'
                                    )
                                  }
                                />
                              </Form.Group>
                            </div>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='elderContactNumber'>
                                <Form.Label>
                                  Primary Emergency Contact Number
                                </Form.Label>
                                <div className='d-flex justify-content-start'>
                                  <Select
                                    showSearch
                                    style={{ width: 125, marginRight: '8px' }}
                                    notFoundContent={null}
                                    showArrow={false}
                                    defaultValue={formData.country_code}
                                    optionFilterProp='children'
                                    onChange={(e) =>
                                      this.setStateValues(e, 'country_code')
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
                                          <Select.Option
                                            key={code}
                                            value={code}
                                          >
                                            +{code}
                                          </Select.Option>
                                        );
                                      }
                                    )}
                                  </Select>
                                  <Form.Control
                                    type='number'
                                    className='no-arrow'
                                    placeholder='Primary Emergency Contact Number'
                                    onChange={(e) =>
                                      this.setStateValues(
                                        e,
                                        'primary_emergency_contact_number'
                                      )
                                    }
                                  />
                                </div>
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
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e,
                                      'secondary_emergency_contact_name'
                                    )
                                  }
                                />
                              </Form.Group>
                            </div>
                            <div className='col-12 col-sm-6'>
                              <Form.Group controlId='elderContactNumber'>
                                <Form.Label>
                                  Secondary Emergency Contact Number
                                </Form.Label>
                                <div className='d-flex justify-content-start'>
                                  <Select
                                    showSearch
                                    style={{ width: 125, marginRight: '8px' }}
                                    notFoundContent={null}
                                    showArrow={false}
                                    defaultValue={formData.country_code}
                                    optionFilterProp='children'
                                    onChange={(e) =>
                                      this.setStateValues(e, 'country_code')
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
                                          <Select.Option
                                            key={code}
                                            value={code}
                                          >
                                            +{code}
                                          </Select.Option>
                                        );
                                      }
                                    )}
                                  </Select>
                                  <Form.Control
                                    type='number'
                                    className='no-arrow'
                                    placeholder='Secondary Emergency Contact Number'
                                    onChange={(e) =>
                                      this.setStateValues(
                                        e,
                                        'secondary_emergency_contact_number'
                                      )
                                    }
                                  />
                                </div>
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
                                    this.setStateValues(e, 'sales_status')
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
                                    this.setStateValues(e, 'payment_source')
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
                                      e,
                                      'current_living_condition'
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
                                    this.setStateValues(e, 'age')
                                  }
                                />
                              </Form.Group>
                            </div>
                          </div>
                        </React.Fragment>
                      )}

                      {addresses}
                      <div className='row'>
                        {this.state.addressCount ? (
                          <div className='col-12'>
                            <Button
                              type='button'
                              className='btn btn-link'
                              onClick={this.removeAddressHandler}
                            >
                              <FontAwesomeIcon icon={faMinus} /> Remove address
                            </Button>
                            <hr />
                          </div>
                        ) : null}
                        <div className='col-12'>
                          {!this.state.addressCount ? (
                            <Button
                              type='button'
                              className='btn btn-link'
                              onClick={this.addAnotherAddressHandler}
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add address
                            </Button>
                          ) : (
                              <Button
                                type='button'
                                className='btn btn-link'
                                onClick={this.addAnotherAddressHandler}
                              >
                                <FontAwesomeIcon icon={faPlus} /> Add another
                              address
                              </Button>
                            )}
                        </div>
                      </div>
                      <Button
                        className='btn btn-primary'
                        onClick={this.debouncedFunction}
                      >
                        Save
                      </Button>
                    </Form>
                  </div>
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
const mapStateToProps = (state) => ({
  user: state.user.user,
});
export default hasPermission(
  requireAuth(
    connect(mapStateToProps, {
      addConsumer,
      getCountryCodesList,
      getCities,
      getStates,
      getCountries,
    })(AddEldersPage)
  )
);

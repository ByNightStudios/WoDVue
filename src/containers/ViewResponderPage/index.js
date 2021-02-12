/*global google*/

import React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import {
  DatePicker,
  notification,
  Select,
  Input,
  Switch,
  Checkbox,
  Modal,
} from 'antd';
import { connect } from 'react-redux';
import { Button, Form, Image } from 'react-bootstrap';
import { getRenderingHeader } from '../../common/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faMinus,
  faPlus,
  faTrashAlt,
  faFileDownload,
} from '@fortawesome/free-solid-svg-icons';
import {
  getCountryCodesList,
  getResponderConfig,
} from '../../actions/ConfigActions';
import {
  responderList,
  updateResponderAvailibilty,
  updateResponder,
} from '../../actions/ResponderActions';
import { updateUserStatus } from '../../actions/UserActions';
import { UPLOAD_S3_URL } from '../../common/backendConstants';

import requireAuth from '../../hoc/requireAuth';
import PageLoader from '../../components/PageLoader';
import ImageUploader from '../../components/ImageUploader';
import SideNavigation from '../../components/SideNavigation';
import S3FileUploader from '../../components/S3FileUploader';
import ResponderService from '../../service/ResponderService';
import FileSelector from '../../components/FileSelector';
import hasPermission from '../../hoc/hasPermission';
import LanguagesSpoken from '../../components/LanguagesSpoken/index';
import styles from './view-responder-page.scss';

const { TextArea } = Input;
const { confirm } = Modal;

class ViewResponderPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      navigationDeployed: true,
      countryCodesList: [],
      responderTypes: [],
      record: null,
      showOtherServiceInput: false,
      identity_proof: null,
      showIdentityProof: false,
      kyc: [],
      showKYC: false,
      is_active: false,
      is_available: false,
      verifications: [],
      showVerifications: false,
      showVerificationButton: false,
      languagesTypes: [],
      formData: {
        userID: null,
        firstName: '',
        lastName: '',
        dob: null,
        gender: 0,
        mobileNumber: '',
        countryCode: '91',
        image_uuid: null,
        imageURL: null,
        locationCode: '',
        location: '',
        email: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        kycCheck: '',
        locCheck: '',
        veriStatus: '',
        regionOwner: '',
        source: '',
        serviceType: '',
        anniversary: null,
        geoLocation: null,
        locality: '',
        otherServiceType: '',
        identity_proof_id: null,
        aadhaar: '',
        languages: [],
        other_language: '',
        meal_preference: '',
        weight: '',
        edu_qualification: '',
        other_qualification: '',
        previous_work: '',
        about_yourself: '',
        video_id: '',
        edu_docs: [],
      },
    };

    this.responderService = new ResponderService();
    this.idUrlMapping = {};
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Responder Profile';
    this.getResponderData(this.props.match.params.id, true);
  }

  getResponderConfig() {
    this.props
      .getResponderConfig('country_codes')
      .then((result) => {
        this.setState(
          {
            countryCodesList: result.country_codes,
            responderTypes: result.responder_types,
            // languagesTypes: result.languages,
          },
          () => {
            if (
              this.state.record.owner.service_type &&
              !result.responder_types.includes(
                this.state.record.owner.service_type
              )
            ) {
              this.setState({
                responderTypes: [
                  this.state.record.owner.service_type,
                  ...result.responder_types,
                ],
              });
            }
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getResponderData = (id, showLoader = false) => {
    if (showLoader) {
      this._startPageLoader();
    }
    this.props
      .responderList(1, '', id)
      .then((res) => {
        this._stopPageLoader();
        if (res.data && res.data.length) {
          this.setState({ record: res.data[0] }, () => {
            this.triggerEditProfile();
            this.getResponderConfig();
            this.getResponderKYC();
            this.getVerificationsData();
          });
        }
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification('Error', 'Something went wrong', 0);
      });
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

  setLanguages = (language) => {
    console.log(language);
    this.setStateValues('languages', language);
  };
  setStateValues = (field, e) => {
    let value;
    if (field === 'countryCode' || field === 'languages') {
      value = e;
    } else if (field !== 'dob' && field !== 'anniversary') {
      value = e.currentTarget.value;
    } else {
      value = e ? moment(e._d).format('YYYY-MM-DD 00:00:00') : null;
    }
    let formData = this.state.formData;
    formData[`${field}`] = value;
    this.setState({ formData });

    if (field === 'serviceType' && value === 'Other') {
      this.setState({ showOtherServiceInput: true });
    } else if (field === 'serviceType' && value !== 'Other') {
      this.setState({
        showOtherServiceInput: false,
        formData: { ...formData, otherServiceType: '' },
      });
    }

    if (field === 'languages') {
      if (!this.state.formData.languages.includes('Other')) {
        this.setState((state) => ({
          ...state,
          formData: {
            ...state.formData,
            other_language: '',
          },
        }));
      }
    } else if (field === 'edu_qualification') {
      if (!(value === 'Other')) {
        this.setState((state) => ({
          ...state,
          formData: {
            ...state.formData,
            other_qualification: '',
          },
        }));
      }
    }
  };

  triggerEditProfile = () => {
    let formData = Object.assign({}, this.state.formData);

    const {
      first_name,
      last_name,
      country_code,
      mobile_number,
      owner,
      image_url,
      email,
      is_active,
      is_available,
      gender,
    } = this.state.record;

    let dob,
      locationCode,
      anniversary,
      regionOwner,
      locality,
      location,
      geoLocation,
      kycCheck,
      locCheck,
      veriStatus,
      country,
      state,
      city,
      pincode,
      serviceType,
      aadhaar,
      languages,
      other_language,
      meal_preference,
      weight,
      marital_status,
      exp_year,
      edu_qualification,
      other_qualification,
      previous_work,
      about_yourself,
      video_id,
      edu_docs;

    if (owner) {
      dob = owner.dob;
      locationCode = owner.location_code;
      anniversary = owner.anniversary;
      regionOwner = owner.region_owner;
      locality = owner.locality;
      location = owner.location;
      country = owner.country;
      state = owner.state;
      city = owner.city;
      pincode = owner.pincode;
      geoLocation = owner.geo_location;
      kycCheck = owner.kyc_check;
      locCheck = owner.loc_check;
      veriStatus = owner.veri_status;
      serviceType = owner.service_type;
      aadhaar = owner.aadhaar;
      languages = owner.languages;
      other_language = owner.other_language;
      meal_preference = owner.meal_preference;
      weight = owner.weight;
      marital_status = owner.marital_status;
      exp_year = owner.exp_year;
      edu_qualification = owner.edu_qualification;
      other_qualification = owner.other_qualification;
      previous_work = owner.previous_work;
      about_yourself = owner.about_yourself;
      if (owner.video_id.length > 0) {
        video_id = owner.video_id[0]['id'];
        this.idUrlMapping[video_id] = owner.video_id[0]['url'];
      } else {
        video_id = '';
      }
      let doc_ids = [];
      owner.edu_docs.map((doc) => {
        doc_ids.push(doc.id);
        this.idUrlMapping[doc.id] = doc.url;
      });
      edu_docs = doc_ids;
    }

    formData = {
      firstName: first_name,
      lastName: last_name,
      dob: dob,
      gender: gender ? gender : 0,
      mobileNumber: mobile_number,
      countryCode: country_code ? country_code : '91',
      image_uuid: null,
      imageURL: image_url,
      userID: this.state.record.id,
      locationCode: locationCode,
      locality,
      location,
      geoLocation,
      country,
      state,
      city,
      pincode,
      regionOwner,
      kycCheck,
      locCheck,
      veriStatus,
      anniversary,
      email,
      serviceType,
      aadhaar,
      languages,
      other_language,
      meal_preference,
      weight,
      marital_status,
      exp_year,
      edu_qualification,
      other_qualification,
      previous_work,
      about_yourself,
      video_id,
      edu_docs,
    };

    this.setState(
      {
        formData,
        is_active,
        is_available,
        showVerificationButton: aadhaar ? true : false,
      },
      () => {
        this.renderGoogleMaps();
      }
    );
  };

  renderGoogleMaps = () => {
   

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: latlng,
      mapTypeId: 'roadmap',
    });

    var latlng = new google.maps.LatLng(39.305, -76.617);
    const { geo_location } = this.state.record.owner;
    if (geo_location) {
      latlng = new google.maps.LatLng(
        parseFloat(geo_location.geo_latitude),
        parseFloat(geo_location.geo_longitude)
      );
    }
    if (this.state.record.owner.geo_location) {
      var marker = new google.maps.Marker({
        position: {
          lat: parseFloat(geo_location.geo_latitude),
          lng: parseFloat(geo_location.geo_longitude),
        },
        map: map,
        draggable: true,
      });

      marker.setMap(map);
    }

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
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
          console.log('Returned place contains no geometry');
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

        google.maps.event.addListener(markers[0], 'dragend', (marker) => {
          //console.log(marker.latLng.lat(), marker.latLng.lng())
          let geo_latitude = marker.latLng.lat();
          let geo_longitude = marker.latLng.lng();

          this.setState({
            formData: {
              ...this.state.formData,
              geoLocation: { geo_latitude, geo_longitude },
            },
          });
        });

        let geo_latitude = place.geometry.location.lat();
        let geo_longitude = place.geometry.location.lng();

        this.setState({
          formData: {
            ...this.state.formData,
            geoLocation: { geo_latitude, geo_longitude },
          },
        });
      });

      map.fitBounds(bounds);
    });
  };

  setLoader = (loader) => {
    this.setState({
      loader,
    });
  };

  responderFormValidation = () => {
    let formData = Object.assign(this.state.formData, {});

    if (!formData.firstName || !formData.lastName) {
      this.openNotification(
        'Error',
        'Basic Responder details are required.',
        0
      );
      return { success: false, payload: null };
    }

    // mobile number validation
    let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    const mobileRegex = /^[0-9]*$/;

    if (!mobileRegex.test(formData.mobileNumber)) {
      return this.openNotification('Error', 'Contact number is invalid.', 0);
    }
    let formatted_mobile_number = `+${formData.countryCode}${formData.mobileNumber}`;

    if (!regex.test(formatted_mobile_number))
      return this.openNotification('Error', 'Contact number is invalid.', 0);

    if (formData.aadhaar && formData.aadhaar.length !== 12) {
      this.openNotification('Error', 'Aadhaar Number is invalid.', 0);
      return { success: false, payload: null };
    }
    if (formData.weight !== null && formData.weight !== '') {
      const weight = formData.weight;
      if (isNaN(weight) || weight < 1 || weight > 999) {
        this.openNotification(
          'Error',
          'Please enter correct weight in three digits in between (1-999).',
          0
        );
        return { success: false, payload: null };
      }
    }
    if (formData.exp_year !== null && formData.exp_year !== '') {
      const fexp_year = formData.exp_year;
      if (isNaN(fexp_year) || fexp_year < 0 || fexp_year > 99) {
        this.openNotification(
          'Error',
          'Please enter correct work experience in two digits in between (0-99).',
          0
        );
        return { success: false, payload: null };
      }
    }
    if (
      formData.edu_qualification === 'Other' &&
      formData.other_qualification === ''
    ) {
      this.openNotification('Error', 'Please fill Other Qualification', 0);
      return { success: false, payload: null };
    }
    if (
      formData.languages.includes('Other') &&
      formData.other_language === ''
    ) {
      this.openNotification('Error', 'Please fill Other Language', 0);
      return { success: false, payload: null };
    }
    let payload = {
      user_type: 2,
      first_name: formData.firstName,
      last_name: formData.lastName,
      gender:
        formData.gender !== '' && formData.gender !== 0
          ? formData.gender
          : null,
      location: formData.location,
      location_code: formData.locationCode,
      locality: formData.locality,
      country: formData.country,
      mobile_number: formData.mobileNumber,
      state: formData.state,
      city: formData.city,
      pincode: formData.pincode,
      service_type: formData.otherServiceType
        ? formData.otherServiceType
        : formData.serviceType,
      email: formData.email,
      loc_check: formData.locCheck,
      kyc_check: formData.kycCheck,
      veri_status: formData.veriStatus,
      region_owner: formData.regionOwner,
      identity_proof_id: formData.identity_proof_id,
      geo_location: JSON.stringify(formData.geoLocation),
      dob: formData.dob,
      anniversary: formData.anniversary,
      image_uuid: formData.image_uuid,
      aadhaar: formData.aadhaar,
      languages: formData.languages.toString(),
      other_language: formData.other_language,
      meal_preference: formData.meal_preference,
      weight: formData.weight,
      marital_status: formData.marital_status,
      exp_year: formData.exp_year,
      edu_qualification: formData.edu_qualification,
      other_qualification: formData.other_qualification,
      previous_work: formData.previous_work,
      about_yourself: formData.about_yourself,
      video_id: formData.video_id,
      edu_docs: formData.edu_docs,
    };
    return { success: true, payload };
  };

  updateProfileHanlder = () => {
    const validation = this.responderFormValidation();
    if (!validation.success) {
      return;
    }

    this._startPageLoader();
    this.props
      .updateResponder(
        this.props.user.id,
        this.state.record.id,
        validation.payload
      )
      .then((result) => {
        this.openNotification('Success', 'Details Updated Successfully.', 1);
        const { owner } = result.data;
        if (owner.video_id.length > 0) {
          this.idUrlMapping[owner.video_id[0]['id']] = owner.video_id[0]['url'];
        }
        if (owner.edu_docs.length > 0) {
          owner.edu_docs.map((doc) => {
            this.idUrlMapping[doc.id] = doc.url;
          });
        }
        this.setState({
          loader: false,
          showIdentityProof: false,
          showVerificationButton: this.state.formData.aadhaar ? true : false,
        });
        this.getResponderKYC();
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification('Error', error.message, 0);
      });
  };

  getResponderKYC = () => {
    this.responderService
      .getResponderKYC({ responder_id: this.state.record.id })
      .then((res) => {
        this.setState({ kyc: res.data ? res.data : [] });
      })
      .catch((error) => {
        this.openNotification('Error', 'Could not fetch KYC documents.', 0);
      });
  };

  onSwitchToggle = (checked) => {
    let status;

    if (this.state.is_available) status = 0;
    else status = 1;
    this.setState({ loader: true });
    this.props
      .updateResponderAvailibilty(this.state.record.id, status)
      .then((result) => {
        this.openNotification(
          'Success',
          'Responder Availibility Updated Successfully.',
          1
        );
        this.setState({ loader: false, is_available: status });
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification('Error', error.message, 0);
      });
  };

  onCancel = () => {};

  updateResponderStatusHandler = () => {
    let responderStatus;
    if (this.state.is_active) responderStatus = 0;
    else responderStatus = 1;

    this.setState({ loader: true });
    this.props
      .updateUserStatus(this.state.record.id, responderStatus)
      .then((result) => {
        this.setState({ is_active: responderStatus, loader: false });
        this.openNotification('Success', 'Responder Status Updated', 1);
      })
      .catch((error) => {
        this.setState({ loader: false });

        this.openNotification('Error', error.message, 0);
      });
  };

  onFileSelection = (file) => {
    const payload = new FormData();
    payload.append('file', file);

    this.setState({ loader: true });
    this.responderService
      .addResponderKYC(payload)
      .then((result) => {
        if (!result.data) {
          return this.openNotification('Error', 'Please try again.', 0);
        }

        this.openNotification('Success', 'File Uploaded Successfully.', 1);
        this.setState({
          identity_proof: result.data.url,
          loader: false,
          showIdentityProof: true,
          formData: {
            ...this.state.formData,
            identity_proof_id: result.data.id,
          },
        });
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification('Error', 'Please try again.', 0);
      });
  };

  googleMapsRedirector = () => {
    let geoLatitude = 28.4250203;
    let geoLongitude = 77.0658533;

    const { geo_location } = this.state.record.owner;
    if (
      geo_location &&
      geo_location.geo_latitude &&
      geo_location.geo_longitude
    ) {
      geoLatitude = geo_location.geo_latitude;
      geoLongitude = geo_location.geo_longitude;
    }

    window.open(
      `https://google.com/maps?q=${geoLatitude},${geoLongitude}`,
      '_blank'
    );
  };

  requestVerificationHandler = () => {
    this._startPageLoader();
    this.responderService
      .requestVerification({ responder_id: this.state.record.id })
      .then((res) => {
        this.openNotification(
          'Success',
          'OnGrid Verification Requested Successfully.',
          1
        );
        this.getVerificationsData();
        this._stopPageLoader();
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification('Error', error.response.data.message, 0);
      });
  };

  toggleShowVerification = () => {
    this.setState({ showVerifications: !this.state.showVerifications });
  };

  getVerificationsData = () => {
    this.responderService
      .getVerificationData(this.state.record.id)
      .then((res) => {
        if (res.data) {
          this.setState({ verifications: res.data });
        }
      })
      .catch((err) => {
        this.openNotification(
          'Error',
          'Could not fetch verification data right now.',
          0
        );
      });
  };

  videoUpload = (id) => {
    this.setState((state) => ({
      ...state,
      formData: { ...state.formData, video_id: id },
    }));
  };

  removeUploadVideo = () => {
    confirm({
      title: 'Are you sure you wish to remove this doc?',
      okType: 'danger',
      okText: 'Yes, Continue',
      cancelText: 'No, Abort',
      centered: true,
      onOk: () => {
        this.setState((state) => ({
          ...state,
          formData: { ...state.formData, video_id: '' },
        }));
      },
      onCancel() {
        return;
      },
    });
  };

  appendEduDocs = (id) => {
    const edu_docs = Object.assign([], this.state.formData.edu_docs);
    edu_docs.push(id);
    this.setState((state) => ({
      ...state,
      formData: { ...state.formData, edu_docs },
    }));
  };

  removeDoc = (id) => {
    const previous_docs = Object.assign([], this.state.formData.edu_docs);
    const edu_docs = previous_docs.filter((doc) => {
      return doc !== id;
    });
    this.setState((state) => ({
      ...state,
      formData: { ...state.formData, edu_docs },
    }));
  };

  removeEduDocs = (id) => {
    confirm({
      title: 'Are you sure you wish to remove this doc?',
      okType: 'danger',
      okText: 'Yes, Continue',
      cancelText: 'No, Abort',
      centered: true,
      onOk: () => {
        this.removeDoc(id);
      },
      onCancel() {
        return;
      },
    });
  };

  render() {
    const { navigationDeployed, formData, record } = this.state;
    console.log(record);
    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? 'viewresponder-page viewelder-page sidebar-page sidebar-page--open position-relative'
              : 'viewresponder-page viewelder-page sidebar-page sidebar-page--closed position-relative'
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
                  {record
                    ? `${_.get(record, 'full_name', 'Responder')}'s Details`
                    : `Elder's Details`}
                </h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='elder-details'>
                <div className='row'>
                  <div className='col-12 col-sm-4'>
                    <div className='elder-details-area'>
                      <div className='statusToggle'>
                        <h5>Registration Source </h5>
                        <h5>
                          {record && record.source ? record.source : 'N/A'}
                        </h5>
                      </div>

                      <div className='statusToggle'>
                        <h5>Responder Account Status </h5>
                        <Switch
                          style={{ marginLeft: '4px' }}
                          checkedChildren='Active'
                          unCheckedChildren='Inactive'
                          checked={
                            this.state && this.state.is_active ? true : false
                          }
                          onChange={(e) => this.updateResponderStatusHandler()}
                        />
                      </div>

                      <div className='availibilityToggle'>
                        <h5>Responder Availibility </h5>
                        <Switch
                          style={{ marginLeft: '4px' }}
                          checkedChildren='Available'
                          unCheckedChildren='Off Duty'
                          checked={
                            this.state && this.state.is_available ? true : false
                          }
                          onChange={(e) => this.onSwitchToggle(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 col-sm-7'>
                    <div className='elder-details-area'>
                      <div className='row'>
                        <div
                          className='col-12 col-sm-4'
                          style={{ marginBottom: '24px' }}
                        >
                          <Form.Group controlId='displayPicture'>
                            <Form.Label>Display Picture</Form.Label>

                            <ImageUploader
                              type='Media'
                              file_type='1'
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
                          <Form.Group>
                            <Form.Label>Email</Form.Label>

                            <Form.Control
                              type='text'
                              placeholder='xyz@gmail.com'
                              value={formData.email}
                              onChange={(e) => this.setStateValues('email', e)}
                            />
                          </Form.Group>
                        </div>

                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elder_gender'>
                            <Form.Label>Gender</Form.Label>

                            <Form.Control
                              as='select'
                              value={formData.gender}
                              onChange={(e) => this.setStateValues('gender', e)}
                            >
                              <option value={0}>Please select a gender</option>
                              <option value={1}>Male</option>
                              <option value={2}>Female</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderDateOfBirth'>
                            <Form.Label>Date of Birth</Form.Label>
                            <DatePicker
                              value={
                                formData.dob != null
                                  ? moment(formData.dob, 'YYYY-MM-DD')
                                  : null
                              }
                              onChange={(e) => this.setStateValues('dob', e)}
                              disabledDate={(d) => d.isAfter(moment())}
                            />
                          </Form.Group>
                        </div>

                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderDateOfBirth'>
                            <Form.Label>Date of Anniversary</Form.Label>
                            <DatePicker
                              value={
                                formData.anniversary != null
                                  ? moment(formData.anniversary, 'YYYY-MM-DD')
                                  : null
                              }
                              onChange={(e) =>
                                this.setStateValues('anniversary', e)
                              }
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
                                value={formData.countryCode}
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
                                disabled={!_.isEmpty(record)}
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
                                value={formData.mobileNumber}
                                placeholder='9876543210'
                                onChange={(e) =>
                                  this.setStateValues('mobileNumber', e)
                                }
                                disabled={!_.isEmpty(record)}
                              />
                            </div>
                          </Form.Group>
                        </div>

                        <div className='col-12 col-sm-6'>
                          <Form.Group>
                            <Form.Label>Address</Form.Label>

                            <Form.Control
                              type='text'
                              placeholder='Address'
                              value={formData.location}
                              onChange={(e) =>
                                this.setStateValues('location', e)
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group>
                            <Form.Label>Country</Form.Label>

                            <Form.Control
                              type='text'
                              placeholder='India'
                              value={formData.country}
                              onChange={(e) =>
                                this.setStateValues('country', e)
                              }
                            />
                          </Form.Group>
                        </div>

                        <div className='col-12 col-sm-6'>
                          <Form.Group>
                            <Form.Label>State</Form.Label>

                            <Form.Control
                              type='text'
                              placeholder='Delhi'
                              value={formData.state}
                              onChange={(e) => this.setStateValues('state', e)}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group>
                            <Form.Label>City</Form.Label>

                            <Form.Control
                              type='text'
                              placeholder='New Delhi'
                              value={formData.city}
                              onChange={(e) => this.setStateValues('city', e)}
                            />
                          </Form.Group>
                        </div>

                        <div className='col-12 col-sm-6'>
                          <Form.Group>
                            <Form.Label>Locality</Form.Label>

                            <Form.Control
                              type='text'
                              placeholder='Sector 10'
                              value={formData.locality}
                              onChange={(e) =>
                                this.setStateValues('locality', e)
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group>
                            <Form.Label>Pin Code</Form.Label>

                            <Form.Control
                              type='text'
                              placeholder='New Delhi'
                              value={formData.pincode}
                              onChange={(e) =>
                                this.setStateValues('pincode', e)
                              }
                            />
                          </Form.Group>
                        </div>

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
                        <div className='col-12 col-sm-12'>
                          <div className='custom-address-map'>
                            <TextArea
                              rows={1}
                              style={{ width: '100%' }}
                              placeholder='Search for a Location...'
                              id='pac-input'
                            />

                            <div id='map' className='google-map'></div>
                          </div>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderType'>
                            <Form.Label>Responder Type</Form.Label>
                            <Form.Control
                              as='select'
                              value={formData.serviceType}
                              onChange={(e) =>
                                this.setStateValues('serviceType', e)
                              }
                            >
                              <option value=''>Please select a type</option>
                              {this.state.responderTypes.length
                                ? this.state.responderTypes.map(
                                    (type, index) => {
                                      return (
                                        <option key={index} value={type}>
                                          {type}
                                        </option>
                                      );
                                    }
                                  )
                                : ''}
                            </Form.Control>
                          </Form.Group>
                        </div>

                        {this.state.showOtherServiceInput ? (
                          <div className='col-12 col-sm-6'>
                            <Form.Group controlId='responderGender'>
                              <Form.Label>Other Responder Type</Form.Label>
                              <Form.Control
                                type='text'
                                value={formData.otherServiceType}
                                onChange={(e) =>
                                  this.setStateValues('otherServiceType', e)
                                }
                                placeholder='Helper'
                              />
                            </Form.Group>
                          </div>
                        ) : null}
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderLOCCheck'>
                            <Form.Label>LOC Check</Form.Label>
                            <Form.Control
                              as='select'
                              value={formData.locCheck}
                              onChange={(e) =>
                                this.setStateValues('locCheck', e)
                              }
                            >
                              <option value=''>Please select a status</option>
                              <option value='0'>Pending</option>
                              <option value='1'>Done</option>
                              <option value='2'>Not Applicable</option>
                            </Form.Control>
                          </Form.Group>
                        </div>

                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderKYCCheck'>
                            <Form.Label>KYC Check</Form.Label>
                            <Form.Control
                              as='select'
                              value={formData.kycCheck}
                              onChange={(e) =>
                                this.setStateValues('kycCheck', e)
                              }
                            >
                              <option value=''>Please select a status</option>
                              <option value='0'>Yes</option>
                              <option value='1'>No</option>
                              <option value='2'>Not Applicable</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderVerificationStatus'>
                            <Form.Label>Verification Status</Form.Label>
                            <Form.Control
                              as='select'
                              value={formData.veriStatus}
                              onChange={(e) =>
                                this.setStateValues('veriStatus', e)
                              }
                            >
                              <option value=''>Please select a status</option>
                              <option value='0'>Pending</option>
                              <option value='1'>Verified</option>
                              <option value='2'>Rejected</option>
                            </Form.Control>
                          </Form.Group>
                        </div>

                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderRegionOwner'>
                            <Form.Label>Region Owner</Form.Label>
                            <Form.Control
                              type='text'
                              value={formData.regionOwner}
                              onChange={(e) =>
                                this.setStateValues('regionOwner', e)
                              }
                              placeholder='Region Owner'
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderAadhaarNumber'>
                            <Form.Label>Aadhaar Number</Form.Label>
                            <Form.Control
                              type='text'
                              value={formData.aadhaar}
                              onChange={(e) =>
                                this.setStateValues('aadhaar', e)
                              }
                              placeholder='123412341234'
                            />
                          </Form.Group>
                        </div>
                      </div>

                      {record && record.owner.geo_location ? (
                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Button
                              className='btn btn-link'
                              onClick={this.googleMapsRedirector}
                            >
                              <FontAwesomeIcon icon={faPlus} /> Open in Maps
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      <div className='row'>
                        <div className='col-6'>
                          {this.state.showVerificationButton && (
                            <Button
                              type='button'
                              className='btn btn-secondary'
                              style={{
                                marginLeft: '0px',
                                marginBottom: '16px',
                              }}
                              onClick={this.requestVerificationHandler}
                            >
                              Request OnGrid Verification
                            </Button>
                          )}
                        </div>
                      </div>

                      {this.state.verifications &&
                      this.state.verifications.length ? (
                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Button
                              className='btn btn-link'
                              onClick={() => this.toggleShowVerification()}
                            >
                              <FontAwesomeIcon
                                icon={
                                  this.state.showVerifications
                                    ? faMinus
                                    : faPlus
                                }
                              />{' '}
                              {this.state.showVerifications
                                ? 'Hide Verification Requests'
                                : 'Show Verification Requests'}
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {this.state.showVerifications ? (
                        <div className='row pending-responder-list'>
                          {this.state.verifications.map(
                            (verification, index) => {
                              return (
                                <div key={index} className='col-12 col-sm-6'>
                                  <div className='pending-responder-list-item'>
                                    <p>
                                      <b>Status: </b>
                                      {verification.status
                                        ? verification.status.toUpperCase()
                                        : ''}
                                    </p>
                                    <p>
                                      <b>Requested On: </b>
                                      {verification.created_at}
                                    </p>
                                    <p>
                                      <b>Updated On: </b>
                                      {verification.updated_at}
                                    </p>
                                    {verification.reason && (
                                      <p>
                                        <b>Reason: </b>
                                        {verification.reason}
                                      </p>
                                    )}
                                    {verification.result && (
                                      <p>
                                        <b>Result: </b>
                                        {verification.result}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : null}

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group>
                            <Form.Label>Upload KYC</Form.Label>
                            <FileSelector
                              openNotification={this.openNotification}
                              onSelection={this.onFileSelection}
                              maxFileSize={10000}
                              fileType='image'
                            />
                          </Form.Group>
                        </div>
                      </div>

                      {this.state.showIdentityProof &&
                        this.state.identity_proof && (
                          <div className='row'>
                            <div className='col-12 col-sm-6'>
                              <Image
                                src={this.state.identity_proof}
                                className='proof-image'
                              />
                            </div>
                          </div>
                        )}

                      {this.state.kyc && this.state.kyc.length ? (
                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Button
                              className='btn btn-link'
                              onClick={() =>
                                this.setState({ showKYC: !this.state.showKYC })
                              }
                            >
                              <FontAwesomeIcon
                                icon={this.state.showKYC ? faMinus : faPlus}
                              />{' '}
                              {this.state.showKYC
                                ? 'Hide KYC Documents'
                                : 'Show KYC Documents'}
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {this.state.showKYC ? (
                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            {this.state.kyc.map((doc, index) => {
                              if (index < 2) {
                                return (
                                  <Image
                                    key={index}
                                    className='kyc-image'
                                    src={doc.url}
                                  ></Image>
                                );
                              }
                            })}
                          </div>
                        </div>
                      ) : null}

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
                              placeholder='Other Langauge'
                              disabled={!formData.languages.includes('Other')}
                              value={
                                formData.languages.includes('Other')
                                  ? formData.other_language
                                  : ''
                              }
                              onChange={(e) =>
                                this.setStateValues('other_language', e)
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='mealPreference'>
                            <Form.Label>Meal Preference</Form.Label>
                            <Form.Control
                              as='select'
                              value={formData.meal_preference}
                              onChange={(e) =>
                                this.setStateValues('meal_preference', e)
                              }
                            >
                              <option value=''>
                                Please select a Meal Preference
                              </option>
                              <option value='Veg'>Veg</option>
                              <option value='Non-veg'>Non Veg</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderweight'>
                            <Form.Label>Weight</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Weight in KG.'
                              value={formData.weight}
                              onChange={(e) => this.setStateValues('weight', e)}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='marital_status'>
                            <Form.Label>Marital Status</Form.Label>
                            <Form.Control
                              as='select'
                              value={formData.marital_status}
                              onChange={(e) =>
                                this.setStateValues('marital_status', e)
                              }
                            >
                              <option value=''>
                                Please select a Marital Status
                              </option>
                              <option value='Single'>Single</option>
                              <option value='Married'>Married</option>
                              <option value='Divorced'>Divorced</option>
                              <option value='Other'>Other</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='exp_year'>
                            <Form.Label>Work Experience</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Work Experience in Years.'
                              value={formData.exp_year}
                              onChange={(e) =>
                                this.setStateValues('exp_year', e)
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='edu_qualification'>
                            <Form.Label>Education Qualification</Form.Label>
                            <Form.Control
                              as='select'
                              value={formData.edu_qualification}
                              onChange={(e) =>
                                this.setStateValues('edu_qualification', e)
                              }
                            >
                              <option value=''>
                                Please select Education Qualification
                              </option>
                              <option value='No formal education'>
                                No formal education
                              </option>
                              <option value='Primary education'>
                                Primary education
                              </option>
                              <option value='Secondary education or high school'>
                                Secondary education or high school
                              </option>
                              <option value='Vocational qualification'>
                                Vocational qualification
                              </option>
                              <option value="Bachelor's degree">
                                Bachelor's degree
                              </option>
                              <option value="Master's degree">
                                Master's degree
                              </option>
                              <option value='Doctorate or higher'>
                                Doctorate or higher
                              </option>
                              <option value='Other'>Other</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='other_qualification'>
                            <Form.Label>Other Qualification</Form.Label>
                            <Form.Control
                              type='text'
                              disabled={
                                !(formData.edu_qualification === 'Other')
                              }
                              value={formData.other_qualification}
                              placeholder='Other Qualification.'
                              onChange={(e) =>
                                this.setStateValues('other_qualification', e)
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='previousWork'>
                            <Form.Label>Previous Work</Form.Label>
                            <Form.Control
                              type='text'
                              value={formData.previous_work}
                              placeholder='Previous Work Experience'
                              onChange={(e) =>
                                this.setStateValues('previous_work', e)
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='about_yourself'>
                            <Form.Label>About Yourself</Form.Label>
                            <Form.Control
                              as='textarea'
                              value={formData.about_yourself}
                              placeholder='About Yourself'
                              onChange={(e) =>
                                this.setStateValues('about_yourself', e)
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group>
                            <Form.Label>Responder Profile Video</Form.Label>
                            {formData.video_id ? (
                              <div className='existing-attachments-item d-flex align-items-center justify-content-between'>
                                <p className='existing-attachments-text'>
                                  {formData.video_id}
                                </p>
                                <div className='existing-attachments-options'>
                                  {this.idUrlMapping[formData.video_id] ? (
                                    <a
                                      download={true}
                                      target='_blank'
                                      title='Download'
                                      rel='noopener noreferrer'
                                      className='button button-link'
                                      href={
                                        this.idUrlMapping[formData.video_id]
                                      }
                                    >
                                      <FontAwesomeIcon icon={faFileDownload} />
                                    </a>
                                  ) : (
                                    ''
                                  )}
                                  <button
                                    type='button'
                                    title='Remove'
                                    className='existing-attachments-remove'
                                    onClick={() =>
                                      this.removeUploadVideo(formData.video_id)
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <S3FileUploader
                                file_type={'responder_profile_video'}
                                obj_type={'video'}
                                loader={this.setLoader}
                                uploadS3API={UPLOAD_S3_URL}
                                allowedStrings={
                                  'flv,webm,mp4,3gpp,x-msvideo,quicktime,mkv,wmv'
                                }
                                uploadSuccessCallback={this.videoUpload}
                              />
                            )}
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-12'>
                          <Form.Group>
                            <Form.Label>Education Documents</Form.Label>
                            {formData.edu_docs &&
                              formData.edu_docs.length !== 0 && (
                                <div className='existing-attachments'>
                                  {formData.edu_docs.map((id, index) => {
                                    return (
                                      <div
                                        className='existing-attachments-item d-flex align-items-center justify-content-between'
                                        key={formData.edu_docs[index]}
                                      >
                                        <p className='existing-attachments-text'>
                                          {formData.edu_docs[index]}
                                        </p>

                                        <div className='existing-attachments-options'>
                                          {this.idUrlMapping[
                                            formData.edu_docs[index]
                                          ] ? (
                                            <a
                                              download={true}
                                              target='_blank'
                                              title='Download'
                                              rel='noopener noreferrer'
                                              className='button button-link'
                                              href={
                                                this.idUrlMapping[
                                                  formData.edu_docs[index]
                                                ]
                                              }
                                            >
                                              <FontAwesomeIcon
                                                icon={faFileDownload}
                                              />
                                            </a>
                                          ) : (
                                            ''
                                          )}
                                          <button
                                            type='button'
                                            title='Remove'
                                            className='existing-attachments-remove'
                                            onClick={() =>
                                              this.removeEduDocs(
                                                formData.edu_docs[index]
                                              )
                                            }
                                          >
                                            <FontAwesomeIcon
                                              icon={faTrashAlt}
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                            <S3FileUploader
                              file_type={'edu_docs'}
                              obj_type={'doc'}
                              loader={this.setLoader}
                              uploadS3API={UPLOAD_S3_URL}
                              allowedStrings={'jpeg,png,jpg,pdf,docx,doc etc.'}
                              uploadSuccessCallback={this.appendEduDocs}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <Button
                        onClick={() => this.updateProfileHanlder()}
                        type='button'
                        className='btn btn-primary'
                      >
                        Save
                      </Button>
                    </div>
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
const mapsStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  getResponderConfig,
  getCountryCodesList,
  responderList,
  updateResponderAvailibilty,
  updateUserStatus,
  updateResponder,
};

export default hasPermission(
  requireAuth(connect(mapsStateToProps, mapDispatchToProps)(ViewResponderPage))
);

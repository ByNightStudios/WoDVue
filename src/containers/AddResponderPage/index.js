/*global google*/

import React from 'react';
import moment from 'moment';

import { connect } from 'react-redux';
import { Button, Form, Image } from 'react-bootstrap';
import { notification, Select, Input, DatePicker, Checkbox, Modal } from 'antd';

import { getRenderingHeader } from '../../common/helpers';
import { addResponder } from '../../actions/ResponderActions';
import { UPLOAD_S3_URL } from '../../common/backendConstants';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getResponderConfig } from '../../actions/ConfigActions';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import requireAuth from '../../hoc/requireAuth';
import hasPermission from '../../hoc/hasPermission';
import PageLoader from '../../components/PageLoader';
import ImageUpload from '../../components/ImageUpload';
import FileSelector from '../../components/FileSelector';
import SideNavigation from '../../components/SideNavigation';
import S3FileUploader from '../../components/S3FileUploader';
import ResponderService from '../../service/ResponderService';
import LanguagesSpoken from '../../components/LanguagesSpoken';
import styles from './add-responder-page.scss';

const { TextArea } = Input;
const { confirm } = Modal;

class AddResponderPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      first_name: null,
      last_name: null,
      mobile_number: null,
      gender: null,
      location: null,
      loader: false,
      location_code: null,
      image_uuid: null,
      country_code: '91',
      countryCodesList: [],
      formatted_mobile_number: null,
      service_type: '',
      city: '',
      responderTypes: [],
      showOtherServiceInput: false,
      otherServiceType: '',
      pincode: '',
      state: '',
      email: '',
      loc_check: '',
      kyc_check: '',
      veri_status: '',
      region_owner: '',
      country: '',
      locality: '',
      geo_location: null,
      identity_proof_id: null,
      identity_proof: null,
      dob: null,
      anniversary: null,
      aadhaar: '',
      languages: [],
      other_language: '',
      meal_preference: '',
      weight: '',
      marital_status: '',
      exp_year: '',
      edu_qualification: '',
      other_qualification: '',
      previous_work: '',
      edu_docs: [],
      video_id: '',
      about_yourself: '',
      profile_completed: true,
      rhHub: '',
      responderType: ''
    };

    this.responderService = new ResponderService();
    this.idNameMapping = {};
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Add a responder';
    this.getResponderConfig();
    this.renderGoogleMaps();
  }

  setLoader = (loader) => {
    this.setState({
      loader,
    });
  };

  getResponderConfig() {
    this.props
      .getResponderConfig('country_codes')
      .then((result) => {
        this.setState({
          countryCodesList: result.country_codes,
          responderTypes: result.responder_types,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  uploadedImageData = (image_uuid) => {
    this.setState({ image_uuid });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  setLanguages = (language) => {
    console.log(language, 'Setlangaugae');
    this.setStateValues(language, 'languages');
  };

  setStateValues = (e, field) => {
    let value;
    if (field === 'languages') {
      value = e;
    } else if (field !== 'dob' && field !== 'anniversary') {
      value = e.currentTarget.value;
    } else {
      value = e ? moment(e._d).format('YYYY-MM-DD 00:00:00') : null;
    }
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);

    if (field === 'service_type' && value === 'Other') {
      this.setState({ showOtherServiceInput: true });
    } else if (field === 'service_type' && value !== 'Other') {
      this.setState({ showOtherServiceInput: false, otherServiceType: '' });
    }

    if (field === 'edu_qualification') {
      if (!(value === 'Other')) {
        this.setState((state) => ({
          ...state,
          other_qualification: '',
        }));
      }
    } else if (field === 'languages') {
      if (!this.state.languages.includes('Other')) {
        this.setState((state) => ({
          ...state,
          other_language: '',
        }));
      }
    }
  };

  onCancel = () => {};

  addResponderHandler = async (e) => {
    e.preventDefault();

    const mobileRegex = /^[0-9]*$/;
    const regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    let {
      first_name,
      mobile_number,
      country_code,
      aadhaar,
      languages,
      other_language,
      edu_qualification,
      other_qualification,
      weight,
      exp_year,
      rhHub,
    } = this.state;

    if (first_name === null || first_name === '')
      return this.openNotification('Error', 'First name is required.', 0);
    if (mobile_number === null || mobile_number === '')
      return this.openNotification('Error', 'Mobile Number is required.', 0);

    // mobile_number = mobile_number.replace(/-/g, '');

    if (!mobileRegex.test(mobile_number)) {
      return this.openNotification('Error', 'Mobile number is invalid.', 0);
    }

    let formatted_mobile_number = `+${country_code}${mobile_number}`;

    if (!regex.test(formatted_mobile_number))
      return this.openNotification('Error', 'Mobile Number is invalid.', 0);

    if (aadhaar && aadhaar.length !== 12) {
      return this.openNotification('Error', 'Aadhaar Number is invalid.', 0);
    }
    if (languages.includes('Other') && other_language === '') {
      return this.openNotification('Error', 'Please fill Other Language', 0);
    }
    if (weight !== null && weight !== '') {
      const fweight = parseInt(weight);
      if (isNaN(fweight) || fweight < 1 || fweight > 999) {
        return this.openNotification(
          'Error',
          'Please enter correct weight in three digits in between (1-999).',
          0
        );
      }
    }
    if ((exp_year !== null) & (exp_year !== '')) {
      const fexp_year = parseInt(exp_year);
      if (isNaN(fexp_year) || fexp_year < 0 || fexp_year > 60) {
        return this.openNotification(
          'Error',
          'Please enter correct work experience in two digits in between (0-99).',
          0
        );
      }
    }
    if (edu_qualification === 'Other' && other_qualification === '') {
      return this.openNotification(
        'Error',
        'Please fill Other Qualification',
        0
      );
    }
    await this.setState({
      loader: true,
      formatted_mobile_number,
      mobile_number,
    });

    this.props
      .addResponder(this.props.user.id, this.state)
      .then((result) => {
        this.openNotification('Success', 'Responder Added Successfully.', 1);
        this.props.history.push('/responders');
        this.setState({ loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification('Error', error.message, 0);
      });
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

  renderGoogleMaps = () => {
    var latlng = new google.maps.LatLng(39.305, -76.617);

    var map = new google.maps.Map(document.getElementById(`map`), {
      zoom: 13,
      center: latlng,
      mapTypeId: 'roadmap',
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById(`pac-input`);
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

          this.setState({ geo_location: { geo_latitude, geo_longitude } });
        });

        let geo_latitude = place.geometry.location.lat();
        let geo_longitude = place.geometry.location.lng();

        this.setState({
          geo_location: {
            geo_latitude,
            geo_longitude,
          },
        });
      });

      map.fitBounds(bounds);
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
          identity_proof_id: result.data.id,
          identity_proof: result.data.url,
          loader: false,
        });
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification('Error', 'Please try again.', 0);
      });
  };

  videoUpload = (id, name) => {
    this.idNameMapping[id] = name;
    this.setState((state) => ({
      ...state,
      video_id: id,
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
          video_id: '',
        }));
      },
      onCancel() {
        return;
      },
    });
  };

  appendEduDocs = (id, name) => {
    this.idNameMapping[id] = name;
    const edu_docs = Object.assign([], this.state.edu_docs);
    edu_docs.push(id);
    this.setState((state) => ({
      ...state,
      edu_docs,
    }));
  };

  removeDoc = (id) => {
    const previous_docs = Object.assign([], this.state.edu_docs);
    const edu_docs = previous_docs.filter((doc) => {
      return doc !== id;
    });
    this.setState((state) => ({
      ...state,
      edu_docs,
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
    const { navigationDeployed } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? 'addresponder-page addelders-page sidebar-page sidebar-page--open position-relative'
              : 'addresponder-page addelders-page sidebar-page sidebar-page--closed position-relative'
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
                <h2>Add a Responder</h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-12 col-sm-8'>
                  <div className='form-container'>
                    <Form className='map-responder-form'>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Display Picture</Form.Label>
                            <ImageUpload
                              uploadTitle='Photo'
                              onImageUpload={this.uploadedImageData}
                              notification={this.openNotification}
                              type='Media'
                              owner_type='User'
                              file_type='1'
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
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
                          <Form.Group controlId='responderFirstName'>
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
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Contact Number</Form.Label>
                            <div className='d-flex justify-content-start'>
                              <Select
                                showSearch
                                style={{ width: 125, marginRight: '8px' }}
                                notFoundContent={null}
                                showArrow={false}
                                defaultValue={this.state.country_code}
                                optionFilterProp='children'
                                onChange={(value) =>
                                  this.setState({ country_code: value })
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
                        <div>
                        <Form.Label>RH Hub</Form.Label>
                            <div className='d-flex justify-content-start'>
                              <Select
                                showSearch
                                style={{ width: 300, marginRight: '8px' }}
                                notFoundContent={null}
                                showArrow={false}
                                defaultValue={this.state.rhHub}
                                optionFilterProp='children'
                                onChange={(value) =>
                                  this.setState({ rhHub: value })
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
                                <Select.Option value="Gurgaon Sector 55">
                                         Gurgaon Sector 55
                                </Select.Option>
                                <Select.Option  value="Gurgaon Sector 39">
                                      Gurgaon Sector 39
                                </Select.Option>
                                <Select.Option value="Noida Sector 46">
                                      Noida Sector 46
                                </Select.Option>
                                <Select.Option value="Green Park">
                                      Green Park
                                </Select.Option>
                                <Select.Option value="Dwarka">
                                      Dwarka
                                </Select.Option>
                              </Select>
                              </div>
                        </div>
                        <div>                            
                        </div>
                        

                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderGender'>
                            <Form.Label>Gender</Form.Label>
                            <Form.Control
                              as='select'
                              onChange={(e) => this.setStateValues(e, 'gender')}
                            >
                              <option value={null}>
                                Please select a gender
                              </option>
                              <option value='1'>Male</option>
                              <option value='2'>Female</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderDateOfBirth'>
                            <Form.Label>Date of Birth</Form.Label>
                            <DatePicker
                              onChange={(e) => this.setStateValues(e, 'dob')}
                              disabledDate={(d) => d.isAfter(moment())}
                            />
                          </Form.Group>
                        </div>

                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='elderDateOfBirth'>
                            <Form.Label>Date of Anniversary</Form.Label>
                            <DatePicker
                              onChange={(e) =>
                                this.setStateValues(e, 'anniversary')
                              }
                              disabledDate={(d) => d.isAfter(moment())}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Address </Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='West Zone Gurguram'
                              onChange={(e) =>
                                this.setStateValues(e, 'location')
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Location Code</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='(WZ-1)'
                              onChange={(e) =>
                                this.setStateValues(e, 'location_code')
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='user@gmail.com'
                              onChange={(e) => this.setStateValues(e, 'email')}
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderGender'>
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                              type='text'
                              onChange={(e) =>
                                this.setStateValues(e, 'country')
                              }
                              placeholder='India'
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Delhi'
                              onChange={(e) => this.setStateValues(e, 'state')}
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderGender'>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type='text'
                              onChange={(e) => this.setStateValues(e, 'city')}
                              placeholder='New Delhi'
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Locality</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Sector 10'
                              onChange={(e) =>
                                this.setStateValues(e, 'locality')
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderGender'>
                            <Form.Label>Pin Code</Form.Label>
                            <Form.Control
                              type='text'
                              onChange={(e) =>
                                this.setStateValues(e, 'pincode')
                              }
                              placeholder='110059'
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
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Responder Type</Form.Label>
                            <Form.Control
                              as='select'
                              onChange={(e) =>
                                this.setStateValues(e, 'service_type')
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
                                onChange={(e) =>
                                  this.setStateValues(e, 'otherServiceType')
                                }
                                placeholder='Helper'
                              />
                            </Form.Group>
                          </div>
                        ) : null}
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>LOC Check</Form.Label>
                            <Form.Control
                              as='select'
                              value={this.state.loc_check}
                              onChange={(e) =>
                                this.setStateValues(e, 'loc_check')
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
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>KYC Check</Form.Label>
                            <Form.Control
                              as='select'
                              value={this.state.kyc_check}
                              onChange={(e) =>
                                this.setStateValues(e, 'kyc_check')
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
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Verification Status</Form.Label>
                            <Form.Control
                              as='select'
                              value={this.state.veri_status}
                              onChange={(e) =>
                                this.setStateValues(e, 'veri_status')
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
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Region Owner</Form.Label>
                            <Form.Control
                              type='text'
                              value={this.state.region_owner}
                              onChange={(e) =>
                                this.setStateValues(e, 'region_owner')
                              }
                              placeholder='Region Owner'
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Aadhaar Number</Form.Label>
                            <Form.Control
                              type='text'
                              value={this.state.aadhaar}
                              onChange={(e) =>
                                this.setStateValues(e, 'aadhaar')
                              }
                              placeholder='123412341234'
                            />
                          </Form.Group>
                        </div>
                      </div>

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

                      {/* <div className='row'>
                        <div className='col-12 col-sm-12'>
                          <Form.Group controlId='languagesSpoken'>
                            <Form.Label>Languages Spoken</Form.Label>
                            <div className='form-multicheck'>
                              <Checkbox.Group
                                options={this.state.languagesTypes}
                                value={this.state.languages}
                                onChange={(e) =>
                                  this.setStateValues(e, 'languages')
                                }
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </div> */}
                      <LanguagesSpoken
                        option={this.state.languages}
                        onChange={this.setLanguages}
                      />

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='otherLanguage'>
                            <Form.Label>Other Language</Form.Label>
                            <Form.Control
                              type='text'
                              disabled={!this.state.languages.includes('Other')}
                              value={
                                this.state.languages.includes('Other')
                                  ? this.state.other_language
                                  : ''
                              }
                              placeholder='Other Langauge'
                              onChange={(e) =>
                                this.setStateValues(e, 'other_language')
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
                              value={this.state.meal_preference}
                              onChange={(e) =>
                                this.setStateValues(e, 'meal_preference')
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
                              value={this.state.weight}
                              onChange={(e) => this.setStateValues(e, 'weight')}
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
                              value={this.state.marital_status}
                              onChange={(e) =>
                                this.setStateValues(e, 'marital_status')
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
                              value={this.state.exp_year}
                              onChange={(e) =>
                                this.setStateValues(e, 'exp_year')
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
                              value={this.state.edu_qualification}
                              onChange={(e) =>
                                this.setStateValues(e, 'edu_qualification')
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
                                !(this.state.edu_qualification === 'Other')
                              }
                              value={this.state.other_qualification}
                              placeholder='Other Qualification.'
                              onChange={(e) =>
                                this.setStateValues(e, 'other_qualification')
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
                              value={this.state.previous_work}
                              placeholder='Previous Work Experience'
                              onChange={(e) =>
                                this.setStateValues(e, 'previous_work')
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='about_yourself'>
                            <Form.Label>Tell Us About Yourself</Form.Label>
                            <Form.Control
                              as='textarea'
                              value={this.state.about_yourself}
                              placeholder='Tell Us About Yourself...'
                              onChange={(e) =>
                                this.setStateValues(e, 'about_yourself')
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group>
                            <Form.Label>Upload Video</Form.Label>
                            {this.state.video_id ? (
                              <div className='existing-attachments-item d-flex align-items-center justify-content-between'>
                                <p className='existing-attachments-text'>
                                  {this.idNameMapping[this.state.video_id]}
                                </p>
                                <button
                                  type='button'
                                  title='Remove'
                                  className='existing-attachments-remove'
                                  onClick={() =>
                                    this.removeUploadVideo(this.state.video_id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
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
                            <Form.Label>Upload Education Documents</Form.Label>

                            {this.state.edu_docs &&
                              this.state.edu_docs.length !== 0 && (
                                <div className='existing-attachments'>
                                  {this.state.edu_docs.map((id, index) => {
                                    return (
                                      <div
                                        className='existing-attachments-item d-flex align-items-center justify-content-between'
                                        key={this.state.edu_docs[index]}
                                      >
                                        <p className='existing-attachments-text'>
                                          {
                                            this.idNameMapping[
                                              this.state.edu_docs[index]
                                            ]
                                          }
                                        </p>
                                        <button
                                          type='button'
                                          title='Remove'
                                          className='existing-attachments-remove'
                                          onClick={() =>
                                            this.removeEduDocs(
                                              this.state.edu_docs[index]
                                            )
                                          }
                                        >
                                          <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
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

                      {this.state.identity_proof ? (
                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Image
                              src={this.state.identity_proof}
                              className='proof-image'
                            />
                          </div>
                        </div>
                      ) : null}

                      <Button
                        className='btn btn-primary'
                        onClick={(e) => this.addResponderHandler(e)}
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
    connect(mapStateToProps, { addResponder, getResponderConfig })(
      AddResponderPage
    )
  )
);

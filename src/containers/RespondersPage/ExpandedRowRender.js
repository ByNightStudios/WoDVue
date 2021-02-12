/*global google*/

import React from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  updateResponder,
  updateResponderAvailibilty,
} from '../../actions/ResponderActions';
import { Switch, Select, Input, notification } from 'antd';
import {
  getCountryCodesList,
  getResponderConfig,
} from '../../actions/ConfigActions';

import PageLoader from '../../components/PageLoader';
import ImageUpload from '../../components/ImageUpload';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ResponderService from '../../service/ResponderService';
import FileSelector from '../../components/FileSelector';

const { TextArea } = Input;
class ExpandedRowRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: this.props.record.first_name,
      last_name: this.props.record.last_name,
      mobile_number: this.props.record.mobile_number,
      country_code: this.props.record.country_code,
      gender: this.props.record.gender,
      location: this.props.record.owner.location,
      city: this.props.record.owner.city,
      service_type: this.props.record.owner.service_type,
      loader: false,
      is_available: this.props.record.is_available,
      location_code: this.props.record.owner.location_code,
      image_url: this.props.record.image_url
        ? this.props.record.image_url
        : null,
      image_uuid: null,
      countryCodesList: [],
      formatted_mobile_number: null,
      responderTypes: [],
      kyc: [],
      showKYC: false,
      showOtherServiceInput: false,
      otherServiceType: '',
      state: this.props.record.owner.state,
      pincode: this.props.record.owner.pincode,
      email: this.props.record.email,
      loc_check: this.props.record.owner.loc_check,
      kyc_check: this.props.record.owner.kyc_check,
      veri_status: this.props.record.owner.veri_status,
      region_owner: this.props.record.owner.region_owner,
      country: this.props.record.owner.country,
      locality: this.props.record.owner.locality,
      geo_location: this.props.record.owner.geo_location,
      identity_proof_id: null,
      identity_proof: null,
      showIdentityProof: false,
    };

    this.responderService = new ResponderService();
  }

  componentDidMount() {
    this.getResponderConfig();
    this.getResponderKYC();
    this.renderGoogleMaps();
  }

  getResponderConfig() {
    this.props
      .getResponderConfig('country_codes')
      .then((result) => {
        this.setState(
          {
            countryCodesList: result.country_codes,
            responderTypes: result.responder_types,
          },
          () => {
            if (
              this.props.record.owner.service_type &&
              !result.responder_types.includes(
                this.props.record.owner.service_type
              )
            ) {
              this.setState({
                responderTypes: [
                  this.props.record.owner.service_type,
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

  setStateValues = (e, field) => {
    let value = e.currentTarget.value;
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);

    if (field === 'service_type' && value === 'Other') {
      this.setState({ showOtherServiceInput: true });
    } else if (field === 'service_type' && value !== 'Other') {
      this.setState({ showOtherServiceInput: false, otherServiceType: '' });
    }
  };

  updateResponderHandler = async (e) => {
    e.preventDefault();

    let {
      first_name,
      mobile_number,
      last_name,
      gender,
      location,
      location_code,
      image_uuid,
      country_code,
      city,
      service_type,
      otherServiceType,
      state,
      pincode,
      email,
      loc_check,
      kyc_check,
      veri_status,
      region_owner,
      country,
      locality,
      geo_location,
      identity_proof_id,
    } = this.state;

    mobile_number = mobile_number.replace(/-/g, '');

    let details = {
      user_type: 2,
      first_name,
      mobile_number,
      last_name,
      gender,
      location,
      location_code,
      country_code,
      city,
      service_type: otherServiceType ? otherServiceType : service_type,
      state,
      pincode,
      email,
      loc_check,
      kyc_check,
      veri_status,
      region_owner,
      country,
      locality,
      geo_location: JSON.stringify(geo_location),
      identity_proof_id,
    };

    if (image_uuid) details = { ...details, image_uuid };

    if (first_name === null || first_name === '')
      return this.props.onClick('Error', 'First name is required.', 0);
    if (mobile_number === null || mobile_number === '')
      return this.props.onClick('Error', 'Mobile Number is required.', 0);

    let formatted_mobile_number = `+${country_code.replace(
      /-/g,
      ''
    )}${mobile_number}`;
    let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    if (!regex.test(formatted_mobile_number))
      return this.props.onClick('Error', 'Mobile Number is invalid.', 0);

    await this.setState({
      loader: true,
      formatted_mobile_number,
      mobile_number,
    });
    details = { ...details, formatted_mobile_number };
    this.props
      .updateResponder(this.props.user.id, this.props.record.id, details)
      .then((result) => {
        this.props.onClick('Success', 'Details Updated Successfully.', 1);
        this.setState({ loader: false, showIdentityProof: false });
        this.getResponderKYC();
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.props.onClick('Error', error.message, 0);
      });
  };

  onSwitchToggle = (checked) => {
    let status;

    if (this.props.record.is_available) status = 0;
    else status = 1;
    this.setState({ loader: true });
    this.props
      .updateResponderAvailibilty(this.props.record.id, status)
      .then((result) => {
        this.props.onClick(
          'Success',
          'Responder Availibility Updated Successfully.',
          1
        );
        this.setState({ loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.props.onClick('Error', error.message, 0);
      });
  };

  uploadedImageData = (image_uuid) => {
    this.setState({ image_uuid });
  };

  openNotification = (message, description, status) => {
    this.props.onClick(message, description, status);
  };

  showNotification = (message, description, status) => {
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

  googleMapsRedirector = () => {
    let geoLatitude = 28.4250203;
    let geoLongitude = 77.0658533;

    const { geo_location } = this.props.record.owner;
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

  getResponderKYC = () => {
    this.responderService
      .getResponderKYC({ responder_id: this.props.record.id })
      .then((res) => {
        this.setState({ kyc: res.data ? res.data : [] });
      })
      .catch((error) => {
        this.openNotification('Error', 'Could not fetch KYC documents.', 0);
      });
  };

  renderGoogleMaps = () => {
    var latlng = new google.maps.LatLng(39.305, -76.617);
    const { geo_location } = this.props.record.owner;

    if (geo_location) {
      latlng = new google.maps.LatLng(
        parseFloat(geo_location.geo_latitude),
        parseFloat(geo_location.geo_longitude)
      );
    }

    var map = new google.maps.Map(
      document.getElementById(`map-${this.props.record.id}`),
      {
        zoom: 13,
        center: latlng,
        mapTypeId: 'roadmap',
      }
    );

    if (this.props.record.owner.geo_location) {
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
    var input = document.getElementById(`pac-input-${this.props.record.id}`);
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
          showIdentityProof: true,
        });
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification('Error', 'Please try again.', 0);
      });
  };

  render() {
    return (
      <div className='responder-information'>
        <div className='row'>
          <div className='responder-information-column col-12 col-sm-6'>
            <div className='responder-information-wrapper'>
              <h5>
                Edit Responder Information{' '}
                <Switch
                  style={{ marginLeft: '4px' }}
                  checkedChildren='Available'
                  unCheckedChildren='Unavailable'
                  defaultChecked={this.state.is_available ? true : false}
                  onChange={(e) => this.onSwitchToggle(e)}
                />
              </h5>

              <Form className='map-responder-form'>
                <hr />
                <div className='row'>
                  <div className='col-12'>
                    <Form.Group>
                      <Form.Label>Display Picture</Form.Label>
                      <ImageUpload
                        uploadTitle='Photo'
                        onImageUpload={this.uploadedImageData}
                        image_url={this.state.image_url}
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
                        value={this.state.first_name}
                        placeholder='Vikram'
                        onChange={(e) => this.setStateValues(e, 'first_name')}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderFirstName'>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type='text'
                        value={this.state.last_name}
                        placeholder='Batra'
                        onChange={(e) => this.setStateValues(e, 'last_name')}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderFirstName'>
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
                          {this.state.countryCodesList.map((code, index) => {
                            return (
                              <Select.Option key={code} value={code}>
                                +{code}
                              </Select.Option>
                            );
                          })}
                        </Select>
                        <Form.Control
                          type='number'
                          value={this.state.mobile_number}
                          placeholder='9876543210'
                          onChange={(e) =>
                            this.setStateValues(e, 'mobile_number')
                          }
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderGender'>
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        as='select'
                        value={this.state.gender}
                        onChange={(e) => this.setStateValues(e, 'gender')}
                      >
                        <option value='1'>Male</option>
                        <option value='2'>Female</option>
                        <option value='3'>Others</option>
                      </Form.Control>
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
                        onChange={(e) => this.setStateValues(e, 'location')}
                        value={this.state.location}
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
                        value={this.state.location_code}
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
                        value={this.state.email}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderGender'>
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type='text'
                        value={this.state.country}
                        onChange={(e) => this.setStateValues(e, 'country')}
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
                        value={this.state.state}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderGender'>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type='text'
                        value={this.state.city}
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
                        onChange={(e) => this.setStateValues(e, 'locality')}
                        value={this.state.locality}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderGender'>
                      <Form.Label>Pin Code</Form.Label>
                      <Form.Control
                        type='text'
                        value={this.state.pincode}
                        onChange={(e) => this.setStateValues(e, 'pincode')}
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
                        id={`pac-input-${this.props.record.id}`}
                      />

                      <div
                        id={`map-${this.props.record.id}`}
                        className='google-map'
                      ></div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderFirstName'>
                      <Form.Label>Responder Type</Form.Label>
                      <Form.Control
                        as='select'
                        value={this.state.service_type}
                        onChange={(e) => this.setStateValues(e, 'service_type')}
                      >
                        <option value=''>Please select a type</option>
                        {this.state.responderTypes.length
                          ? this.state.responderTypes.map((type, index) => {
                              return (
                                <option key={index} value={type}>
                                  {type}
                                </option>
                              );
                            })
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
                          value={this.state.otherServiceType}
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
                        onChange={(e) => this.setStateValues(e, 'loc_check')}
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
                        onChange={(e) => this.setStateValues(e, 'kyc_check')}
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
                        onChange={(e) => this.setStateValues(e, 'veri_status')}
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
                        onChange={(e) => this.setStateValues(e, 'region_owner')}
                        placeholder='Region Owner'
                      />
                    </Form.Group>
                  </div>
                </div>

                {this.props.record.owner.geo_location ? (
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
                  <div className='col-12 col-sm-6'>
                    <Form.Group>
                      <Form.Label>Upload KYC</Form.Label>
                      <FileSelector
                        openNotification={this.showNotification}
                        onSelection={this.onFileSelection}
                        maxFileSize={10000}
                        fileType='image'
                      />
                    </Form.Group>
                  </div>
                </div>

                {this.state.showIdentityProof && this.state.identity_proof ? (
                  <div className='row'>
                    <div className='col-12 col-sm-6'>
                      <Image
                        src={this.state.identity_proof}
                        className='proof-image'
                      />
                    </div>
                  </div>
                ) : null}

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
                <Button
                  className='btn btn-primary'
                  onClick={(e) => this.updateResponderHandler(e)}
                >
                  Save Changes
                </Button>
              </Form>
            </div>
          </div>
        </div>
        {this.state.loader ? <PageLoader /> : null}
      </div>
    );
  }
}

const mapsStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapsStateToProps, {
  updateResponder,
  updateResponderAvailibilty,
  getCountryCodesList,
  getResponderConfig,
})(ExpandedRowRender);

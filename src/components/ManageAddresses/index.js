/* global google */
import React from 'react';

import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Empty } from 'antd';
import { get } from 'lodash';
import {
  faEdit,
  faMapMarkerAlt,
  faTrashAlt,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  getCountries,
  getStates,
  getCities,
} from '../../actions/LocationAction';
import {
  removeElderAddress,
  addElderAddress,
  updateElderAddress,
} from '../../actions/ElderActions';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';
import AddressManagerFile from './dataManager';

const AddressManager = new AddressManagerFile();

const { confirm } = Modal;

const defaultFormData = {
  city: null,
  state: null,
  country: null,
  addressLine1: '',
  addressLine2: '',
  geoLatitude: '',
  geoLongitude: '',
  addLocationInput: '',
  addressID: null,
  default: '0',
};
class ManageAddresses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      states: [],
      cities: [],
      addAddress: true,
      editAddress: false,
      defaultPosition: {
        lat: 28.4250203,
        lng: 77.0658533,
      },
      formData: Object.assign({}, defaultFormData),
    };
  }

  componentDidMount() {
    this.getCountriesList();
    this.renderGoogleMaps();
  }

  getCountriesList() {
    this.props.startLoader();
    this.props
      .getCountries()
      .then(result => {
        this.setState({ countries: result.data });
        this.props.stopLoader();
      })
      .catch(error => {
        this.props.openNotification('Error', error.response.data.message, 0);
        this.props.stopLoader();
      });
  }

  getStatesList(country) {
    this.props.startLoader();
    this.props
      .getStates(country)
      .then(result => {
        this.setState({ states: result.data });
        this.props.stopLoader();
      })
      .catch(error => {
        this.props.openNotification('Error', error.response.data.message, 0);
        this.props.stopLoader();
      });
  }

  getCitiesList(state) {
    this.props.startLoader();
    this.props
      .getCities(state)
      .then(result => {
        this.props.stopLoader();
        this.setState({ cities: result.data });
      })
      .catch(error => {
        this.props.openNotification('Error', error.response.data.message, 0);
        this.props.stopLoader();
      });
  }

  googleMapsRedirector = address => {
    let geoLatitude = 28.4250203;
    let geoLongitude = 77.0658533;

    if (address.geo_latitude && address.geo_longitude) {
      geoLatitude = address.geo_latitude;
      geoLongitude = address.geo_longitude;
    }

    window.open(
      `https://google.com/maps?q=${geoLatitude},${geoLongitude}`,
      '_blank',
    );
  };

  addAddressHandler = () => {
    let formData = Object.assign({}, this.state.formData);
    const userID = this.props.elderData.id;
    formData = {
      ...this.state.formData,
      userID,
    };
    const { latitude, longitude } = formData;
    if (latitude && !latitude.match(/((\d+)+(\.\d+))$/)) {
      return this.props.openNotification(
        'Error',
        'Latitude is in incorrect format. Please check and try again.',
        0,
      );
    }
    if (longitude && !longitude.match(/((\d+)+(\.\d+))$/)) {
      return this.props.openNotification(
        'Error',
        'Longitude is in incorrect format. Please check and try again.',
        0,
      );
    }

    const isFormValid = AddressManager.addAddressValidator(formData);
    if (!isFormValid) {
      return this.props.openNotification(
        'Error',
        'You have either missed a field or data is in incorrect format. Please check and try again.',
        0,
      );
    }

    this.props.startLoader();

    AddressManager.addElderAddress({
      ...this.state.formData,
      userID,
    })
      .then(res => {
        this.props.stopLoader();
        this.props.openNotification(
          'Success',
          'Address Added Successfully.',
          1,
        );
        this.emptyFormData();
        this.updateRedux('add', res.data);
      })
      .catch(error => {
        this.props.stopLoader();
        this.props.openNotification('Error', error.response.data.message, 0);
      });
  };

  editAddressHandler = () => {
    const formData = Object.assign({}, this.state.formData);
    const isFormValid = AddressManager.editAddressValidator(formData);
    if (!isFormValid) {
      return this.props.openNotification(
        'Error',
        'You have either missed a field or data is in incorrect format. Please check and try again.',
        0,
      );
    }
    this.props.startLoader();
    AddressManager.editElderAddress(this.state.formData)
      .then(res => {
        this.props.stopLoader();
        this.props.openNotification(
          'Success',
          'Address Updated Successfully.',
          1,
        );
        this.emptyFormData(true);
        this.updateRedux('update', res.data);
      })
      .catch(error => {
        this.props.stopLoader();
        this.props.openNotification('Error', error.response.data.message, 0);
      });
  };

  deleteElderAddress = (userID, addressID) => {
    this.props.startLoader();
    AddressManager.deleteElderAddress({ userID, addressID })
      .then(res => {
        this.props.stopLoader();
        this.props.openNotification(
          'Success',
          'Address Deleted Successfully.',
          1,
        );
        this.updateRedux('delete', res.data);
      })
      .catch(error => {
        this.props.stopLoader();
        this.props.openNotification('Error', error.response.data.message, 0);
      });
  };

  emptyFormData = (is_edited = false) => {
    const formData = Object.assign({}, defaultFormData);
    this.setState({ formData, editAddress: false, addAddress: true }, () => {
      if (is_edited) {
        this.renderGoogleMaps();
      }
    });
  };

  updateRedux = (type, payload) => {
    switch (type) {
      case 'add':
        this.props.addElderAddress(payload);
        break;
      case 'delete':
        this.props.removeElderAddress(payload);
        break;
      case 'update':
        this.props.updateElderAddress(payload);
      default:
        break;
    }
  };

  setAddressStateValues = (e, field) => {
    let addressLine1;
    let addressLine2;
    let city;
    let state;
    let country;
    let addLocationInput;
    let geoLongitude;
    let geoLatitude;
    const { formData } = this.state;

    if (field === 'addressLine1') {
      addressLine1 = e.currentTarget.value;
      formData.addressLine1 = addressLine1;
      this.setState({ formData });
    } else if (field === 'addressLine2') {
      addressLine2 = e.currentTarget.value;
      formData.addressLine2 = addressLine2;
      this.setState({ formData });
    } else if (field === 'city') {
      city = e.currentTarget.value;
      formData.city = city;
      this.setState({ formData });
    } else if (field === 'country') {
      country = e.currentTarget.value;
      formData.country = country;
      formData.state = '';
      formData.city = '';
      this.setState({ formData });
      this.getStatesList(country);
    } else if (field === 'state') {
      state = e.currentTarget.value;
      formData.state = state;
      formData.city = '';
      this.setState({ formData });
      this.getCitiesList(state);
    } else if (field === 'latitude') {
      state = e.currentTarget.value;
      formData.latitude = state;
      this.setState({ formData });
    } else if (field === 'longitude') {
      state = e.currentTarget.value;
      formData.longitude = state;
      this.setState({ formData });
    } else if (field === 'addLocationInput') {
      addLocationInput = e.currentTarget.value;
      formData.addLocationInput = addLocationInput;
      this.setState({ formData });
    } else if (field === 'default') {
      const default1 = e.currentTarget.value;
      formData.default = default1;
      this.setState({ formData });
    } else if (field === 'geoLatitude') {
      geoLatitude = e.currentTarget.value;
      formData.geoLatitude = geoLatitude;
      this.setState({ formData });
    } else if (field === 'geoLongitude') {
      geoLongitude = e.currentTarget.value;
      formData.geoLongitude = geoLongitude;
      this.setState({ formData });
    }
  };

  fillInAddress(place) {
    const { formData } = this.state;
    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (addressType == 'administrative_area_level_2') {
        formData.city = place.address_components[i].long_name;
      }
      if (addressType == 'administrative_area_level_1') {
        formData.state = place.address_components[i].long_name;
        this.getCitiesList(formData.state);
      }
      if (addressType == 'country') {
        formData.country = place.address_components[i].long_name;
        this.getStatesList(formData.country);
      }
      this.setState({ formData });
    }
  }

  renderGoogleMaps = () => {
    const map = new google.maps.Map(
      document.getElementById(
        this.state.addAddress ? `addLocationMap` : 'editLocationMap',
      ),
      {
        center: this.state.defaultPosition,
        zoom: 13,
        mapTypeId: 'roadmap',
      },
    );

    const input = document.getElementById(
      this.state.addAddress ? `addLocationInput` : 'editLocationInput',
    );
    const searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    let markers = [];
    // TODO - add api key first
    // const geocoder = new google.maps.Geocoder();
    // this.geocodeLatLng(geocoder, map,
    //   this.state.formData.geoLatitude + ' ' + this.state.formData.geoLongitude);
    if (this.state.formData.geoLatitude && this.state.formData.geoLongitude) {
      const latlng = {
        lat: parseFloat(this.state.formData.geoLatitude),
        lng: parseFloat(this.state.formData.geoLongitude),
      };
      const marker = new google.maps.Marker({
        position: latlng,
        map,
      });
      markers.push(marker);
    }

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      this.fillInAddress(places[0]);
      if (places.length === 0) {
        return;
      }

      markers.forEach(marker => {
        marker.setMap(null);
      });

      markers = [];
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            draggable: true,
            title: place.name,
            position: place.geometry.location,
          }),
        );

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        google.maps.event.addListener(markers[0], 'dragend', marker => {
          const geoLatitude = marker.latLng.lat();
          const geoLongitude = marker.latLng.lng();
          const { formData } = this.state;
          formData.geoLatitude = geoLatitude;
          formData.geoLongitude = geoLongitude;
          formData.addLocationInput = place.name;
          const infowindow = new google.maps.InfoWindow({
            content: `${place.name}, ${formData.city}, ${formData.state}, ${
              formData.country
            }`,
          });
          infowindow.open(map, marker);
          this.setState({ formData });
        });

        const geoLatitude = place.geometry.location.lat();
        const geoLongitude = place.geometry.location.lng();
        const { formData } = this.state;
        formData.geoLatitude = geoLatitude;
        formData.geoLongitude = geoLongitude;
        formData.addLocationInput = place.name;

        const infowindow = new google.maps.InfoWindow({
          content: `${place.name}, ${formData.city}, ${formData.state}, ${
            formData.country
          }`,
        });
        const marker = new google.maps.Marker({
          position: { lat: geoLatitude, lng: geoLongitude },
          map,
          title: place.name,
        });
        infowindow.open(map, marker);
        this.setState({ formData });
      });
      map.fitBounds(bounds);
    });
  };

  geocodeLatLng(geocoder, map, input) {
    const latlngStr = input.split(',', 2);
    const latlng = {
      lat: parseFloat(latlngStr[0]),
      lng: parseFloat(latlngStr[1]),
    };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results, 'check it man ');
          map.setZoom(11);
          const marker = new google.maps.Marker({
            position: latlng,
            map,
          });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert(`Geocoder failed due to: ${status}`);
      }
    });
  }

  cancelEditingAddress = () => {
    const formData = Object.assign({}, defaultFormData);
    this.setState(
      {
        formData,
        editAddress: false,
        addAddress: true,
        states: [],
        cities: [],
      },
      () => {
        this.renderGoogleMaps();
      },
    );
  };

  triggerEditAddress = address => {
    if (!address) {
      return;
    }
    const {
      id,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      geo_latitude,
      geo_longitude,
    } = address;

    const formData = {
      userID: this.props.elderData.id,
      addressID: id,
      addressLine1: address_line_1,
      addressLine2: address_line_2,
      city,
      state,
      country,
      geoLatitude: geo_latitude,
      geoLongitude: geo_longitude,
      addLocationInput: '',
      default: address.default ? '1' : '0',
    };

    const defaultPosition = {
      lat: geo_latitude,
      lng: geo_longitude,
    };
    this.getStatesList(country);
    this.getCitiesList(state);

    this.setState(
      { formData, editAddress: true, addAddress: false, defaultPosition },
      () => {
        this.renderGoogleMaps();
      },
    );
  };

  handleDeleteConfirmation = (elder_id, address_id) => {
    if (elder_id !== null && address_id !== null) {
      confirm({
        title: 'Are you sure you wish to remove this contact?',
        okType: 'danger',
        okText: 'Yes, Continue',
        cancelText: 'No, Abort',
        centered: true,
        onOk: () => {
          this.deleteElderAddress(elder_id, address_id);
        },
        onCancel() {},
      });
    } else {
    }
  };

  render() {
    const { elderData } = this.props;
    let addressIndex = 0;
    const { countries, states, cities, addressCount } = this.state;
    return (
      <div className="elder-addresses">
        <div className="row">
          <div className="col-12 col-sm-5">
            <div className="address-display">
              <h4>Saved Addresses</h4>

              {elderData ? (
                elderData.owner.consumer_addresses.map((address, index) => {
                  if (address.is_active) {
                    addressIndex++;
                    return (
                      <div
                        className="address-item d-flex align-items-start justify-content-start flex-column"
                        key={addressIndex}
                      >
                        <div className="address-item-header d-flex align-items-center justify-content-between">
                          <h6>Address {addressIndex}</h6>

                          {address.default ? (
                            <div className="address-item-default">
                              <FontAwesomeIcon icon={faCheckCircle} /> Default
                            </div>
                          ) : null}
                        </div>

                        <p className="address-item-value">
                          {address.full_address}
                        </p>

                        <hr />
                        <p className="address-item-value">
                          Updated At:{' '}
                          {get(address, 'updated_at_formatted', 'n/a')}
                        </p>
                        <p className="address-item-value">
                          Created By: {get(address, 'app_type', 'n/a')}
                        </p>
                        <hr />
                        <div className="address-item-options d-flex align-items-center justify-content-start">
                          <Button
                            onClick={() => this.googleMapsRedirector(address)}
                            type="button"
                            className="btn btn-link"
                          >
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> Map
                          </Button>

                          <Button
                            onClick={() => this.triggerEditAddress(address)}
                            type="button"
                            className="btn btn-link"
                            disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                          >
                            <FontAwesomeIcon icon={faEdit} /> Edit Address
                          </Button>
                          {!address.default ? (
                            <Button
                              onClick={() =>
                                this.handleDeleteConfirmation(
                                  elderData.id,
                                  address.id,
                                )
                              }
                              type="button"
                              className="btn btn-link"
                              disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} /> Remove
                              Address
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <Empty />
              )}
            </div>
          </div>

          <div className="col-12 col-sm-7">
            {this.state.addAddress ? (
              <div className="address-capture">
                <h4>Add New Address</h4>
                <div className="row">
                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Latitude</Form.Label>

                      <Form.Control
                        type="number"
                        placeholder="e.g 28.4250203"
                        onChange={e =>
                          this.setAddressStateValues(e, 'geoLatitude')
                        }
                        value={this.state.formData.geoLatitude}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Longitude</Form.Label>

                      <Form.Control
                        type="number"
                        placeholder="e.g. 77.0658533"
                        onChange={e =>
                          this.setAddressStateValues(e, 'geoLongitude')
                        }
                        value={this.state.formData.geoLongitude}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Form.Group>
                      <Form.Label>Location</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Search for a Location..."
                        id="addLocationInput"
                        onChange={e =>
                          this.setAddressStateValues(e, 'addLocationInput')
                        }
                        value={this.state.formData.addLocationInput}
                      />
                    </Form.Group>

                    <div className="location-map" id="addLocationMap" />
                    <div className="row">
                      <div className="col-12 col-sm-4">
                        <Form.Group controlId="elder_gender">
                          <Form.Label>Is Default Address</Form.Label>

                          <Form.Control
                            as="select"
                            onChange={e =>
                              this.setAddressStateValues(e, 'default')
                            }
                            value={this.state.formData.default}
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Group>
                          <Form.Label>Address Line 1</Form.Label>

                          <Form.Control
                            type="text"
                            placeholder="Address Line 1"
                            onChange={e =>
                              this.setAddressStateValues(e, 'addressLine1')
                            }
                            value={this.state.formData.addressLine1}
                          />
                        </Form.Group>
                      </div>

                      <div className="col-12 col-sm-6">
                        <Form.Group>
                          <Form.Label>Address Line 2</Form.Label>

                          <Form.Control
                            type="text"
                            placeholder="Address Line 2"
                            onChange={e =>
                              this.setAddressStateValues(e, 'addressLine2')
                            }
                            value={this.state.formData.addressLine2}
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-4">
                        <Form.Group controlId="elder_gender">
                          <Form.Label>Country</Form.Label>

                          <Form.Control
                            as="select"
                            onChange={e =>
                              this.setAddressStateValues(e, 'country')
                            }
                            value={
                              this.state.formData.country
                                ? this.state.formData.country
                                : 'VOID'
                            }
                          >
                            <option value="VOID" disabled>
                              Please select a country
                            </option>
                            {countries.length &&
                              countries.map((country, index) => (
                                <option key={index} value={country.country}>
                                  {country.country}
                                </option>
                              ))}
                          </Form.Control>
                        </Form.Group>
                      </div>

                      <div className="col-12 col-sm-4">
                        <Form.Group controlId="elder_gender">
                          <Form.Label>State</Form.Label>

                          <Form.Control
                            as="select"
                            onChange={e =>
                              this.setAddressStateValues(e, 'state')
                            }
                            value={
                              this.state.formData.state
                                ? this.state.formData.state
                                : 'VOID'
                            }
                            disabled={!this.state.formData.country}
                          >
                            <option value="VOID" disabled>
                              Please select a state
                            </option>
                            {states.length &&
                              states.map((state, index) => (
                                <option key={index} value={state.state}>
                                  {state.state}
                                </option>
                              ))}
                          </Form.Control>
                        </Form.Group>
                      </div>

                      <div className="col-12 col-sm-4">
                        <Form.Group controlId="elder_gender">
                          <Form.Label>City</Form.Label>

                          <Form.Control
                            as="select"
                            onChange={e =>
                              this.setAddressStateValues(e, 'city')
                            }
                            value={
                              this.state.formData.city
                                ? this.state.formData.city
                                : 'VOID'
                            }
                            disabled={!this.state.formData.state}
                          >
                            <option value="VOID" disabled>
                              Please select a city
                            </option>
                            {cities.length &&
                              cities.map((city, index) => (
                                <option key={index} value={city.city}>
                                  {city.city}
                                </option>
                              ))}
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => this.addAddressHandler()}
                  type="button"
                  className="btn btn-primary"
                  disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                >
                  Save
                </Button>
              </div>
            ) : null}

            {this.state.editAddress ? (
              <div className="address-capture">
                <h4>Edit Address Address</h4>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>Address Line 1</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Address Line 1"
                        onChange={e =>
                          this.setAddressStateValues(e, 'addressLine1')
                        }
                        value={this.state.formData.addressLine1}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>Address Line 2</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Address Line 2"
                        onChange={e =>
                          this.setAddressStateValues(e, 'addressLine2')
                        }
                        value={this.state.formData.addressLine2}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-4">
                    <Form.Group controlId="elder_gender">
                      <Form.Label>Country</Form.Label>

                      <Form.Control
                        as="select"
                        onChange={e => this.setAddressStateValues(e, 'country')}
                        value={
                          this.state.formData.country
                            ? this.state.formData.country
                            : 'VOID'
                        }
                      >
                        <option value="VOID" disabled>
                          Please select a country
                        </option>
                        {countries.length &&
                          countries.map((country, index) => (
                            <option key={index} value={country.country}>
                              {country.country}
                            </option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-4">
                    <Form.Group controlId="elder_gender">
                      <Form.Label>State</Form.Label>

                      <Form.Control
                        as="select"
                        onChange={e => this.setAddressStateValues(e, 'state')}
                        value={
                          this.state.formData.state
                            ? this.state.formData.state
                            : 'VOID'
                        }
                        disabled={!this.state.formData.country}
                      >
                        <option value="VOID" disabled>
                          Please select a state
                        </option>
                        {states.length &&
                          states.map((state, index) => (
                            <option key={index} value={state.state}>
                              {state.state}
                            </option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-4">
                    <Form.Group controlId="elder_gender">
                      <Form.Label>City</Form.Label>

                      <Form.Control
                        as="select"
                        onChange={e => this.setAddressStateValues(e, 'city')}
                        value={
                          this.state.formData.city
                            ? this.state.formData.city
                            : 'VOID'
                        }
                        disabled={!this.state.formData.state}
                      >
                        <option value="VOID" disabled>
                          Please select a city
                        </option>
                        {cities.length &&
                          cities.map((city, index) => (
                            <option key={index} value={city.city}>
                              {city.city}
                            </option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Latitude</Form.Label>

                      <Form.Control
                        type="number"
                        placeholder="e.g 28.4250203"
                        onChange={e =>
                          this.setAddressStateValues(e, 'geoLatitude')
                        }
                        value={this.state.formData.geoLatitude}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Longitude</Form.Label>

                      <Form.Control
                        type="number"
                        placeholder="e.g. 77.0658533"
                        onChange={e =>
                          this.setAddressStateValues(e, 'geoLongitude')
                        }
                        value={this.state.formData.geoLongitude}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-4">
                    <Form.Group controlId="elder_gender">
                      <Form.Label>Is Default Address</Form.Label>

                      <Form.Control
                        as="select"
                        onChange={e => this.setAddressStateValues(e, 'default')}
                        value={this.state.formData.default}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Form.Group>
                      <Form.Label>Location</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Search for a Location..."
                        id="editLocationInput"
                        onChange={e =>
                          this.setAddressStateValues(e, 'addLocationInput')
                        }
                        value={this.state.formData.addLocationInput}
                      />
                    </Form.Group>

                    <div className="location-map" id="editLocationMap" />
                  </div>
                </div>

                <Button
                  onClick={() => this.editAddressHandler()}
                  type="button"
                  className="btn btn-primary"
                  disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                >
                  Save
                </Button>

                <Button
                  onClick={() => this.cancelEditingAddress()}
                  type="button"
                  className="btn btn-secondary"
                  disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                >
                  Cancel
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = state => ({
  elderData: state.elder.elderData,
});

const mapDispatchToProps = {
  getCountries,
  getStates,
  getCities,
  removeElderAddress,
  addElderAddress,
  updateElderAddress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageAddresses);

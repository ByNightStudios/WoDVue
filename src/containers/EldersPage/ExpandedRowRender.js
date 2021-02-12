/*global google*/
import React from 'react';
import { Input, DatePicker, Select } from 'antd';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../common/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faComments } from '@fortawesome/free-solid-svg-icons';
import {
  updateConsumer,
  updateConsumerAddress,
  addNewConsumerAddress,
} from '../../actions/ConsumerActions';
import { connect } from 'react-redux';
import PageLoader from '../../components/PageLoader';
import {
  getStatesList,
  getCountryCodesList,
} from '../../actions/ConfigActions';

import moment from 'moment';

import {
  getCountries,
  getStates,
  getCities,
} from '../../actions/LocationAction';

let defaultPosition = {
  lat: 28.450654,
  lng: 77.065351,
};

const { TextArea } = Input;
class ExpandedRowRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: this.props.record.first_name,
      last_name: this.props.record.last_name,
      mobile_number: this.props.record.mobile_number,
      gender: this.props.record.gender,
      blood_group: this.props.record.owner.blood_group
        ? this.props.record.owner.blood_group
        : '-None-',
      dob: this.props.record.owner.dob,
      addresses: this.props.record.owner.consumer_addresses,
      location: this.props.record.location,
      country_code: this.props.record.country_code
        ? this.props.record.country_code
        : '91',
      emergency_country_code:
        this.props.record.owner.emergencyContact.length &&
        this.props.record.owner.emergencyContact[0].country_code
          ? this.props.record.owner.emergencyContact[0].country_code
          : '91',
      emergency_contact_name: this.props.record.owner.emergencyContact.length
        ? this.props.record.owner.emergencyContact[0].name
        : null,
      emergency_contact_number: this.props.record.owner.emergencyContact.length
        ? this.props.record.owner.emergencyContact[0].mobile_number
        : '',
      showAddresses: 0,
      loader: false,
      addressesValues: [],
      addAddress: false,
      new_address_line_1: null,
      new_address_line_2: null,
      new_address_city: null,
      new_address_state: null,
      new_address_country: null,
      new_geo_latitude: null,
      new_geo_longitude: null,
      statesList: [],
      countryCodesList: [],
      formatted_mobile_number: null,
      formatted_emergency_contact_number: null,
      world: [],
      countries: null,
      new_states: null,
      new_cities: null,
    };
  }

  componentDidMount() {
    this.getCountriesList();
    this.fetchWorldData();
    this.getCountryCodesList();
  }

  // getCountriesList = () => {
  //   this.setState({ loader: true });
  //   this.props.getCountries()
  //     .then(result => {
  //       this.setState({ loader: false, countries: result.data });
  //     })
  //     .catch(error => {
  //       this.setState({ loader: false });
  //     });
  // };

  // getStatesList = (country, index) => {
  //   this.setState({ loader: true });
  //   this.props.getStates(country)
  //     .then(result => {
  //       let { world } = this.state;

  //       if (index === "new") this.setState({ loader: false, new_states: result.data });
  //       else {
  //         world[index].states = result.data;
  //         this.setState({ loader: false, world });
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       this.setState({ loader: false });
  //     });
  // };

  // getCitiesList = (states, index) => {
  //   this.setState({ loader: true });
  //   this.props.getCities(states)
  //     .then(result => {
  //       let { world } = this.state;

  //       if (index === "new") this.setState({ new_cities: result.data, loader: false });
  //       else {
  //         world[index].cities = result.data;
  //         this.setState({ loader: false, world });
  //       }
  //     })
  //     .catch(error => {
  //       this.setState({ loader: false });
  //     });
  // };

  // fetchWorldData = () => {
  //   let { addresses } = this.state;

  //   for (let i = 0; i < addresses.length; i++) {

  //     let { world } = this.state;
  //     world.push({ states: null, cities: null });
  //     console.log(world)
  //     this.setState({ world }, () => {
  //       if (addresses[i].country && addresses[i].state) {
  //         this.getStatesList(addresses[i].country, i);
  //         this.getCitiesList(addresses[i].state, i);
  //       } else if (addresses[i].country && !addresses[i].state) {
  //         this.getStatesList(addresses[i].country, i);
  //         this.getCitiesList(addresses[i].state, i);
  //       }
  //     });
  //   }
  // };

  // getCountryCodesList() {
  //   this.props
  //     .getCountryCodesList()
  //     .then(result => {
  //       this.setState({ countryCodesList: result.country_codes });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }

  componentWillReceiveProps = async (props) => {
    if (props.record.owner.consumer_addresses !== this.state.addresses)
      await this.setState({ addresses: props.record.owner.consumer_addresses });
  };

  setStateValues = (e, field) => {
    let value;
    if (field !== 'dob') value = e.currentTarget.value;
    else value = e ? moment(e._d).format('YYYY-MM-DD 00:00:00') : null;
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);
  };

  updateConsumerHandler = async (e) => {
    e.preventDefault();
    let {
      first_name,
      mobile_number,
      country_code,
      emergency_contact_number,
      emergency_country_code,
    } = this.state;

    mobile_number = mobile_number.replace(/-/g, '');
    emergency_contact_number = emergency_contact_number.replace(/-/g, '');

    let formatted_mobile_number = `+${country_code.replace(
      /-/g,
      ''
    )}${mobile_number}`;
    let formatted_emergency_contact_number = `+${emergency_country_code.replace(
      /-/g,
      ''
    )}${emergency_contact_number}`;
    let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    if (first_name === null || first_name === '')
      return this.props.onClick('Error', 'First name is required.', 0);
    if (mobile_number === null || mobile_number === '')
      return this.props.onClick('Error', 'Mobile Number is required.', 0);
    if (!regex.test(formatted_mobile_number))
      return this.props.onClick('Error', 'Mobile Number is invalid.', 0);
    if (
      emergency_contact_number &&
      !regex.test(formatted_emergency_contact_number)
    )
      return this.props.onClick(
        'Error',
        'Emergency Contact Number is invalid.',
        0
      );

    await this.setState({
      loader: true,
      formatted_mobile_number,
      mobile_number,
      emergency_contact_number,
    });
    if (emergency_contact_number)
      await this.setState({ formatted_emergency_contact_number });

    this.props
      .updateConsumer(this.props.user.id, this.props.record.id, this.state)
      .then((result) => {
        this.props.onClick('Success', 'Details Updated Successfully.', 1);
        this.setState({ loader: false });
        this.props.disableExpandRow();
      })
      .catch((error) => {
        this.props.onClick('Error', error.message, 0);
        this.setState({ loader: false });
      });
  };
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };
  showAddressHandler = async () => {
    await this.setState({
      showAddresses: !this.state.showAddresses,
      addAddress: false,
    });
    if (this.state.showAddresses) {
      this.state.addresses.forEach((address, index) => {
        this.renderGoogleMaps(address, index);
      });
    }
  };
  showAddAddressHandler = async () => {
    await this.setState({
      addAddress: !this.state.addAddress,
      showAddresses: false,
    });
    if (this.state.addAddress) this.renderGoogleMaps(null, '-add_new_address');
  };

  setAddressStateValues = (e, field, index) => {
    let value;
    let geo_latitude;
    let geo_longitude;
    let { addresses } = this.state;

    // address[index]['address_line_1']="fafadsadas";
    if (field === 'address_line_1') {
      value = e.currentTarget.value;
      addresses[index]['address_line_1'] = value;
      this.setState({ addresses });
    } else if (field === 'address_line_2') {
      value = e.currentTarget.value;
      addresses[index]['address_line_2'] = value;
      this.setState({ addresses });
    } else if (field === 'city') {
      value = e.currentTarget.value;
      addresses[index]['city'] = value;
      this.setState({ addresses });
    } else if (field === 'state') {
      value = e.currentTarget.value;
      addresses[index]['state'] = value;
      addresses[index]['city'] = null;
      this.setState({ addresses });
      this.getCitiesList(value, index);
      let { world } = this.state;
      world[index].cities = null;
      this.setState({ world });
    } else if (field === 'country') {
      value = e.currentTarget.value;
      addresses[index]['country'] = value;
      addresses[index]['city'] = null;
      addresses[index]['state'] = null;
      this.setState({ addresses });
      this.getStatesList(value, index);
      let { world } = this.state;
      world[index].states = null;
      world[index].cities = null;
      this.setState({ world });
    } else if (field === 'new_address_line_1') {
      value = e.currentTarget.value;
      this.setState({ new_address_line_1: value });
    } else if (field === 'new_address_line_2') {
      value = e.currentTarget.value;
      this.setState({ new_address_line_2: value });
    } else if (field === 'new_address_city') {
      value = e.currentTarget.value;
      this.setState({ new_address_city: value });
    } else if (field === 'new_address_state') {
      value = e.currentTarget.value;
      this.setState({ new_address_state: value });
      this.getCitiesList(value, 'new');
      this.setState({ new_cities: null, new_address_city: null });
    } else if (field === 'new_address_country') {
      value = e.currentTarget.value;
      this.setState({ new_address_country: value });
      this.getStatesList(value, 'new');
      this.setState({
        new_states: null,
        new_cities: null,
        new_address_city: null,
        new_address_state: null,
      });
    } else {
      value = e.position;
      geo_latitude = e.position.lat;
      geo_longitude = e.position.lng;
      addresses[index]['geo_latitude'] = geo_latitude;
      addresses[index]['geo_longitude'] = geo_longitude;
      this.setState({ addresses });
    }
  };
  updateAddressHandler = (e, address_uuid, index) => {
    let { addresses } = this.state;
    let address = addresses[index];
    this.setState({ loader: true });
    this.props
      .updateConsumerAddress(
        this.props.user.id,
        this.props.record.id,
        address_uuid,
        address
      )
      .then((result) => {
        this.props.onClick('Success', 'Address Updated Successfully.', 1);
        this.setState({ loader: false });
        this.props.disableExpandRow();
      })
      .catch((error) => {
        this.props.onClick('Error', error.message, 0);
        this.setState({ loader: false });
      });
  };
  renderGoogleMaps = (address = null, index) => {
    var map = new google.maps.Map(
      document.getElementById('map-' + this.props.record.id + index),
      {
        center: address
          ? {
              lat: parseFloat(address.geo_latitude),
              lng: parseFloat(address.geo_longitude),
            }
          : { lat: 28.6109872, lng: 77.1628123 },
        zoom: 11,
        mapTypeId: 'roadmap',
      }
    );

    // Create the search box and link it to the UI element.
    var input = document.getElementById(
      'pac-input-' + this.props.record.id + index
    );
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    var defaultMarker = new google.maps.Marker({
      map,
      draggable: true,
      position: address
        ? {
            lat: parseFloat(address.geo_latitude),
            lng: parseFloat(address.geo_longitude),
          }
        : { lat: -33.8688, lng: 151.2195 },
    });
    markers.push(defaultMarker);
    markers[0].setMap(map);
    let { addresses, new_geo_latitude, new_geo_longitude } = this.state;
    google.maps.event.addListener(markers[0], 'dragend', (marker) => {
      if (address) {
        addresses[index]['geo_latitude'] = marker.latLng.lat();
        addresses[index]['geo_longitude'] = marker.latLng.lng();
        this.setState({ addresses });
      } else {
        new_geo_latitude = marker.latLng.lat();
        new_geo_longitude = marker.latLng.lng();
        this.setState({ new_geo_latitude, new_geo_longitude });
      }
    });
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

        //let {addresses, new_geo_latitude, new_geo_longitude} = this.state

        google.maps.event.addListener(markers[0], 'dragend', (marker) => {
          if (address) {
            addresses[index]['geo_latitude'] = marker.latLng.lat();
            addresses[index]['geo_longitude'] = marker.latLng.lng();
            this.setState({ addresses });
          } else {
            new_geo_latitude = marker.latLng.lat();
            new_geo_longitude = marker.latLng.lng();
            this.setState({ new_geo_latitude, new_geo_longitude });
          }
        });

        if (address) {
          addresses[index]['geo_latitude'] = place.geometry.location.lat();
          addresses[index]['geo_longitude'] = place.geometry.location.lng();
          this.setState({ addresses });
        } else {
          new_geo_latitude = place.geometry.location.lat();
          new_geo_longitude = place.geometry.location.lng();
          this.setState({ new_geo_latitude, new_geo_longitude });
        }
        //this.setState({geo_latitude : place.geometry.location.lat(), geo_longitude : place.geometry.location.lng()})
      });
      map.fitBounds(bounds);
    });
  };
  addNewAddressHandler = (e) => {
    let {
      new_address_line_1,
      new_address_line_2,
      new_address_city,
      new_address_state,
      new_address_country,
      new_geo_latitude,
      new_geo_longitude,
    } = this.state;
    let details = {
      address_line_1: new_address_line_1,
      address_line_2: new_address_line_2,
      city: new_address_city,
      state: new_address_state,
      country: new_address_country,
      geo_latitude: new_geo_latitude,
      geo_longitude: new_geo_longitude,
    };
    this.props
      .addNewConsumerAddress(this.props.user.id, this.props.record.id, details)
      .then((result) => {
        this.props.onClick('Success', 'Address Added Successfully.', 1);
        this.setState({ loader: false, addAddress: false });
        this.props.disableExpandRow();
      })
      .catch((error) => {
        this.props.onClick('Error', error.message, 0);
        this.setState({ loader: false });
      });
  };
  render() {
    return (
      <div className='responder-information'>
        <div className='chat-link-row row' style={{ marginBottom: '24px' }}>
          <div className='col-12'>
            <h5>Chat With Elder</h5>

            <Link
              to={`${ROUTES.SUPPORT}?id=${this.props.record.id}&name=${this.props.record.first_name}&mobile=${this.props.record.mobile_number}`}
              className='btn chat-link-btn'
              key={1}
            >
              <FontAwesomeIcon icon={faComments} /> Begin chat
            </Link>
          </div>
        </div>
        <div className='row'>
          <div className='emergency-details-column col-12 col-sm-6'>
            <div className='responder-information-wrapper'>
              <h5>Edit Elder Information </h5>
              <Form className='map-responder-form'>
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
                        onChange={(e) => this.setStateValues(e, 'gender')}
                      >
                        <option
                          value='1'
                          selected={this.state.gender === 1 ? true : false}
                        >
                          Male
                        </option>
                        <option
                          value='2'
                          selected={this.state.gender === 2 ? true : false}
                        >
                          Female
                        </option>
                        <option
                          value='3'
                          selected={this.state.gender === 3 ? true : false}
                        >
                          Others
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderFirstName'>
                      <Form.Label>Date of Birth</Form.Label>
                      <DatePicker
                        onChange={(e) => this.setStateValues(e, 'dob')}
                        defaultValue={
                          this.state.dob != null
                            ? moment(this.state.dob, 'YYYY-MM-DD')
                            : null
                        }
                        disabledDate={this.disabledDate}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderFirstName'>
                      <Form.Label>Blood Group</Form.Label>
                      <Form.Control
                        as='select'
                        onChange={(e) => this.setStateValues(e, 'blood_group')}
                      >
                        <option
                          value='-None-'
                          selected={
                            this.state.blood_group === '-None-' ? true : false
                          }
                        >
                          -None-
                        </option>
                        <option
                          value='A+'
                          selected={
                            this.state.blood_group === 'A' ? true : false
                          }
                        >
                          A
                        </option>
                        <option
                          value='A+'
                          selected={
                            this.state.blood_group === 'A+' ? true : false
                          }
                        >
                          A+
                        </option>
                        <option
                          value='A-'
                          selected={
                            this.state.blood_group === 'A-' ? true : false
                          }
                        >
                          A-
                        </option>
                        <option
                          value='A+'
                          selected={
                            this.state.blood_group === 'B' ? true : false
                          }
                        >
                          B
                        </option>
                        <option
                          value='B+'
                          selected={
                            this.state.blood_group === 'B+' ? true : false
                          }
                        >
                          B+
                        </option>
                        <option
                          value='B-'
                          selected={
                            this.state.blood_group === 'B-' ? true : false
                          }
                        >
                          B-
                        </option>
                        <option
                          value='A+'
                          selected={
                            this.state.blood_group === 'O' ? true : false
                          }
                        >
                          O
                        </option>
                        <option
                          value='O+'
                          selected={
                            this.state.blood_group === 'O+' ? true : false
                          }
                        >
                          O+
                        </option>
                        <option
                          value='O-'
                          selected={
                            this.state.blood_group === 'O-' ? true : false
                          }
                        >
                          O-
                        </option>
                        <option
                          value='A+'
                          selected={
                            this.state.blood_group === 'AB' ? true : false
                          }
                        >
                          AB+
                        </option>
                        <option
                          value='AB+'
                          selected={
                            this.state.blood_group === 'AB+' ? true : false
                          }
                        >
                          AB+
                        </option>
                        <option
                          value='AB-'
                          selected={
                            this.state.blood_group === 'AB-' ? true : false
                          }
                        >
                          AB-
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderFirstName'>
                      <Form.Label>Emergency Contact Name</Form.Label>
                      <Form.Control
                        type='text'
                        value={this.state.emergency_contact_name}
                        placeholder='Vikram'
                        onChange={(e) =>
                          this.setStateValues(e, 'emergency_contact_name')
                        }
                      />
                    </Form.Group>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <Form.Group controlId='responderFirstName'>
                      <Form.Label>Emergency Contact Number</Form.Label>
                      <div className='d-flex justify-content-start'>
                        {/* <Form.Control as='select' value={this.state.emergency_country_code} onChange={(e) => this.setStateValues(e, 'emergency_country_code')} style={{width : '60px', marginRight : '5px'}}>
                                {this.state.countryCodesList.map(code => {
                                  return <option value={code}>+{code}</option>
                                })}
                              </Form.Control> */}
                        <Select
                          showSearch
                          style={{ width: 125, marginRight: '8px' }}
                          notFoundContent={null}
                          showArrow={false}
                          defaultValue={this.state.emergency_country_code}
                          optionFilterProp='children'
                          onChange={(value) =>
                            this.setState({ emergency_country_code: value })
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
                          type='text'
                          value={this.state.emergency_contact_number}
                          placeholder='9876543210'
                          onChange={(e) =>
                            this.setStateValues(e, 'emergency_contact_number')
                          }
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    {this.state.addresses.length
                      ? [
                          !this.state.showAddresses ? (
                            <Button
                              type='button'
                              className='btn btn-link'
                              onClick={this.showAddressHandler}
                            >
                              <FontAwesomeIcon icon={faPlus} /> Show saved
                              addresses
                            </Button>
                          ) : (
                            <Button
                              type='button'
                              className='btn btn-link'
                              onClick={this.showAddressHandler}
                            >
                              <FontAwesomeIcon icon={faMinus} /> Hide saved
                              addresses
                            </Button>
                          ),
                        ]
                      : null}
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    {!this.state.addAddress ? (
                      <Button
                        type='button'
                        className='btn btn-link'
                        onClick={this.showAddAddressHandler}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add new address
                      </Button>
                    ) : (
                      <Button
                        type='button'
                        className='btn btn-link'
                        onClick={this.showAddAddressHandler}
                      >
                        <FontAwesomeIcon icon={faMinus} /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  className='btn btn-primary'
                  onClick={(e) => this.updateConsumerHandler(e)}
                >
                  Save Changes
                </Button>
              </Form>
            </div>
          </div>
          {this.state.showAddresses ? (
            <div className='emergency-details-column col-12 col-sm-6'>
              <div className='responder-information-wrapper'>
                {this.state.addresses.map((address, index) => {
                  defaultPosition = {
                    lat: parseFloat(address.geo_latitude),
                    lng: parseFloat(address.geo_longitude),
                  };

                  return (
                    <Form className='map-responder-form'>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Address Line 1</Form.Label>
                            <Form.Control
                              style={{ width: '100%', marginBottom: '8px' }}
                              placeholder='Address Line 1'
                              value={address.address_line_1}
                              onChange={(e) =>
                                this.setAddressStateValues(
                                  e,
                                  'address_line_1',
                                  index
                                )
                              }
                            />

                            <Form.Label>Address Line 2</Form.Label>
                            <Form.Control
                              style={{ width: '100%', marginBottom: '8px' }}
                              placeholder='Address Line 2'
                              value={address.address_line_2}
                              onChange={(e) =>
                                this.setAddressStateValues(
                                  e,
                                  'address_line_2',
                                  index
                                )
                              }
                            />

                            <Form.Label>Country</Form.Label>
                            <Form.Control
                              as='select'
                              style={{ width: '100%' }}
                              onChange={(e) =>
                                this.setAddressStateValues(e, 'country', index)
                              }
                              value={address.country ? address.country : 'VOID'}
                            >
                              <option value='VOID'>
                                Please select a country
                              </option>
                              {this.state.countries &&
                                this.state.countries.map((country) => {
                                  return (
                                    <option value={country.country}>
                                      {country.country}
                                    </option>
                                  );
                                })}
                            </Form.Control>

                            <Form.Label>State</Form.Label>
                            <Form.Control
                              as='select'
                              style={{ width: '100%' }}
                              onChange={(e) =>
                                this.setAddressStateValues(e, 'state', index)
                              }
                              value={address.state ? address.state : 'VOID'}
                              disabled={address.country ? false : true}
                            >
                              <option value='VOID'>
                                Please select a state
                              </option>
                              {address.country &&
                                this.state.world.length &&
                                this.state.world[index] &&
                                this.state.world[index].states &&
                                this.state.world[index].states.length &&
                                this.state.world[index].states.map((State) => {
                                  return (
                                    <option value={State.state}>
                                      {State.state}
                                    </option>
                                  );
                                })}
                            </Form.Control>

                            <Form.Label>City</Form.Label>
                            <Form.Control
                              as='select'
                              style={{ width: '100%' }}
                              onChange={(e) =>
                                this.setAddressStateValues(e, 'city', index)
                              }
                              value={address.city ? address.city : 'VOID'}
                              disabled={address.state ? false : true}
                            >
                              <option value='VOID'>Please select a city</option>
                              {address.state &&
                                this.state.world.length &&
                                this.state.world[index] &&
                                this.state.world[index].cities &&
                                this.state.world[index].cities.length &&
                                this.state.world[index].cities.map((city) => {
                                  return (
                                    <option value={city.city}>
                                      {city.city}
                                    </option>
                                  );
                                })}
                            </Form.Control>
                          </Form.Group>
                        </div>
                        <div className='col-12'>
                          <Form.Group controlId='elderLocation'>
                            <Form.Label>Location</Form.Label>
                            {/* API Reference for the Location Picker - https://www.npmjs.com/package/react-location-picker */}
                            {/* <LocationPicker
                            containerElement={
                              <div
                                className='location-picker'
                                style={{ height: '100%' }}
                              />
                            }
                            mapElement={
                              <div
                                className='location-picker-map'
                                style={{ height: '100px' }}
                              />
                            }
                            defaultPosition={defaultPosition}
                            onChange={(e) => this.setAddressStateValues(e, 'location', index)}
                          /> */}
                            <TextArea
                              rows={1}
                              style={{ width: '100%' }}
                              placeholder='Enter your location...'
                              id={`pac-input-${this.props.record.id + index}`}
                            />
                            <div
                              id={`map-${this.props.record.id + index}`}
                              style={{ height: '300px', position: 'relative' }}
                            ></div>
                          </Form.Group>
                        </div>
                        <div className='col-12'>
                          <Button
                            className='btn btn-primary'
                            onClick={(e) =>
                              this.updateAddressHandler(e, address.id, index)
                            }
                          >
                            Update this address
                          </Button>
                          <hr />
                        </div>
                      </div>
                    </Form>
                  );
                })}
              </div>
            </div>
          ) : null}
          {this.state.addAddress ? (
            <div className='emergency-details-column col-12 col-sm-6'>
              <div className='responder-information-wrapper'>
                <Form className='map-responder-form'>
                  <div className='row'>
                    <div className='col-12'>
                      <Form.Group>
                        <Form.Label>Address </Form.Label>
                        <Form.Control
                          style={{ width: '100%', marginBottom: '8px' }}
                          placeholder='Address Line 1'
                          onChange={(e) =>
                            this.setAddressStateValues(
                              e,
                              'new_address_line_1',
                              0
                            )
                          }
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          style={{ width: '100%', marginBottom: '8px' }}
                          placeholder='Address Line 2'
                          onChange={(e) =>
                            this.setAddressStateValues(
                              e,
                              'new_address_line_2',
                              0
                            )
                          }
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          as='select'
                          style={{ width: '100%' }}
                          onChange={(e) =>
                            this.setAddressStateValues(
                              e,
                              'new_address_country',
                              0
                            )
                          }
                          value={
                            this.state.new_address_country
                              ? this.state.new_address_country
                              : 'VOID'
                          }
                        >
                          <option value={'VOID'}>
                            Please select a country
                          </option>
                          {this.state.countries &&
                            this.state.countries.map((country) => {
                              return (
                                <option value={country.country}>
                                  {country.country}
                                </option>
                              );
                            })}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          as='select'
                          style={{ width: '100%' }}
                          onChange={(e) =>
                            this.setAddressStateValues(
                              e,
                              'new_address_state',
                              0
                            )
                          }
                          value={
                            this.state.new_address_state
                              ? this.state.new_address_state
                              : 'VOID'
                          }
                          disabled={
                            this.state.new_address_country ? false : true
                          }
                        >
                          <option value={'VOID'}>Please select a state</option>
                          {this.state.new_address_country &&
                            this.state.new_states &&
                            this.state.new_states.length &&
                            this.state.new_states.map((State) => {
                              return (
                                <option value={State.state}>
                                  {State.state}
                                </option>
                              );
                            })}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          as='select'
                          style={{ width: '100%' }}
                          onChange={(e) =>
                            this.setAddressStateValues(e, 'new_address_city', 0)
                          }
                          value={
                            this.state.new_address_city
                              ? this.state.new_address_city
                              : 'VOID'
                          }
                          disabled={this.state.new_address_state ? false : true}
                        >
                          <option value={'VOID'}>Please select a city</option>
                          {this.state.new_address_state &&
                            this.state.new_cities &&
                            this.state.new_cities.length &&
                            this.state.new_cities.map((city) => {
                              return (
                                <option value={city.city}>{city.city}</option>
                              );
                            })}
                        </Form.Control>
                      </Form.Group>
                    </div>
                    <div className='col-12'>
                      <Form.Group controlId='elderLocation'>
                        <Form.Label>Location</Form.Label>

                        <TextArea
                          rows={1}
                          style={{ width: '100%' }}
                          placeholder='Enter your location...'
                          id={`pac-input-${this.props.record.id}-add_new_address`}
                        />
                        <div
                          id={`map-${this.props.record.id}-add_new_address`}
                          style={{ height: '300px', position: 'relative' }}
                        ></div>
                      </Form.Group>
                    </div>
                    <div className='col-12'>
                      <Button
                        className='btn btn-primary'
                        onClick={(e) => this.addNewAddressHandler(e)}
                      >
                        Add this address
                      </Button>
                      <hr />
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          ) : null}
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
  getCountries,
  getStates,
  getCities,
  updateConsumer,
  updateConsumerAddress,
  addNewConsumerAddress,
  getStatesList,
  getCountryCodesList,
})(ExpandedRowRender);

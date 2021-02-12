/*global google*/
import React from "react";
import * as _ from "lodash";
import { Button, Form } from "react-bootstrap";
import { notification, Select, Radio, Input, DatePicker } from "antd";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { getRenderingHeader } from "../../common/helpers";
import requireAuth from "../../hoc/requireAuth";
import { connect } from "react-redux";
import { consumerList } from "../../actions/ConsumerActions";
import styles from "./add-concierge-page.scss";
import { getStatesList } from "../../actions/ConfigActions";
import {
  conciergeServiceList,
  conciergeCreate,
  conciergeImageUpload,
} from "../../actions/ConciergeAction";
import { addNewConsumerAddress } from "../../actions/ConsumerActions";
import {
  emergencyCreate,
  consumerSearchList,
} from "../../actions/EmergencyActions";
import {
  getCities,
  getStates,
  getCountries,
} from "../../actions/LocationAction";
import AddConciergeDataManager from "./dataManager";
import hasPermission from "../../hoc/hasPermission";
import LanguagesSpoken from "../../components/LanguagesSpoken";

import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ROUTES, PERMISSIONS } from "../../common/constants";

export const defaultPosition = {
  lat: 28.450654,
  lng: 77.065351,
};
const { Option, OptGroup } = Select;
const { TextArea } = Input;

const foodPreferences = ["Veg", "Non Veg", "Both"];
const Specialization = [
  "None",
  "Dementia",
  "Post-Surgery",
  "Comatose",
  "Bedbound",
  "Psychiatric",
  "Post-Stroke",
  "Cardiac",
  "COVID",
  "ICU",
  "Tracheostomy",
  "Other",
];

const allowedStrings = "jpeg,png,jpg,pdf";

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

class AddConciergePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      statesList: [],
      navigationDeployed: true,
      consumers: [],
      consumer_number: "",
      consumer_dob: "",
      services: null,
      categories: [],
      consumer_addresses: null,
      consumer_blood_group: "",
      consumer_uuid: "",
      consumer_country_code: "",
      loader: false,
      searchFieldText: "",
      custom_address: false,
      geo_longitude: null,
      geo_latitude: null,
      address_line_1: null,
      address_line_2: null,
      request_service_id: null,
      city: "",
      state: "",
      country: "",
      address_id: null,
      showAddressFields: { display: "none" },
      selectedConsumer: false,
      otherServiceFlag: false,
      other_service_time: null,
      other_service_name: null,
      service_time: null,
      back_date_service: null,
      mainServiceFlag: false,
      consumerFlag: false,
      countries: null,
      states: null,
      cities: null,
      languages: [],
      other_language: "",
      foodPreferences: "Veg",
      specialization: "None",
      imageUpload: false,
    };

    this.addConciergeDataManager = new AddConciergeDataManager();
  }

  componentDidMount() {
    document.title = "Emoha Admin | Create a service request";
    this.getCountriesList();
    this.getServiceList();

    this.renderGoogleMaps();

    if (this.props.match.params.id) {
      this.getElderByID();
    }
  }

  _startLoader = () => {
    this.setState({ loader: true });
  };

  _stopLoader = () => {
    this.setState({ loader: false });
  };

  getElderByID = () => {
    this._startLoader();

    this.addConciergeDataManager
      .getElderData({ id: this.props.match.params.id })
      .then((responseData) => {
        this._stopLoader();

        if (responseData.data && responseData.data.length) {
          const consumer = responseData.data;

          let consumer_name = consumer[0].full_name;
          let consumer_number = consumer[0].mobile_number;
          let consumer_dob = consumer[0].owner.dob_formatted;
          let consumer_blood_group = consumer[0].owner.blood_group;
          let consumer_country_code = consumer[0].country_code;
          let consumer_uuid = consumer[0].id;
          this.setState({
            selectedConsumer: true,
            consumer_name,
            consumer_number,
            consumer_dob,
            consumer_blood_group,
            consumer_uuid,
            consumer_country_code,
            consumers: consumer,
            consumerFlag: true,
          });
        }
      })
      .catch((errorData) => {
        this._stopLoader();
        this.openNotification("Error", errorData.response.data.message, 0);
      });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  getStatesList(country) {
    this.setState({ loader: true });
    this.props
      .getStates(country)
      .then((result) => {
        this.setState({ states: result.data, cities: null, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  }

  getCountriesList() {
    this.setState({ loader: true });
    this.props
      .getCountries()
      .then((result) => {
        this.setState({
          countries: result.data,
          states: null,
          cities: null,
          loader: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loader: false });
      });
  }

  getCitiesList(state) {
    this.setState({ loader: true });
    this.props
      .getCities(state)
      .then((result) => {
        this.setState({ cities: result.data, loader: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loader: false });
      });
  }

  renderGoogleMaps = () => {
    var map = new google.maps.Map(document.getElementById(`map`), {
      center: defaultPosition,
      zoom: 13,
      mapTypeId: "roadmap",
    });
    // Create the search box and link it to the UI element.
    var input = document.getElementById(`pac-input`);
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", function () {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
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
          console.log("Returned place contains no geometry");
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

        google.maps.event.addListener(markers[0], "dragend", (marker) => {
          console.log(marker.latLng.lat(), marker.latLng.lng());
          let geo_latitude = marker.latLng.lat();
          let geo_longitude = marker.latLng.lng();
          this.setState({ geo_latitude, geo_longitude });
        });

        this.setState({
          geo_latitude: place.geometry.location.lat(),
          geo_longitude: place.geometry.location.lng(),
        });

        console.log(place.geometry.location);
      });
      map.fitBounds(bounds);
    });
  };

  setAddressStateValues = (e, field) => {
    // let value;
    let geo_latitude;
    let geo_longitude;
    let address_line_1, address_line_2, city, state, country;

    if (field === "address_line_1") {
      address_line_1 = e.currentTarget.value;

      this.setState({ address_line_1 });
    } else if (field === "address_line_2") {
      address_line_2 = e.currentTarget.value;

      this.setState({ address_line_2 });
    } else if (field === "city") {
      city = e.currentTarget.value;

      this.setState({ city });
    } else if (field === "country") {
      country = e.currentTarget.value;

      this.setState({ country });
      this.getStatesList(country);
      this.setState({ state: "", city: "" });
    } else if (field === "new_address_state") {
      state = e.currentTarget.value;

      this.setState({ state });
      this.getCitiesList(state);
      this.setState({ city: "" });
    } else {
      // value = e.position;
      geo_latitude = e.position.lat;
      geo_longitude = e.position.lng;

      this.setState({ geo_latitude, geo_longitude });
    }
  };

  getServiceList = () => {
    this.props.conciergeServiceList().then((result) => {
      this.setState({
        services: result,
      });
    });
  };

  getConsumersList = async (query) => {
    let consumers = [];
    if (!query || query === "") {
      consumers = [];
      this.setState({ consumers });
      return;
    }
    await this.props.consumerSearchList(query, 1).then((result) => {
      result.data.forEach((data, index) => {
        consumers.push(data);
      });
    });

    this.setState({ consumers });
  };

  userSearchHandler = (value) => {
    this.setState({
      searchFieldText: value,
      selectedConsumer: false,
      consumerFlag: false,
    });
    this.getConsumersList(value);
  };

  setStateValues = (e) => {
    const consumer = this.state.consumers.filter((consumer) => {
      if (consumer.id === e) return consumer;
    });

    if (consumer) {
      let consumer_number = consumer[0].mobile_number;
      let consumer_dob = consumer[0].owner.dob_formatted;
      let consumer_blood_group = consumer[0].owner.blood_group;
      let consumer_country_code = consumer[0].country_code;
      let consumer_uuid = e;
      this.setState({
        selectedConsumer: true,
        consumer_number,
        consumer_dob,
        consumer_blood_group,
        consumer_uuid,
        consumer_country_code,
        consumers: consumer,
        consumerFlag: true,
        searchFieldText: `${consumer[0].full_name} ${
          consumer[0].mobile_number
            ? "(" +
              consumer[0].country_code +
              "-" +
              consumer[0].mobile_number +
              ")"
            : ""
        }`,
      });
    }
  };

  addAddressHandler = async () => {
    let body = {
      address_line_1: this.state.address_line_1,
      address_line_2: this.state.address_line_2,
      city: this.state.city,
      state: this.state.state,
      country: this.state.country,
      geo_latitude: this.state.geo_latitude,
      geo_longitude: this.state.geo_longitude,
    };
    if (!this.state.address_line_1)
      return this.openNotification(
        "Error",
        "Please select an address line 1",
        0
      );
    if (!this.state.address_line_2)
      return this.openNotification(
        "Error",
        "Please select an address line 2",
        0
      );
    if (!this.state.country)
      return this.openNotification("Error", "Please select a country", 0);
    if (!this.state.state)
      return this.openNotification("Error", "Please select a state", 0);
    if (!this.state.geo_latitude || !this.state.geo_longitude)
      return this.openNotification(
        "Error",
        "Please select an location on map",
        0
      );

    await this.props
      .addNewConsumerAddress(this.props.user.id, this.state.consumer_uuid, body)
      .then((Response) => {
        console.log(Response);
        this.setState(
          { address_id: Response.data.id, custom_address: false },
          () => {
            this.addConciergeHandler();
          }
        );
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification("Error", error.message, 0);
      });
  };

  addConciergeHandler = (e) => {
    if (!this.state.consumer_uuid) {
      return this.openNotification("Error", "Please select an elder", 0);
    }

    if (typeof this.state.address_id !== "string") {
      return this.openNotification("Error", "Please select an Address", 0);
    }

    if (!this.state.request_service_id)
      return this.openNotification("Error", "Please select a service", 0);

    if (this.state.custom_address) {
      return this.addAddressHandler();
    }

    let details;
    if (this.state.otherServiceFlag) {
      if (!this.state.other_service_name || !this.state.other_service_time)
        return this.openNotification(
          "Error",
          "Please enter the missing details.",
          0
        );
      details = {
        address_id: this.state.address_id,
        other_service_name: this.state.other_service_name,
        other_service_time: this.state.other_service_time,
        service_end_date: this.state.service_end_date,
        weight_of_elder: this.state.weight_of_elder,
        languages: this.state.languages,
        other_language: this.state.other_language,
        specialization: this.state.specialization,
        other_specialization: this.state.other_specialization,
      };
    } else {
      if (!this.state.service_time)
        return this.openNotification(
          "Error",
          "Please enter the missing details.",
          0
        );
      let dataData = this.state;
      details = {
        address_id: this.state.address_id,
        service_date: this.state.service_time,
        service_time: this.state.service_time,
        service_end_date: this.state.service_end_date,
        weight_of_elder: this.state.weight_of_elder,
        languages: this.state.languages,
        other_language: this.state.other_language,
        specialization: this.state.specialization,
        other_specialization: this.state.other_specialization,
      };
    }
    if (this.state.back_date_service) {
      details["created_at"] = this.state.back_date_service;
    }

    this.setState({ loader: true });
    console.log(details, "details");
    this.props
      .conciergeCreate(
        this.state.consumer_uuid,
        this.state.request_service_id,
        details
      )
      .then((result) => {
        const {
          data: { service_id },
        } = result;
        this.setState({ loader: false, service_id, imageUpload: true });
        this.props.history.push("/concierge?open=true");
        this.openNotification(
          "Success",
          "Service Request Created Successfully.",
          1
        );
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification("Error", error.message, 0);
      });
  };

  openNotification = (message, description, status) => {
    let style = { color: "green" };
    if (!status)
      style = {
        color: "red",
      };
    const args = {
      message,
      description,
      duration: 3,
      style,
    };
    notification.open(args);
  };

  setStateDateValues = (e, field) => {
    let value;
    if (
      field === "other_service_time" ||
      field === "service_time" ||
      field === "back_date_service" ||
      field === "service_end_date"
    ) {
      value = e ? moment(e._d).format("YYYY-MM-DD HH:mm") : null;
    } else {
      value = e.currentTarget.value;
    }
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);
  };

  disabledTime = (current) => {
    if (moment(current).isSame(moment(), "day")) {
      return {
        disabledHours: () => range(0, moment(current).format("HH")),
        disabledMinutes: () => range(0, moment(current).format("mm")),
      };
    }
    // Can not select days before today and today
    //return current && current > moment().endOf('day');
  };

  setLanguages = (language) => {
    let state = this.state;
    state["languages"] = language;
    this.setState(state);
  };

  setStateValuesGlobal = (e, field) => {
    let Value;
    if (field === "specialization") {
      Value = e;
    } else {
      const { value } = e.target;
      Value = value;
    }
    let state = this.state;
    state[`${field}`] = Value;
    this.setState(state);
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleFileSelection = (event) => {
    const { service_id } = this.state;
    let fileObject = null;
    let ehr = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (_.get(event, "target.files", []).length !== 0) {
      fileObject = _.get(event, "target.files", [])[0];
    }
    if (fileObject !== null) {
      const { type, name, size } = fileObject;
      if (ehr.includes(type)) {
        const isLt2M = size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.openNotification("Error", "Image must be smaller than 5MB!", 0);
          return false;
        } else {
          this.getBase64(fileObject, (imageUrl) => {
            let payload = {
              user_concierge_service_id: service_id,
              documents: [
                {
                  type: type,
                  content: imageUrl,
                },
              ],
            };
            this.setState({ loader: true });
            this.props
              .conciergeImageUpload(payload)
              .then((result) => {
                this.setState({ loader: false });
                this.openNotification(
                  "Success",
                  "Image Upload Successfully.",
                  1
                );
              })
              .catch((error) => {
                this.setState({ loader: false });
                this.openNotification("Error", error.message, 0);
              });
          });
        }
      } else {
        this.openNotification(
          "Error",
          "This file format is not supported. Choose a JPG or PNG image and try again.",
          0
        );
      }
    }
  };

  render() {
    const {
      navigationDeployed,
      services,
      request_service_id,
      service_time,
    } = this.state;
    var serviceListShow = false;
    if (services && services.data) {
      services.data.forEach((item) => {
        item.services.forEach((items) => {
          if (
            items.id === request_service_id &&
            (items.service === "Care Partner 12-hour" ||
              items.service === "Care Partner 24-Hour" ||
              items.service === "Care Angel 12-Hour" ||
              items.service === "Care Angel 24-Hour")
          ) {
            serviceListShow = true;
          }
        });
      });
    }

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? "addconcierge-page sidebar-page sidebar-page--open position-relative"
              : "addconcierge-page sidebar-page sidebar-page--closed position-relative"
          }
          style={styles}
        >
          {navigationDeployed ? (
            <SideNavigation handleClose={this.handleNavigationToggle} />
          ) : (
            <Button
              type="button"
              className="btn btn-trigger"
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001" />
            </Button>
          )}

          <main className="sidebar-page-wrapper position-relative">
            <div className="internal-header">
              <div className="internal-header-left">
                <h2>Create Service Request</h2>
              </div>
            </div>
            <div className="internal-content">
              <div className="row">
                <div className="col-12 col-sm-8">
                  <div className="form-container">
                    <Form className="map-responder-form">
                      <div className="row">
                        <div className="col-12">
                          <p className="concierge-user-title">
                            Who has requested concierge services? Please choose
                            an Elder from the dropdown below:
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 col-sm-6">
                          {!this.props.match.params.id && (
                            <Form.Group controlId="conciergeUser">
                              <Form.Label>Elder:</Form.Label>
                              <Select
                                showSearch
                                // style={{ width: 300 }}
                                showArrow={false}
                                notFoundContent={
                                  this.state.searchFieldText === "" ||
                                  this.state.searchFieldText === null
                                    ? null
                                    : "No elder found with this name."
                                }
                                defaultActiveFirstOption={false}
                                onSearch={(value) =>
                                  this.userSearchHandler(value)
                                }
                                value={this.state.searchFieldText}
                                onChange={(e) => this.setStateValues(e)}
                                placeholder="Search for an Elder"
                                filterOption={false}
                                style={{ width: 300 }}
                              >
                                <Select.Option value="" disabled>
                                  Search for an elder
                                </Select.Option>
                                {this.state.consumers.map((consumer, index) => {
                                  return (
                                    <Select.Option
                                      key={consumer.id}
                                      value={consumer.id}
                                      data-number={consumer.mobile_number}
                                      data-dob={consumer.owner.dob_formatted}
                                      data-blood-group={
                                        consumer.owner.blood_group
                                      }
                                      data-country_code={consumer.country_code}
                                    >{`${consumer.full_name} ${
                                      consumer.mobile_number
                                        ? "(" +
                                          consumer.country_code +
                                          "-" +
                                          consumer.mobile_number +
                                          ")"
                                        : ""
                                    }`}</Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Group>
                          )}
                          {this.state.consumer_name ? (
                            <div className="concierge-metadata d-flex align-items-center justify-content-start">
                              <span className="concierge-metadata-param">
                                Name:
                              </span>
                              <span className="concierge-metadata-value">
                                {this.state.consumer_name}
                              </span>
                            </div>
                          ) : null}
                          {this.state.consumer_number ? (
                            <div className="concierge-metadata d-flex align-items-center justify-content-start">
                              <span className="concierge-metadata-param">
                                Contact Number:
                              </span>
                              <span className="concierge-metadata-value">
                                {this.state.consumer_number
                                  ? "+91-" + this.state.consumer_number
                                  : "N/A"}
                              </span>
                            </div>
                          ) : null}
                          {this.state.consumer_dob ? (
                            <div className="concierge-metadata d-flex align-items-center justify-content-start">
                              <span className="concierge-metadata-param">
                                Date of Birth:
                              </span>
                              <span className="concierge-metadata-value">
                                {this.state.consumer_dob}
                              </span>
                            </div>
                          ) : null}
                          {this.state.consumer_blood_group ? (
                            <div className="concierge-metadata d-flex align-items-center justify-content-start">
                              <span className="concierge-metadata-param">
                                Blood Group:
                              </span>
                              <span className="concierge-metadata-value">
                                {this.state.consumer_blood_group}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div
                        style={{
                          display: this.state.consumerFlag ? "block" : "none",
                        }}
                      >
                        <hr />
                        <Form.Group>
                          <Form.Label style={{ display: "block" }}>
                            Select Address:
                          </Form.Label>
                          <Radio.Group>
                            <div className="row">
                              <div className="col-12 col-sm-8">
                                <div className="form-container">
                                  {this.state.consumers &&
                                  this.state.selectedConsumer
                                    ? this.state.consumers.map((data) => {
                                        console.log(
                                          "this is props object",
                                          this.props.record
                                        );
                                        {
                                          return data.owner.consumer_addresses.map(
                                            (data1, index) => {
                                              return (
                                                <Radio
                                                  value={data1.id}
                                                  data-geo_latitude={
                                                    data1.geo_latitude
                                                  }
                                                  data-geo_longitude={
                                                    data1.geo_longitude
                                                  }
                                                  onClick={(e) =>
                                                    this.setState({
                                                      address_id: data1.id,
                                                      custom_address: false,
                                                      showAddressFields: {
                                                        display: "none",
                                                      },
                                                    })
                                                  }
                                                >
                                                  {data1.full_address}{" "}
                                                  <a
                                                    href={`https://google.com/maps/place/${data1.geo_latitude},${data1.geo_longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: "maroon" }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faExternalLinkAlt}
                                                    />{" "}
                                                    Open in Google Maps
                                                  </a>
                                                </Radio>
                                              );
                                            }
                                          );
                                        }
                                      })
                                    : null}

                                  <Radio
                                    value="custom_address"
                                    checked={this.state.custom_address}
                                    onClick={() =>
                                      this.setState({
                                        custom_address: true,
                                        showAddressFields: { display: "block" },
                                      })
                                    }
                                  >
                                    Custom Address
                                  </Radio>
                                </div>
                              </div>
                            </div>
                          </Radio.Group>
                        </Form.Group>
                        <div
                          className="custom-address"
                          style={this.state.showAddressFields}
                        >
                          <br />
                          <Form.Group>
                            <Form.Control
                              style={{ width: "100%", marginBottom: "8px" }}
                              value={this.state.address_line_1}
                              placeholder="Address Line 1"
                              onChange={(e) =>
                                this.setAddressStateValues(e, "address_line_1")
                              }
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Control
                              style={{ width: "100%", marginBottom: "8px" }}
                              value={this.state.address_line_2}
                              placeholder="Address Line 2"
                              onChange={(e) =>
                                this.setAddressStateValues(e, "address_line_2")
                              }
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Control
                              as="select"
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                this.setAddressStateValues(e, "country", 0)
                              }
                              value={
                                this.state.country ? this.state.country : "VOID"
                              }
                            >
                              <option value={"VOID"}>
                                Please select a country
                              </option>
                              {this.state.countries &&
                                this.state.countries.length &&
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
                              as="select"
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                this.setAddressStateValues(
                                  e,
                                  "new_address_state",
                                  0
                                )
                              }
                              disabled={this.state.country ? false : true}
                              value={
                                this.state.state ? this.state.state : "VOID"
                              }
                            >
                              <option value={"VOID"}>
                                Please select a state
                              </option>
                              {this.state.states &&
                                this.state.states.length &&
                                this.state.states.map((State) => {
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
                              as="select"
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                this.setAddressStateValues(e, "city", 0)
                              }
                              disabled={this.state.state ? false : true}
                              value={this.state.city ? this.state.city : "VOID"}
                            >
                              <option value={"VOID"}>
                                Please select a city
                              </option>
                              {this.state.cities &&
                                this.state.cities.length &&
                                this.state.cities.map((city) => {
                                  return (
                                    <option value={city.city}>
                                      {city.city}
                                    </option>
                                  );
                                })}
                            </Form.Control>
                          </Form.Group>

                          <TextArea
                            rows={1}
                            style={{ width: "100%" }}
                            placeholder="Enter your location..."
                            id={`pac-input`}
                          />
                          <div
                            id={`map`}
                            style={{ height: "300px", position: "relative" }}
                          ></div>
                        </div>
                      </div>
                      {/* {(this.state.address_id || this.state.custom_address) && ( */}
                      <div>
                        <hr />
                        <div className="row">
                          <div className="col-12 col-sm-6">
                            <Form.Group controlId="conciergeUser">
                              <Form.Label>Select Service:</Form.Label>
                              <Select
                              style={{ minWidth: 300 }}
                                placeholder={"Select a Service"}
                                onChange={(value, key) => {
                                  this.setState(
                                    { request_service_id: value },
                                    () => {
                                      if (key.key === "Other") {
                                        console.log("this is other service");
                                        this.setState({
                                          otherServiceFlag: true,
                                          mainServiceFlag: false,
                                        });
                                      } else {
                                        this.setState({
                                          otherServiceFlag: false,
                                          mainServiceFlag: true,
                                        });
                                      }
                                      console.log(
                                        "this is service is request->",
                                        key.key
                                      );
                                    }
                                  );
                                }}
                              >
                                {this.state.services
                                  ? this.state.services.data.map(
                                      (data, index) => {
                                        return (
                                          <OptGroup label={data.category}>
                                            {data.services.map((s, index) => {
                                              return (
                                                <Option
                                                  value={s.id}
                                                  key={s.service}
                                                >
                                                  {/* {s.icon} */}
                                                  {s.service}
                                                </Option>
                                              );
                                            })}
                                          </OptGroup>
                                        );
                                      }
                                    )
                                  : null}
                              </Select>
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                      {/* )} */}

                      {this.state.otherServiceFlag &&
                        !this.state.mainServiceFlag && (
                          <div>
                            <hr />
                            <div className="row">
                              <div className="col-12">
                                <p className="concierge-user-title">
                                  Other Service Details
                                </p>
                              </div>
                              <div className="col-6">
                                <div className="other-details-pod">
                                  <Form.Group controlId="conciergeUser">
                                    <Form.Label>
                                      What can we help you with?
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      maxLength="100"
                                      placeholder="What can we help you with?"
                                      onChange={(e) =>
                                        this.setStateDateValues(
                                          e,
                                          "other_service_name"
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 col-sm-6">
                                <div className="other-details-pod">
                                  <Form.Group controlId="conciergeUser">
                                    <Form.Label>
                                      When do you need this service by?
                                    </Form.Label>
                                    <DatePicker
                                      showTime={{ format: "HH:mm" }}
                                      showToday={false}
                                      format={"YYYY-MM-DD HH:mm"}
                                      placeholder="When do you need this service by"
                                      onChange={(e) =>
                                        this.setStateDateValues(
                                          e,
                                          "other_service_time"
                                        )
                                      }
                                      onOk={(e) =>
                                        this.setStateDateValues(
                                          e,
                                          "other_service_time"
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      <hr />
                      {!this.state.otherServiceFlag &&
                        this.state.mainServiceFlag && (
                          <div className="row">
                            <div className="col-12 col-sm-6">
                              <Form.Group controlId="conciergeUser">
                                <Form.Label>
                                  When do you need this service by?
                                </Form.Label>
                                <DatePicker
                                  showTime={{ format: "HH:mm" }}
                                  showToday={false}
                                  format={"YYYY-MM-DD HH:mm"}
                                  placeholder="When do you need this service by"
                                  disabledTime={this.disabledTime}
                                  onChange={(e) =>
                                    this.setStateDateValues(e, "service_time")
                                  }
                                  onOk={(e) =>
                                    this.setStateDateValues(e, "service_time")
                                  }
                                  disabledDate={(d) =>
                                    d.isBefore(moment().subtract(1, "days"))
                                  }
                                />
                              </Form.Group>
                            </div>
                          </div>
                        )}
                      {/* {(this.state.otherServiceFlag ||
                        this.state.mainServiceFlag) && (
                        <div className='row'>
                          <div className='col-12 col-sm-6'>
                            <Form.Group controlId='conciergeUser'>
                              <Form.Label>
                                Created as back date service?{' '}
                              </Form.Label>
                              <DatePicker
                                showTime={{ format: 'HH:mm' }}
                                showToday={false}
                                format={'YYYY-MM-DD HH:mm'}
                                placeholder='Created as back date service'
                                disabledDate={d => !d || d.isAfter(moment())}
                                onChange={e =>
                                  this.setStateDateValues(
                                    e,
                                    'back_date_service'
                                  )
                                }
                                onOk={e =>
                                  this.setStateDateValues(
                                    e,
                                    'back_date_service'
                                  )
                                }
                              />
                            </Form.Group>
                          </div>
                        </div>
                      )} */}
                      {console.log(service_time, "service_time")}
                      {serviceListShow && (
                        <div className="row">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-6">
                                <Form.Group>
                                  <Form.Label>
                                    Enter Service End Date:
                                  </Form.Label>
                                  <DatePicker
                                    showTime={{ format: "HH:mm" }}
                                    format={"YYYY-MM-DD HH:mm"}
                                    placeholder="Enter Service End Date"
                                    onChange={(e) =>
                                      this.setStateDateValues(
                                        e,
                                        "service_end_date"
                                      )
                                    }
                                    disabledDate={(d) =>
                                      !service_time
                                        ? d.isBefore(
                                            moment().subtract(1, "days")
                                          )
                                        : d.isBefore(moment(service_time))
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className="col-6">
                                <Form.Group>
                                  <Form.Label>Weight of elder:</Form.Label>
                                  <Form.Control
                                    type="number"
                                    maxLength="100"
                                    placeholder="(e.g 80 KG)"
                                    onChange={(e) =>
                                      this.setStateValuesGlobal(
                                        e,
                                        "weight_of_elder"
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>

                            <LanguagesSpoken
                              option={this.state.languages}
                              onChange={this.setLanguages}
                              label="Language preferences:"
                            />

                            <div className="row">
                              {this.state.languages.includes("Other") && (
                                <div className="col-sm-6">
                                  <Form.Group>
                                    <Form.Label>Other Language</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Other Langauge"
                                      onChange={(e) =>
                                        this.setStateValuesGlobal(
                                          e,
                                          "other_language"
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </div>
                              )}
                              <div className="col-12 col-sm-6">
                                <Form.Group>
                                  <Form.Label style={{ display: "block" }}>
                                    Food preferences:
                                  </Form.Label>
                                  <Radio.Group className="radio-inline-align">
                                    <div className="form-container">
                                      {foodPreferences.map((item, index) => {
                                        return (
                                          <Radio
                                            value={item}
                                            checked={this.state.foodPreferences}
                                            onClick={(e) =>
                                              this.setStateValuesGlobal(
                                                e,
                                                "other_language"
                                              )
                                            }
                                          >
                                            {item}
                                          </Radio>
                                        );
                                      })}
                                    </div>
                                  </Radio.Group>
                                </Form.Group>
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-6">
                                <Form.Group>
                                  <Form.Label>Specialization:</Form.Label>
                                  <Select
                                  style={{ minWidth: 300 }}
                                    onChange={(e) =>
                                      this.setStateValuesGlobal(
                                        e,
                                        "specialization"
                                      )
                                    }
                                    value={this.state.specialization}
                                  >
                                    {Specialization.map((item, index) => {
                                      return (
                                        <Select.Option key={index} value={item}>
                                          {item}
                                        </Select.Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Group>
                              </div>

                              {this.state.specialization === "Other" && (
                                <div className="col-sm-6">
                                  <Form.Group>
                                    <Form.Label>
                                      Other Specialization:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Other Specialization"
                                      onChange={(e) =>
                                        this.setStateValuesGlobal(
                                          e,
                                          "other_specialization"
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        className="btn btn-primary"
                        onClick={(e) => this.addConciergeHandler(e)}
                      >
                        Create Service Request
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
      addNewConsumerAddress,
      getStatesList,
      conciergeCreate,
      conciergeServiceList,
      consumerList,
      emergencyCreate,
      consumerSearchList,
      getCities,
      getStates,
      getCountries,
      conciergeImageUpload,
    })(AddConciergePage)
  )
);

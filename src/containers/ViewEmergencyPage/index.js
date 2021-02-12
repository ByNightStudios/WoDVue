/*global google*/

import React from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { Button, Form, Image } from "react-bootstrap";
import { Radio, Input, Checkbox, Modal, notification, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateResponderAvailibilty } from "../../actions/ResponderActions";
import {
  getEmergencyDetails,
  emergencyRespondersList,
  emergencyUpdate,
  emergencyUpdateResponder,
  emergencyUpdateMilestone,
  createMcxtraRequest,
  updateNotes,
  fetchNearestRespondersList,
  fetchCallLogs,
} from "../../actions/EmergencyActions";
import {
  faClipboard,
  faCaretRight,
  faComments,
  faFileMedical,
  faExternalLinkAlt,
  faCircle,
  faExclamationTriangle,
  faMapMarkerAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ROUTES, PERMISSIONS } from "../../common/constants";
import { getRenderingHeader } from "../../common/helpers";
import RequestService from "../../service/RequestService";
import requireAuth from "../../hoc/requireAuth";
import PageLoader from "../../components/PageLoader";
import SubHeader from "../../components/SubHeader";
import SideNavigation from "../../components/SideNavigation";
import DefaultImage from "../../assets/images/icons/default.png";
import ElderEmergencyRequests from "../../components/ElderEmergencyRequests";
import ElderService from "../../service/ElderService";
import VirtualHouseMapping from "../../components/VirtualHouseMapping";
import ElderEmergencyCovid from "../../components/ElderEmergencyCovid";
import CallDetails from "../../components/CallDetails";
import { get } from "lodash";
import { Empty } from "antd";
import styles from "./view-emergency.scss";
import {
  getCities,
  getStates,
  getCountries,
} from "../../actions/LocationAction";
import FileSelector from "../../components/FileSelector";
import hasPermission from "../../hoc/hasPermission";
export const defaultPosition = {
  lat: 28.450654,
  lng: 77.065351,
};

const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;
class ViewEmergencyPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: "",
      city: null,
      state: null,
      country: null,
      record: null,
      is_mcxtra: 0,
      loader: false,
      responders: [],
      request_id: null,
      custom_address: 0,
      address_uuid: null,
      custom_location: 0,
      responder_id: null,
      geo_latitude: null,
      geo_longitude: null,
      editButtonToggle: 0,
      address_line_1: null,
      address_line_2: null,
      milestone_uuid: null,
      updatesResponderId: null,
      navigationDeployed: true,
      cancellation_reason: null,
      responderCountryCode: null,
      responderMobileNumber: null,
      responderLocationCode: null,
      showAddressFields: { display: "none" },
      countries: null,
      states: null,
      cities: null,
      proofLoaded: false,
      proof: null,
      showProof: false,
      responderSearch: "",
      nearestResponders: null,
      elderEmergencyCovid: null,
      virtualHouseMapping: null,
      elderCallLogs: [],
    };

    this.style = {};
    this.classToggle = "";
    this.autoComplete = null;
    this.cancellationReasonFlag = 0;

    this.requestService = new RequestService();
    this.elderService = new ElderService();
  }

  componentDidMount() {
    this.getRequestData(this.props.match.params.id);
  }

  loadEmergencyData = (requestIdentifier) => {
    const id = requestIdentifier;
    this.startLoader();
    this.elderService
      .getElderFormData(id, "af5")
      .then((response) => {
        if (response.data) {
          this.setState({
            elderEmergencyCovid: get(response, "data.covid_assessment", null),
            virtualHouseMapping: get(
              response,
              "data.virtual_house_mapping",
              null
            ),
          });
        }

        this.stopLoader();
      })
      .catch((errorData) => {
        if (errorData.response) {
          this.stopLoader();
          this.openNotification("Error!", errorData.response.data.message, 0);
        }
      });
  };

  getRequestData = async (requestIdentifier) => {
    this.startLoader();

    this.props
      .getEmergencyDetails(requestIdentifier)
      .then((result) => {
        console.log("REQUEST DATA WAS", result);

        this.stopLoader();
        this.loadEmergencyData(result.data[0].request_consumer.id);
        this.setState(
          {
            request_id: result.data[0].id,
            record: result.data[0],
            note: result.data[0].notes,
            cancellation_reason: result.data[0].cancellation_reason,
          },
          () => {
            document.title = `Emoha Admin | Emergency Request ${result.data[0].request_id}`;

            this.EFFECT_getStatusClassName();

            this.getRespondersList();
            this.getCallRecords();
            if (result.data[0].status === 0) {
              this.renderGoogleMaps();
              this.getCountriesList();
            }
          }
        );
      })
      .catch((error) => {
        this.stopLoader();
        console.log(error);
        this.notification(
          "Error",
          "Incorrect emergency request identifier detected. Please close this tab and re-open from the emergencies list.",
          0
        );
      });
  };

  startLoader = () => {
    this.setState({ loader: true });
  };

  stopLoader = () => {
    this.setState({ loader: false });
  };

  renderGoogleMaps = () => {
    const permissions = _.get(this.props, "user.permissions", []);
    if (
      !permissions ||
      !permissions.length ||
      !permissions.includes(PERMISSIONS.EMERGENCY_RESPONDER.value)
    ) {
      return;
    }
    var latlng = new google.maps.LatLng(39.305, -76.617);

    var map = new google.maps.Map(document.getElementById(`map`), {
      zoom: 13,
      center: latlng,
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
          //console.log(marker.latLng.lat(), marker.latLng.lng())
          let geo_latitude = marker.latLng.lat();
          let geo_longitude = marker.latLng.lng();

          this.setState({ geo_latitude, geo_longitude });
        });

        this.setState({
          geo_latitude: place.geometry.location.lat(),
          geo_longitude: place.geometry.location.lng(),
        });
      });

      map.fitBounds(bounds);
    });
  };

  getRespondersList = () => {
    // this.startLoader();

    const locationCode = _.get(
      this.state.record,
      "request_consumer.owner.location_code",
      null
    );

    this.props
      .emergencyRespondersList(this.state.responderSearch, locationCode)
      .then((result) => {
        // this.stopLoader();
        let responders = [];

        result.data.map((responder, index) => {
          return responders.push(responder);
        });

        this.setState({
          responders,
        });
      })
      .catch((error) => {
        // this.stopLoader();
      });
  };

  getCallRecords = () => {
    const emergency_request_id = this.state.record.request_id;
    this.props
      .fetchCallLogs({ request_id: emergency_request_id })
      .then((result) => {
        this.setState({
          elderCallLogs: result,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  setResponder = (responder_id) => {
    this.setState({
      responder_id,
      responderSearch: "",
    });

    const responder = this.state.responders.find(
      (item) => item.id === responder_id
    );

    if (responder) {
      this.setState({
        responderMobileNumber: responder.mobile_number,
        responderCountryCode: responder.country_code,
        responderLocationCode: responder.location_code,
      });
    }
  };

  setUpdatedResponder = (responder_id) => {
    this.setState({ updatesResponderId: responder_id, responderSearch: "" });

    const responder = this.state.responders.find(
      (item) => item.id === responder_id
    );

    if (responder) {
      this.setState({
        responderMobileNumber: responder.mobile_number,
        responderCountryCode: responder.country_code,
        responderLocationCode: responder.location_code,
      });
    }
  };

  responderSearch = (search) => {
    this.setState({ responderSearch: search }, () => {
      this.getRespondersList();
    });
  };

  setAddress = (event) => {
    let value = event.currentTarget.value;

    if (value === "custom_location") {
      this.setState({
        custom_location: 1,
        custom_address: 0,
        address_uuid: null,
        geo_longitude: this.state.record.geo_longitude,
        geo_latitude: this.state.record.geo_latitude,
        showAddressFields: { display: "none" },
      });
    } else if (value === "custom_address") {
      this.setState({
        custom_location: 0,
        custom_address: 1,
        address_uuid: null,
        showAddressFields: { display: "block" },
      });
    } else {
      this.setState({
        custom_address: 0,
        custom_location: 0,
        address_uuid: value,
        showAddressFields: { display: "none" },
        geo_longitude: event.currentTarget.getAttribute("data-geo_longitude"),
        geo_latitude: event.currentTarget.getAttribute("data-geo_latitude"),
      });
    }
  };

  getStatesList(country) {
    this.setState({ loader: true });
    this.props
      .getStates(country)
      .then((result) => {
        this.setState({ states: result.data, cities: null, loader: false });
      })
      .catch((error) => {
        console.log(error);
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

  setAddressStateValues = (e, field) => {
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
    } else if (field === "state") {
      state = e.currentTarget.value;

      this.setState({ state, city: null });
      this.getCitiesList(state);
    } else if (field === "country") {
      country = e.currentTarget.value;

      this.setState({ country, state: null, city: null });
      this.getStatesList(country);
    } else {
      geo_latitude = e.position.lat;
      geo_longitude = e.position.lng;

      this.setState({ geo_latitude, geo_longitude });
    }
  };

  assignEmergencyHandler = (e) => {
    e.preventDefault();

    let details = {
      responder_uuid: this.state.responder_id,
      status: 1,
    };

    if (!details.responder_uuid || details.responder_uuid === "VOID") {
      return this.notification(
        "Error",
        "Please select a responder to allocate to this request.",
        0
      );
    }

    const {
      address_uuid,
      custom_address,
      custom_location,
      address_line_1,
      address_line_2,
      country,
      state,
      geo_latitude,
      geo_longitude,
    } = this.state;

    if (!custom_address && !custom_location && !address_uuid) {
      return this.notification(
        "Error",
        "Please choose an address where the responder needs to be dispatched.",
        0
      );
    }

    if (custom_address === 0 && address_uuid) {
      details = { ...details, custom_address: 0, address_uuid: address_uuid };
    } else if (custom_location === 1) {
      details = { ...details, current_location: 1, custom_address: 0 };
    } else if (custom_address === 1) {
      if (!address_line_1) {
        return this.notification(
          "Error",
          "Please enter a valid address in Address Line 1.",
          0
        );
      }
      if (!address_line_2) {
        return this.notification(
          "Error",
          "Please enter a valid address in Address Line 2.",
          0
        );
      }
      if (!country) {
        return this.notification("Error", "Please select a country.", 0);
      }
      if (!state) {
        return this.notification("Error", "Please select a state.", 0);
      }
      if (!geo_latitude && !geo_longitude) {
        return this.notification(
          "Error",
          "Please select a location on the map by moving the map marker.",
          0
        );
      }

      details = {
        ...details,
        custom_address,
        address_line_1,
        address_line_2,
        country,
        state,
        geo_latitude,
        geo_longitude,
      };
    }

    this.startLoader();

    this.props
      .emergencyUpdate(this.state.request_id, details)
      .then((result) => {
        this.stopLoader();
        this.notification(
          "Success",
          "Responder has been successfully assigned to this request.",
          1
        );
      })
      .catch((error) => {
        this.stopLoader();
        this.notification("Error", error.message, 0);
      });
  };

  toggleEditButton = (e) => {
    if (!this.state.editButtonToggle) {
      this.getRespondersList();
    }

    this.setState((state) => ({
      editButtonToggle: !state.editButtonToggle,
    }));
  };

  updateResponderHandler = (e) => {
    if (
      !this.state.updatesResponderId ||
      this.state.updatesResponderId === "VOID"
    ) {
      return this.notification(
        "Error",
        "Please choose an available responder and try again.",
        0
      );
    }

    this.startLoader();

    this.props
      .emergencyUpdateResponder(
        this.state.request_id,
        this.state.updatesResponderId
      )
      .then((result) => {
        this.stopLoader();

        this.setState((state) => ({
          editButtonToggle: !state.editButtonToggle,
          updatesResponderId: null,
        }));

        this.notification(
          "Success",
          "New Responder was allocated to this request.",
          1
        );
      })
      .catch((error) => {
        this.stopLoader();

        this.notification("Error", error.message, 0);
      });
  };

  setMilestoneIdHandler = async (e, status) => {
    await this.setState({ milestone_uuid: e.target.value });

    confirm({
      title: "Please confirm if you wish to proceed with this action?",
      okType: "danger",
      okText: "Yes, Continue",
      cancelText: "No, Abort",
      centered: true,
      onOk: () => {
        this.updateMilestone(status);
      },
      onCancel() {
        return;
      },
    });
  };

  updateMilestone = (milestoneStatus) => {
    this.startLoader();

    let status = milestoneStatus ? 0 : 1;

    this.props
      .emergencyUpdateMilestone(
        this.state.request_id,
        this.state.milestone_uuid,
        status
      )
      .then((result) => {
        this.stopLoader();

        this.notification(
          "Success",
          "Milestone was updated for this request.",
          1
        );
      })
      .catch((error) => {
        this.stopLoader();

        this.notification("Error", error.message, 0);
      });
  };

  setCancellationReason = (e) => {
    this.setState({ cancellation_reason: e.currentTarget.value });
  };

  confirmCancellation = () => {
    confirm({
      title: "Are you sure that you wish to perform this action?",
      okText: "Yes, I'm Sure",
      okType: "danger",
      cancelText: "No, Abort",
      centered: true,
      onOk: () => {
        this.cancelEmergencyHandler();
      },
      onCancel() {
        return;
      },
    });
  };

  cancelEmergencyHandler = () => {
    this.startLoader();

    const dataPayload = {
      status: 3,
      cancellation_reason: this.state.cancellation_reason,
      cancellation_date: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    this.props
      .emergencyUpdate(this.state.record.id, dataPayload)
      .then((result) => {
        this.stopLoader();

        this.notification(
          "Success",
          "Emergency request has been cancelled successfully!",
          1
        );
      })
      .catch((error) => {
        this.stopLoader();
        this.notification("Error", error.message, 0);
      });
  };

  setNotes = (e) => {
    this.setState({ note: e.currentTarget.value });
  };

  updateNotes = () => {
    this.startLoader();

    let payload = {
      request_uuid: this.state.record.id,
      notes: this.state.note,
    };

    this.props
      .updateNotes(payload)
      .then((data) => {
        this.stopLoader();
        this.notification("Success", "Note Added Successfully.", 1);
      })
      .catch((error) => {
        this.stopLoader();
        this.notification("Error", error.message, 0);
      });
  };

  handleNavigationToggle = () => {
    this.setState((state) => ({
      navigationDeployed: !state.navigationDeployed,
    }));
  };

  notification = (message, description, status) => {
    this.openNotification(message, description, status);

    if (status) {
      this.getRequestData(this.props.match.params.id);
    }
  };

  openNotification = (message, description, status) => {
    const style = { color: status ? "green" : "red" };

    const args = {
      message,
      description,
      duration: 5,
      style,
    };

    notification.open(args);
  };

  EFFECT_getStatusClassName = () => {
    const { status } = this.state.record;

    if (status === 0) {
      this.classToggle = "request-status-value status-red";
      return;
    } else if (status === 1) {
      this.classToggle = "request-status-value status-orange";
      return;
    } else if (status === 2) {
      this.classToggle = "request-status-value status-green";
      return;
    } else if (status === 3) {
      this.classToggle = "request-status-value";
      return;
    }
  };

  getUserPhone = (country_code, mobile_number) => {
    return `+${country_code}-${mobile_number}`;
  };

  getRenderingSubHeader = () => {
    const leftChildren = [
      <h2 key={0}>
        Emergency Request:{" "}
        {this.state.record !== undefined ? this.state.record.request_id : ""}
      </h2>,
    ];

    const rightChildren = [];

    return (
      <SubHeader leftChildren={leftChildren} rightChildren={rightChildren} />
    );
  };

  showProofHandler = () => {
    if (this.state.proofLoaded && this.state.proof) {
      this.setState({ showProof: !this.state.showProof });
    } else if (!this.state.proofLoaded) {
      this.startLoader();
      this.requestService
        .getRequestProof({
          type: "Emergency",
          requestID: this.state.request_id,
        })
        .then((res) => {
          if (res.data && res.data.length) {
            this.setState(
              { proof: res.data[0], proofLoaded: true, loader: false },
              () => {
                return this.showProofHandler();
              }
            );
          } else {
            this.stopLoader();
            return this.openNotification(
              "Error",
              "Unable to fetch request media now.",
              0
            );
          }
        })
        .catch((error) => {
          this.stopLoader();
          this.openNotification("Error", "Please try again later.", 0);
          return;
        });
    }
  };

  onFileSelection = (file) => {
    const payload = new FormData();
    payload.append("file", file);

    this.startLoader();
    this.requestService
      .addRequestMedia(payload)
      .then((result) => {
        this.openNotification("Success", "File Uploaded Successfully.", 1);
        this.setState({ proof: result.data, loader: false });
      })
      .catch((error) => {
        this.stopLoader();
        this.openNotification("Error", "Please try again.", 0);
      });
  };

  addRequestProof = () => {
    this.startLoader();
    this.requestService
      .addRequestProof({
        type: "Emergency",
        request_id: this.state.request_id,
        image_id: this.state.proof.id,
      })
      .then((res) => {
        this.openNotification(
          "Success",
          "Request Proof Uploaded Successfully.",
          1
        );
        this.setState({ proof: null });
        this.getRequestData(this.state.request_id);
      })
      .catch((err) => {
        this.stopLoader();
        this.openNotification("Error", "Please try again.", 0);
      });
  };

  openResponderLocation = (geoLocation) => {
    const { lat, lng } = geoLocation;

    if (!lat || !lng) {
      return this.openNotification(
        "Error",
        "Location Coordinates are missing.",
        0
      );
    }

    window.open(`https://google.com/maps?q=${lat},${lng}`, "_blank");
  };

  getRenderableResponder = (responder) => {
    let renderString = ``;

    if (responder) {
      if (responder.full_name) {
        renderString += responder.full_name;
      }

      if (responder.service_type) {
        renderString += ` | ${responder.service_type}`;
      }

      if (responder.location_code && responder.location_code !== "") {
        renderString += ` | ${responder.location_code}`;
      }
    }

    return renderString;
  };

  fetchNearestResponders = () => {
    this.startLoader();

    const payload = {
      request_id: this.state.record.id,
    };

    this.props
      .fetchNearestRespondersList(payload)
      .then((responseData) => {
        this.stopLoader();

        console.log("NEAREST RESPONDERS DATA WAS", responseData);

        this.setState({
          nearestResponders: responseData,
        });

        // this.notification('Success', 'Note Added Successfully.', 1);
      })
      .catch((error) => {
        this.stopLoader();

        this.notification("Error", error.message, 0);
      });
  };

  getAgentName(data) {
    if (data) {
      return _.get(data, "agentName", "N/A");
    }
    return "N/A";
  }
  getEmergencyAcceptedBy(){
    const agentData = _.get(this.state, 'record.emergency_accept_user');
    return <div>Name : {_.get(agentData, 'first_name', 'No admin assigned')}, <br /> Email :{_.get(agentData, 'email','No Email found')}</div>
  }

  render() {
    const {
      navigationDeployed,
      record,
      virtualHouseMapping,
      elderEmergencyCovid,
    } = this.state;
    const permissions = _.get(this.props, "user.permissions", []);
    const elderdata = this.state.record
      ? this.state.record.request_consumer
      : null;
    const isSimulated = !!(this.state.record && this.state.record.is_simulated);
    const address = get(elderdata, "owner.consumer_addresses", []).find(
      (_address) => _address.default
    );
    return (
      this.state.record && (
        <React.Fragment>
          {getRenderingHeader(this.props.user)}
          <div
            className={
              navigationDeployed
                ? "emergencies-page sidebar-page sidebar-page--open position-relative"
                : "emergencies-page sidebar-page sidebar-page--closed position-relative"
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
                <FontAwesomeIcon
                  icon={faCaretRight}
                  size="2x"
                  color="#780001"
                />
              </Button>
            )}

            <main className="sidebar-page-wrapper position-relative">
              {/* Include the Sub Header on the Page */}
              {this.getRenderingSubHeader()}

              <div className="internal-content">
                <div className="emergency-details">
                  <div className="row chat-link-row">
                    <div className="col-4">
                      <div className="request-status">
                        <h5>Current Request Status</h5>
                        <h2 className={this.classToggle}>
                          <FontAwesomeIcon icon={faCircle} />{" "}
                          {this.state.record.statusObj.name}
                        </h2>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="request-status">
                        <h5>
                          Request Source:{" "}
                          {this.state.record.source
                            ? this.state.record.source
                            : "N/A"}
                          <br />
                          Agent:{" "}
                          {this.getAgentName(this.state.record.agent_name)}
                        </h5>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="request-status">
                        <h5>
                          Emergency Accepted By: {" "}
                          {this.getEmergencyAcceptedBy()}
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* todo - break small ui in component later */}
                  <div className="d-flex flex-row align-items-start justify-content-between w-100 h-100 ">
                    <div className="d-flex flex-column">
                      <div className="request-status _pt20">
                        <h5>User Details</h5>
                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">Name: </span>
                          <span className="user-details-value">
                            {this.state.record.request_consumer.full_name}
                          </span>
                        </div>
                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">Phone: </span>
                          <span className="user-details-value">
                            {this.getUserPhone(
                              this.state.record.request_consumer.country_code,
                              this.state.record.request_consumer.mobile_number
                            )}
                          </span>
                        </div>
                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">Time: </span>
                          <span className="user-details-value">
                            {this.state.record.is_back_dated
                              ? `${this.state.record.created_at_formatted} (Back Dated)`
                              : this.state.record.created_at_formatted}
                          </span>
                        </div>
                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">
                            Simulation:{" "}
                          </span>
                          <span className="user-details-value">
                            {isSimulated ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">
                            Location Code:{" "}
                          </span>
                          <span className="user-details-value">
                            {_.get(
                              this.state,
                              "record.request_consumer.owner.location_code",
                              null
                            ) !== null &&
                            _.get(
                              this.state,
                              "record.request_consumer.owner.location_code",
                              null
                            ) !== ""
                              ? _.get(
                                  this.state,
                                  "record.request_consumer.owner.location_code",
                                  null
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">Plan Name: </span>
                          <span className="user-details-value">
                            {get(this.state, "record.plan.name", "")}
                          </span>
                        </div>
                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">ERM Name: </span>
                          <span className="user-details-value">
                            {get(
                              this.state,
                              "record.request_responder[0].request_responder.full_name",
                              ""
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-8">
                      <CallDetails callData={this.state.elderCallLogs} />
                    </div>
                  </div>
                  <div className={"row elder-emergency"}>
                    <div className="col-5">
                      <div className="emergency-display">
                        <br />
                        <h4>Default address:</h4>
                        <p className="address-item-value">
                          {address && address.full_address}
                        </p>
                        <br />
                        <h4>Emergency Contacts</h4>

                        {elderdata ? (
                          elderdata.owner.emergencyContact.length !== 0 ? (
                            elderdata.owner.emergencyContact.map(
                              (item, index) => {
                                return (
                                  <div className="emergency-item" key={index}>
                                    <div className="emergency-item-content d-flex align-items-center justify-content-start">
                                      <div className="emergency-item-left">
                                        <img
                                          src={
                                            _.get(item, "media_exists", false)
                                              ? _.get(
                                                  item,
                                                  "media",
                                                  DefaultImage
                                                )
                                              : DefaultImage
                                          }
                                          className="emergency-item-image"
                                          alt="Aayush Dutta"
                                        />
                                      </div>

                                      <div className="emergency-item-right">
                                        <h6>
                                          {_.get(
                                            item,
                                            "full_name",
                                            "Unnamed Contact"
                                          )}
                                        </h6>
                                        <p>
                                          {_.get(item, "relationship", "N/A")}
                                        </p>
                                        <p>{`+${_.get(
                                          item,
                                          "country_code",
                                          "91"
                                        )}-${_.get(
                                          item,
                                          "mobile_number",
                                          "N/A"
                                        )}`}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <Empty />
                          )
                        ) : (
                          <Empty />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Start Request Tracking */}
                  <div className="row">
                    <div className="emergency-details-column col-12 col-sm-6">
                      <div className="row">
                        <div className="col-12">
                          <div className="emergency-details-wrapper pb-0">
                            <h5>
                              {record.status === 0
                                ? "Step 1: Allocate a responder"
                                : "Allocated Responder Details"}
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          {record.status === 0 ? (
                            <div className="emergency-details-wrapper pt-0">
                              {/* Start Nearest Responder Search */}
                              {/* <div className='nearest-responder'>
                                <button
                                  className='btn btn-secondary'
                                  onClick={() => this.fetchNearestResponders()}
                                >
                                  Fetch Nearest Responders
                                </button>

                                <div className='responder-list'>
                                  {nearestResponders !== null ? (
                                    <React.Fragment>
                                      <div className='responder-list-pod'>
                                        <div className='responder-list-heading'>
                                          <h6>By Distance</h6>
                                        </div>

                                        <div className='responder-list-content'>
                                          {nearestResponders.locationBasedResponders.map(
                                            (item, index) => {
                                              return (
                                                <div className='responder-list-item'>
                                                  <p>
                                                    <b>Name:</b>{' '}
                                                    {item.full_name}
                                                  </p>
                                                  <p>
                                                    <b>Phone:</b> +
                                                    {item.country_code}-
                                                    {item.mobile_number}
                                                  </p>
                                                  <p>
                                                    <b>Type:</b>{' '}
                                                    {
                                                      item.userableResponder
                                                        .service_type
                                                    }
                                                  </p>
                                                  <p>
                                                    <b>Distance:</b>{' '}
                                                    {item.distance} Km
                                                  </p>
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>

                                      <div className='responder-list-pod'>
                                        <div className='responder-list-heading'>
                                          <h6>By Location Code</h6>
                                        </div>

                                        <div className='responder-list-content'>
                                          {nearestResponders.zoneBasedResponders.map(
                                            (item, index) => {
                                              return (
                                                <div className='responder-list-item'>
                                                  <p>
                                                    <b>Name:</b>{' '}
                                                    {item.full_name}
                                                  </p>
                                                  <p>
                                                    <b>Phone:</b> +
                                                    {item.country_code}-
                                                    {item.mobile_number}
                                                  </p>
                                                  <p>
                                                    <b>Type:</b>{' '}
                                                    {
                                                      item.userableResponder
                                                        .service_type
                                                    }
                                                  </p>
                                                  <p>
                                                    <b>Location Code:</b>{' '}
                                                    {
                                                      item.userableResponder
                                                        .location_code
                                                    }
                                                  </p>
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div> */}
                              {/* End Nearest Responder Search */}

                              {permissions &&
                                permissions.length !== 0 &&
                                permissions.includes(
                                  PERMISSIONS.EMERGENCY_RESPONDER.value
                                ) && (
                                  <Form className="map-responder-form">
                                    <div className="responder-selection-wrapper">
                                      <Form.Group controlId="responderAllocated">
                                        <Form.Label>
                                          Available responders
                                        </Form.Label>
                                        <Select
                                          showSearch
                                          placeholder="Search for a responder"
                                          onChange={(value) =>
                                            this.setResponder(value)
                                          }
                                          onSearch={(value) =>
                                            this.responderSearch(value)
                                          }
                                          filterOption={false}
                                          style={{ minWidth: 300 }}
                                        >
                                          {!this.state.responders.length ? (
                                            <Option disabled={true} value={""}>
                                              No Responders Available
                                            </Option>
                                          ) : null}

                                          {this.state.responders.map(
                                            (responder, index) => {
                                              return (
                                                <Option
                                                  key={index}
                                                  value={responder.id}
                                                >
                                                  {this.getRenderableResponder(
                                                    responder
                                                  )}
                                                </Option>
                                              );
                                            }
                                          )}
                                        </Select>
                                      </Form.Group>
                                    </div>

                                    <React.Fragment>
                                      <div className="user-addresses-wrapper">
                                        <Radio.Group>
                                          <Form.Label>
                                            Available Dispatch Addresses
                                          </Form.Label>
                                          {record.request_consumer.owner
                                            .consumer_addresses
                                            ? record.request_consumer.owner.consumer_addresses.map(
                                                (data, index) => {
                                                  if (data.is_active) {
                                                    return (
                                                      <Radio
                                                        key={index}
                                                        value={data.id}
                                                        data-geo_latitude={
                                                          data.geo_latitude
                                                        }
                                                        data-geo_longitude={
                                                          data.geo_longitude
                                                        }
                                                        onClick={(e) =>
                                                          this.setAddress(e)
                                                        }
                                                        className="existing-address-radio"
                                                      >
                                                        {data.full_address}
                                                        {` `}
                                                        <a
                                                          href={`https://google.com/maps/place/${data.geo_latitude},${data.geo_longitude}`}
                                                          target="_blank"
                                                          className="maps-link"
                                                          rel="noopener noreferrer"
                                                        >
                                                          <FontAwesomeIcon
                                                            icon={
                                                              faExternalLinkAlt
                                                            }
                                                          />{" "}
                                                          Open in Google Maps
                                                        </a>
                                                        {` ${
                                                          data.default
                                                            ? "(DEFAULT)"
                                                            : ""
                                                        }`}
                                                      </Radio>
                                                    );
                                                  }
                                                }
                                              )
                                            : null}

                                          {record.geo_longitude &&
                                          record.geo_latitude ? (
                                            <Radio
                                              value="custom_location"
                                              onClick={(e) =>
                                                this.setAddress(e)
                                              }
                                            >
                                              Current Location -{" "}
                                              <a
                                                href={
                                                  record.geo_latitude &&
                                                  record.geo_longitude
                                                    ? `https://google.com/maps/place/${record.geo_latitude},${record.geo_longitude}`
                                                    : null
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <FontAwesomeIcon
                                                  icon={faExternalLinkAlt}
                                                />{" "}
                                                Open in Google Maps
                                              </a>
                                            </Radio>
                                          ) : null}
                                          <Radio
                                            value="custom_address"
                                            onClick={(e) => this.setAddress(e)}
                                          >
                                            Custom Address
                                          </Radio>
                                        </Radio.Group>

                                        <div
                                          className="custom-address"
                                          style={this.state.showAddressFields}
                                        >
                                          <Form.Group>
                                            <Form.Control
                                              style={{
                                                width: "100%",
                                                marginBottom: "8px",
                                              }}
                                              placeholder="Address Line 1"
                                              onChange={(e) =>
                                                this.setAddressStateValues(
                                                  e,
                                                  "address_line_1"
                                                )
                                              }
                                            />
                                          </Form.Group>
                                          <Form.Group>
                                            <Form.Control
                                              style={{
                                                width: "100%",
                                                marginBottom: "8px",
                                              }}
                                              placeholder="Address Line 2"
                                              onChange={(e) =>
                                                this.setAddressStateValues(
                                                  e,
                                                  "address_line_2"
                                                )
                                              }
                                            />
                                          </Form.Group>
                                          <Form.Group>
                                            <Form.Control
                                              as="select"
                                              style={{ width: "100%" }}
                                              onChange={(e) =>
                                                this.setAddressStateValues(
                                                  e,
                                                  "country"
                                                )
                                              }
                                              value={
                                                this.state.country
                                                  ? this.state.country
                                                  : "VOID"
                                              }
                                            >
                                              <option value={"VOID"}>
                                                Please select a country
                                              </option>
                                              {this.state.countries &&
                                                this.state.countries.length &&
                                                this.state.countries.map(
                                                  (country) => {
                                                    return (
                                                      <option
                                                        value={country.country}
                                                      >
                                                        {country.country}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                            </Form.Control>
                                          </Form.Group>
                                          <Form.Group>
                                            <Form.Control
                                              as="select"
                                              style={{ width: "100%" }}
                                              onChange={(e) =>
                                                this.setAddressStateValues(
                                                  e,
                                                  "state"
                                                )
                                              }
                                              disabled={
                                                this.state.country
                                                  ? false
                                                  : true
                                              }
                                              value={
                                                this.state.state
                                                  ? this.state.state
                                                  : "VOID"
                                              }
                                            >
                                              <option value={"VOID"}>
                                                Please select a state
                                              </option>
                                              {this.state.states &&
                                                this.state.states.length &&
                                                this.state.states.map(
                                                  (State) => {
                                                    return (
                                                      <option
                                                        value={State.state}
                                                      >
                                                        {State.state}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                            </Form.Control>
                                          </Form.Group>

                                          <Form.Group>
                                            <Form.Control
                                              as="select"
                                              style={{ width: "100%" }}
                                              onChange={(e) =>
                                                this.setAddressStateValues(
                                                  e,
                                                  "city"
                                                )
                                              }
                                              disabled={
                                                this.state.state ? false : true
                                              }
                                              value={
                                                this.state.city
                                                  ? this.state.city
                                                  : "VOID"
                                              }
                                            >
                                              <option value={"VOID"}>
                                                Please select a city
                                              </option>
                                              {this.state.cities &&
                                                this.state.cities.length &&
                                                this.state.cities.map(
                                                  (city) => {
                                                    return (
                                                      <option value={city.city}>
                                                        {city.city}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                            </Form.Control>
                                          </Form.Group>

                                          <div className="custom-address-map">
                                            <TextArea
                                              rows={1}
                                              style={{ width: "100%" }}
                                              placeholder="Search for a Location..."
                                              id="pac-input"
                                            />

                                            <div
                                              id="map"
                                              className="google-map"
                                            ></div>
                                          </div>
                                        </div>
                                      </div>

                                      <Button
                                        className="btn btn-primary mx-auto"
                                        onClick={(e) =>
                                          this.assignEmergencyHandler(e)
                                        }
                                        disabled={false}
                                      >
                                        Allocate Responder
                                      </Button>
                                    </React.Fragment>
                                  </Form>
                                )}
                            </div>
                          ) : (
                            <div className="emergency-details-wrapper pt-0">
                              <div className="responder-contact d-flex align-items-center justify-content-start">
                                <span className="responder-contact-param">
                                  Name:
                                </span>
                                <span className="responder-contact-value">
                                  {record.request_responder.length
                                    ? record.request_responder[0]
                                        .request_responder.full_name
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="responder-contact d-flex align-items-center justify-content-start">
                                <span className="responder-contact-param">
                                  Contact Number:
                                </span>
                                <span className="responder-contact-value">
                                  {record.request_responder.length
                                    ? "+91" +
                                      record.request_responder[0]
                                        .request_responder.mobile_number
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="responder-contact d-flex align-items-center justify-content-start">
                                <span className="responder-contact-param">
                                  Location Code:
                                </span>
                                <span className="responder-contact-value">
                                  {record.request_responder.length &&
                                  record.request_responder[0].request_responder
                                    .owner.location_code
                                    ? record.request_responder[0]
                                        .request_responder.owner.location_code
                                    : "N/A "}
                                </span>
                              </div>

                              {record.status === 1 &&
                              permissions &&
                              permissions.length !== 0 &&
                              permissions.includes(
                                PERMISSIONS.EMERGENCY_RESPONDER.value
                              ) ? (
                                <div className="responder-contact d-flex align-items-center justify-content-start">
                                  <span className="responder-contact-param">
                                    {!this.state.editButtonToggle ? (
                                      <React.Fragment>
                                        <Button
                                          className="btn btn-primary mx-auto"
                                          onClick={(e) =>
                                            this.toggleEditButton(e)
                                          }
                                        >
                                          Change Responder
                                        </Button>
                                      </React.Fragment>
                                    ) : (
                                      <Button
                                        className="btn btn-primary mx-auto"
                                        onClick={(e) =>
                                          this.toggleEditButton(e)
                                        }
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                  </span>
                                </div>
                              ) : null}

                              {this.state.editButtonToggle &&
                              permissions &&
                              permissions.length !== 0 &&
                              permissions.includes(
                                PERMISSIONS.EMERGENCY_RESPONDER.value
                              ) ? (
                                <React.Fragment>
                                  <hr />

                                  {/* Start Nearest Responder Search */}
                                  {/* <div className='nearest-responder'>
                                    <button
                                      className='btn btn-secondary'
                                      onClick={() =>
                                        this.fetchNearestResponders()
                                      }
                                    >
                                      Fetch Nearest Responders
                                    </button>

                                    <div className='responder-list'>
                                      {nearestResponders !== null ? (
                                        <React.Fragment>
                                          <div className='responder-list-pod'>
                                            <div className='responder-list-heading'>
                                              <h6>By Distance</h6>
                                            </div>

                                            <div className='responder-list-content'>
                                              {nearestResponders.locationBasedResponders.map(
                                                (item, index) => {
                                                  return (
                                                    <div className='responder-list-item'>
                                                      <p>
                                                        <b>Name:</b>{' '}
                                                        {item.full_name}
                                                      </p>
                                                      <p>
                                                        <b>Phone:</b> +
                                                        {item.country_code}-
                                                        {item.mobile_number}
                                                      </p>
                                                      <p>
                                                        <b>Type:</b>{' '}
                                                        {
                                                          item.userableResponder
                                                            .service_type
                                                        }
                                                      </p>
                                                      <p>
                                                        <b>Distance:</b>{' '}
                                                        {item.distance} Km
                                                      </p>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>

                                          <div className='responder-list-pod'>
                                            <div className='responder-list-heading'>
                                              <h6>By Location Code</h6>
                                            </div>

                                            <div className='responder-list-content'>
                                              {nearestResponders.zoneBasedResponders.map(
                                                (item, index) => {
                                                  return (
                                                    <div className='responder-list-item'>
                                                      <p>
                                                        <b>Name:</b>{' '}
                                                        {item.full_name}
                                                      </p>
                                                      <p>
                                                        <b>Phone:</b> +
                                                        {item.country_code}-
                                                        {item.mobile_number}
                                                      </p>
                                                      <p>
                                                        <b>Type:</b>{' '}
                                                        {
                                                          item.userableResponder
                                                            .service_type
                                                        }
                                                      </p>
                                                      <p>
                                                        <b>Location Code:</b>{' '}
                                                        {
                                                          item.userableResponder
                                                            .location_code
                                                        }
                                                      </p>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div> */}
                                  {/* End Nearest Responder Search */}

                                  <Form className="map-responder-form">
                                    <Form.Group controlId="responderAllocated">
                                      <Form.Label>
                                        Select a Responder
                                      </Form.Label>
                                      <Select
                                        showSearch
                                        placeholder="Search for a responder"
                                        onChange={(value) =>
                                          this.setUpdatedResponder(value)
                                        }
                                        onSearch={(value) =>
                                          this.responderSearch(value)
                                        }
                                        filterOption={false}
                                        style={{ minWidth: 300 }}
                                      >
                                        {!this.state.responders.length ? (
                                          <Option disabled={true} value={""}>
                                            No Responders Available
                                          </Option>
                                        ) : null}

                                        {this.state.responders.map(
                                          (responder, index) => {
                                            return (
                                              <Option
                                                key={index}
                                                value={responder.id}
                                              >
                                                {this.getRenderableResponder(
                                                  responder
                                                )}
                                              </Option>
                                            );
                                          }
                                        )}
                                      </Select>
                                    </Form.Group>
                                  </Form>
                                  <div className="responder-contact d-flex align-items-center justify-content-start">
                                    <span className="responder-contact-param">
                                      <Button
                                        className="btn btn-primary mx-auto"
                                        onClick={(e) =>
                                          this.updateResponderHandler(e)
                                        }
                                      >
                                        Update
                                      </Button>
                                    </span>
                                  </div>
                                </React.Fragment>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {record.status === 1 ||
                    record.status === 2 ||
                    record.status === 3 ? (
                      <div className="emergency-details-column col-12 col-sm-6">
                        <div className="emergency-details-wrapper">
                          <h5>Step 2: Track the progress</h5>
                          <Form className="track-responder-form">
                            {record.status === 1 ? (
                              <React.Fragment>
                                {get(
                                  record,
                                  "request_responder[0].request_responder_milestones",
                                  []
                                ).map((milestone, index) => {
                                  if (index === 0)
                                    return (
                                      <React.Fragment key={index}>
                                        <Checkbox
                                          checked={
                                            milestone.status ? true : false
                                          }
                                          style={
                                            milestone.status ? this.style : null
                                          }
                                          value={milestone.id}
                                        >
                                          {milestone.request_milestone.name}
                                          <small>
                                            {milestone.status
                                              ? " - " +
                                                milestone.updated_at_formatted
                                              : ""}
                                          </small>
                                        </Checkbox>
                                      </React.Fragment>
                                    );
                                  else
                                    return (
                                      <React.Fragment>
                                        <Checkbox
                                          checked={
                                            milestone.status ? true : false
                                          }
                                          onChange={(e, status) =>
                                            !milestone.status
                                              ? this.setMilestoneIdHandler(
                                                  e,
                                                  milestone.status
                                                )
                                              : null
                                          }
                                          style={
                                            milestone.status ? this.style : null
                                          }
                                          value={milestone.id}
                                        >
                                          {milestone.request_milestone.name}
                                          <small>
                                            {milestone.status
                                              ? " - " +
                                                milestone.updated_at_formatted
                                              : ""}
                                          </small>
                                        </Checkbox>
                                      </React.Fragment>
                                    );
                                })}
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                {record.status === 2 ? (
                                  <Checkbox.Group>
                                    {get(
                                      record,
                                      "request_responder[0].request_responder_milestones",
                                      []
                                    ).map((milestone, index) => {
                                      return (
                                        <div key={index}>
                                          <Checkbox
                                            indeterminate={
                                              milestone.status ? true : false
                                            }
                                          >
                                            {milestone.request_milestone.name}
                                            <small>
                                              {milestone.status
                                                ? " - " +
                                                  milestone.updated_at_formatted
                                                : null}
                                            </small>
                                          </Checkbox>
                                        </div>
                                      );
                                    })}
                                  </Checkbox.Group>
                                ) : record.status === 3 &&
                                  record.request_responder.length ? (
                                  <Checkbox.Group disabled={true}>
                                    {get(
                                      record,
                                      "request_responder[0].request_responder_milestones",
                                      []
                                    ).map((milestone, index) => {
                                      return (
                                        <div key={index}>
                                          <Checkbox
                                            indeterminate={
                                              milestone.status ? true : false
                                            }
                                          >
                                            {milestone.request_milestone.name}
                                            <small>
                                              {milestone.status
                                                ? " - " +
                                                  milestone.updated_at_formatted
                                                : ""}
                                            </small>
                                          </Checkbox>
                                        </div>
                                      );
                                    })}
                                  </Checkbox.Group>
                                ) : (
                                  <div className="request-cancelled">
                                    <h6>
                                      This request was cancelled either by the
                                      admin or the user.
                                    </h6>
                                  </div>
                                )}
                              </React.Fragment>
                            )}
                            {/* {record.status === 1 ?
                  <Button className='btn btn-primary' onClick={(e) => this.updateMilestone(e)}>Update</Button>
                  : null } */}
                          </Form>
                        </div>
                      </div>
                    ) : null}

                    <React.Fragment>
                      {record.status !== 0 ? (
                        <div className="emergency-details-column col-12 col-sm-6"></div>
                      ) : null}

                      <div className="emergency-details-column col-12 col-sm-6">
                        <div className="concierge-cancellation">
                          <h6>Add Notes</h6>
                          <Form id="conciergeNotes">
                            <Form.Group controlId="conciergeNoteDetails">
                              <TextArea
                                rows={4}
                                maxLength="2500"
                                value={this.state.note}
                                id="conciergeNoteDetails"
                                placeholder="Add Note Here..."
                                onChange={(e) => this.setNotes(e)}
                              />
                              <Form.Label style={{ marginTop: 5 }}>
                                {record.notes_update_date_formatted
                                  ? `Last Updated At: ` +
                                    record.notes_update_date_formatted
                                  : ""}
                              </Form.Label>
                            </Form.Group>

                            {permissions &&
                              permissions.length !== 0 &&
                              permissions.includes(
                                PERMISSIONS.EMERGENCY_NOTES.value
                              ) && (
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-notes"
                                  onClick={() => this.updateNotes()}
                                >
                                  <FontAwesomeIcon icon={faClipboard} /> Save
                                  Notes
                                </button>
                              )}
                          </Form>
                        </div>

                        {record.status === 0 ||
                        record.status === 1 ||
                        record.status === 3 ? (
                          <div className="emergency-cancellation">
                            {record.status !== 3 ? (
                              <h6>Cancel Emergency Request</h6>
                            ) : null}
                            <Form id="emergencyCancellation">
                              <Form.Group controlId="emergencyCancellationReason">
                                <Form.Label>Reason for Cancellation</Form.Label>
                                <TextArea
                                  rows={4}
                                  maxLength="2500"
                                  id="emergencyCancellationReason"
                                  placeholder="Briefly explain the reason for emergency cancellation..."
                                  value={this.state.cancellation_reason}
                                  onChange={(e) =>
                                    this.setCancellationReason(e)
                                  }
                                  disabled={record.status === 3 ? true : false}
                                />
                              </Form.Group>

                              {record.status !== 3 &&
                              permissions &&
                              permissions.length !== 0 &&
                              permissions.includes(
                                PERMISSIONS.EMERGENCY_CANCEL.value
                              ) ? (
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-cancel"
                                  onClick={() => this.confirmCancellation()}
                                >
                                  <FontAwesomeIcon
                                    icon={faExclamationTriangle}
                                  />{" "}
                                  Cancel Emergency
                                </button>
                              ) : null}
                            </Form>
                          </div>
                        ) : null}
                      </div>
                    </React.Fragment>
                  </div>
                  {/* Start Request Tracking */}

                  <div className="row chat-link-row chat-link-row">
                    {permissions &&
                      permissions.length !== 0 &&
                      permissions.includes(
                        PERMISSIONS.EMERGENCY_CHAT.value
                      ) && (
                        <div className="col-3">
                          <div className="chat-link-name">
                            <h5>Chat Support</h5>
                          </div>
                          <Link
                            to={`${ROUTES.SUPPORT}?id=${record.request_consumer.id}&name=${record.request_consumer.full_name}&mobile=${record.request_consumer.mobile_number}`}
                            className="btn btn-chat"
                          >
                            <FontAwesomeIcon icon={faComments} /> Begin Chat
                          </Link>
                        </div>
                      )}

                    {permissions &&
                      permissions.length !== 0 &&
                      permissions.includes(
                        PERMISSIONS.EMERGENCY_RECORDS.value
                      ) && (
                        <div className="col-3">
                          <div className="chat-link-name">
                            <h5>User Medical Details</h5>
                          </div>
                          <a
                            href={`${ROUTES.HOME}user/${record.request_consumer.id}/medical-record`}
                            className="btn btn-chat"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faFileMedical} /> View
                            Records
                          </a>
                        </div>
                      )}

                    {record.status === 2 ? (
                      record.proof_exists ? (
                        <div className="col-6">
                          <div className="chat-link-name">
                            <h5>Emergency Request Proof</h5>
                          </div>
                          <button
                            onClick={this.showProofHandler}
                            type="button"
                            className="btn btn-chat"
                          >
                            {this.state.showProof ? "Hide" : "View"}
                          </button>
                          {this.state.showProof ? (
                            <React.Fragment>
                              <Image
                                onClick={() =>
                                  window.open(this.state.proof.url, "_blank")
                                }
                                src={this.state.proof.url}
                                className="proof-image"
                              ></Image>
                              {this.state.proof.metadata &&
                              this.state.proof.metadata.geo_location ? (
                                <button
                                  onClick={() =>
                                    this.openResponderLocation(
                                      this.state.proof.metadata.geo_location
                                    )
                                  }
                                  type="button"
                                  className="btn btn-chat"
                                >
                                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                                  Responder's Location
                                </button>
                              ) : null}
                            </React.Fragment>
                          ) : null}
                        </div>
                      ) : (
                        permissions &&
                        permissions.length !== 0 &&
                        permissions.includes(
                          PERMISSIONS.EMERGENCY_PHOTO.value
                        ) && (
                          <div className="col-6">
                            <div className="chat-link-name">
                              <h5>Add Emergency Request Proof</h5>
                            </div>
                            <FileSelector
                              openNotification={this.openNotification}
                              onSelection={this.onFileSelection}
                              maxFileSize={10000}
                              fileType="image"
                            />

                            {this.state.proof && this.state.proof.url ? (
                              <div>
                                <Image
                                  onClick={() =>
                                    window.open(this.state.proof.url, "_blank")
                                  }
                                  src={this.state.proof.url}
                                  className="proof-image"
                                ></Image>
                                <button
                                  onClick={this.addRequestProof}
                                  type="button"
                                  className="btn btn-chat"
                                >
                                  Save
                                </button>
                              </div>
                            ) : null}
                          </div>
                        )
                      )
                    ) : null}
                  </div>
                </div>
                <div className={"elder-requests"}>
                  <ElderEmergencyRequests
                    currentElderIdentifier={elderdata.id}
                    startLoader={this.startLoader}
                    stopLoader={this.stopLoader}
                    openNotification={this.openNotification}
                    {...this.props}
                  />
                </div>
                <VirtualHouseMapping currentElderIdentifier={elderdata.id}
                    startLoader={this.startLoader}
                    stopLoader={this.stopLoader}
                    openNotification={this.openNotification}
                    {...this.props}/>
              </div>
            </main>
          </div>

          {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
          {this.state.loader ? <PageLoader /> : null}
        </React.Fragment>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  getEmergencyDetails,
  emergencyRespondersList,
  emergencyUpdate,
  emergencyUpdateResponder,
  emergencyUpdateMilestone,
  updateResponderAvailibilty,
  createMcxtraRequest,
  updateNotes,
  getCities,
  getStates,
  getCountries,
  fetchNearestRespondersList,
  fetchCallLogs,
};

export default hasPermission(
  requireAuth(connect(mapStateToProps, mapDispatchToProps)(ViewEmergencyPage))
);

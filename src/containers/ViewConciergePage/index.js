import React from "react";
import * as _ from "lodash";
import moment from "moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Form, Image } from "react-bootstrap";
import { Input, Checkbox, Modal, notification, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { emergencyRespondersList, emergencyRespondersListType } from "../../actions/EmergencyActions";
import {
  conciergeUpdate,
  conciergeUpdateProvider,
  serviceUpdate,
  serviceUpdateResponder,
  serviceUpdateMilestone,
  addFeedback,
  updateNotes,
  getConciergeDetails,
  fetchNearestRespondersList,
  conciergeImageUpload,
} from "../../actions/ConciergeAction";

import {
  faClipboard,
  faCaretRight,
  faComments,
  faFileMedical,
  faCircle,
  faExclamationTriangle,
  faMapMarkerAlt,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "../../common/constants";
import { getRenderingHeader } from "../../common/helpers";
import RequestService from "../../service/RequestService";
import requireAuth from "../../hoc/requireAuth";
import PageLoader from "../../components/PageLoader";
import SubHeader from "../../components/SubHeader";
import SideNavigation from "../../components/SideNavigation";

import styles from "./view-concierge.scss";
import FileSelector from "../../components/FileSelector";
import hasPermission from "../../hoc/hasPermission";

import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

const allowedStrings = "jpeg,png,jpg,pdf";
 
const shcDataArray = [ 
  'Nursing Officer Visit',
'Care Angel 24-Hour',
'Care Angel 12-Hour',
'Care Partner 24-Hour',
'Care Partner 12-hour'
];
class ViewConciergePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: "",
      record: null,
      loader: false,
      responders: [],
      request_id: null,
      responder_id: null,
      editButtonToggle: 0,
      milestone_uuid: null,
      updatesResponderId: null,
      navigationDeployed: true,
      cancellation_reason: null,
      responderCountryCode: null,
      responderMobileNumber: null,
      responderLocationCode: null,
      showAddressFields: { display: "none" },
      feedbackRatingValue: null,
      proofLoaded: false,
      proof: null,
      showProof: false,
      responderSearch: "",
      nearestResponders: null,
      pendingResponders: [],
    };

    this.style = {};
    this.classToggle = "";

    this.requestService = new RequestService();
  }

  componentDidMount() {
    this.getRequestData(this.props.match.params.id);
  }

  getRequestData = async (requestIdentifier) => {
    this.startLoader();

    this.props
      .getConciergeDetails(requestIdentifier)
      .then((result) => {
        this.stopLoader();

        this.setState(
          {
            request_id: result.data[0].id,
            record: result.data[0],
            note: result.data[0].notes,
            cancellation_reason: result.data[0].cancellation_reason,
          },
          () => {
            document.title = `Emoha Admin | Service Request ${result.data[0].request_id}`;

            this.EFFECT_getStatusClassName();
            const requestDataService =  _.get(result, 'data[0].service','');
            if(_.includes(shcDataArray, requestDataService)){
              this.getResponderTypeList(requestDataService)
            } else {
              this.getRespondersList();
            }
  
            this.fetchPendingResponders();
          }
        );
      })
      .catch((error) => {
        this.stopLoader();
        console.log(error);
        this.notification(
          "Error",
          "Incorrect service request identifier detected. Please close this tab and re-open from the service requests list.",
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

  getResponderTypeList = (responder) => {
    let responderType = '';
    const shcCADataArray = [ 
    'Care Angel 24-Hour',
    'Care Angel 12-Hour',
    ];

    const shcCPDataArray = [ 
    'Care Partner 24-Hour',
    'Care Partner 12-hour'
    ];

    const shcNODataArray = [ 
      'Nursing Officer Visit',
    ];
    if(_.includes(shcCADataArray, responder)){
      responderType = "Attendant"
    }
    if(_.includes(shcCPDataArray, responder)){
      responderType = "Nurse"
    }
    if(_.includes(shcNODataArray, responder)){
      responderType = "Nursing Officier"
    }

    this.props
      .emergencyRespondersListType(responderType)
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

  }

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

  assignConciergeHandler = (e) => {
    e.preventDefault();

    let details = {
      provider_uuid: this.state.responder_id,
      status: 1,
      service_request_id: this.state.request_id,
    };

    if (!details.provider_uuid || details.provider_uuid === "VOID")
      return this.openNotification("Error", "Please select a responder.", 0);

    this.startLoader();

    this.props
      .conciergeUpdate(details)
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

    let details = {
      provider_uuid: this.state.updatesResponderId,
      status: 1,
      service_request_id: this.state.request_id,
    };

    this.props
      .conciergeUpdateProvider(details)
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
      .serviceUpdateMilestone(
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
        this.cancelServiceHandler();
      },
      onCancel() {
        return;
      },
    });
  };

  cancelServiceHandler = () => {
    this.startLoader();

    const dataPayload = {
      status: 3,
      cancellation_reason: this.state.cancellation_reason,
      service_request_id: this.state.request_id,
    };

    this.props
      .serviceUpdate(dataPayload)
      .then((result) => {
        this.stopLoader();

        this.notification(
          "Success",
          "Service request has been cancelled successfully!",
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

  feedbackRating = (value) => {
    this.setState({
      feedbackRatingValue: value,
    });
  };

  checkRatingNumber = (starNum) => {
    if (starNum === this.state.record.rating) return true;
  };

  onSubmitFeedbackRating = () => {
    let details = {
      service_request_id: this.state.request_id,
      rating: this.state.feedbackRatingValue,
    };

    this.setState({
      loader: true,
    });

    this.props
      .addFeedback(details)
      .then((result) => {
        this.setState({
          loader: false,
        });
        this.notification("Success", "Feedback Added Successfully.", 1);
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification("Error", error.message, 0);
      });
  };

  updateNotes = () => {
    this.startLoader();

    let payload = {
      service_request_id: this.state.request_id,
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
    } else if (status === 3 || status === 4) {
      this.classToggle = "request-status-value";
      return;
    }
  };

  EFFECT_getPendingResponderStatusClassName(status) {
    switch (status) {
      case "PENDING":
        return "pending-responder-list-status-orange";
      case "ACCEPTED":
        return "pending-responder-list-status-green";
      case "REJECTED":
        return "pending-responder-list-status-red";
      case "EXPIRED":
        return "pending-responder-list-status-red";
      default:
        return "";
    }
  }

  getUserPhone = (country_code, mobile_number) => {
    return `+${country_code}-${mobile_number}`;
  };

  getRenderingSubHeader = () => {
    const leftChildren = [
      <h2 key={0}>
        Service Request:{" "}
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
          type: "Service",
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
        type: "Service",
        request_id: this.state.request_id,
        image_id: this.state.proof.id,
      })
      .then((res) => {
        this.notification("Success", "Request Proof Uploaded Successfully.", 1);
        this.setState({ proof: null });
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

  fetchPendingResponders = (refresh = null) => {
    this.startLoader();

    this.requestService
      .getServicePendingResponders(this.state.record.id)
      .then((responseData) => {
        this.stopLoader();

        this.setState({
          pendingResponders: responseData.data,
        });

        if (refresh !== null) {
          this.openNotification("Success", "Identified Responders Updated.", 1);
        }
      })
      .catch((error) => {
        this.stopLoader();

        this.notification(
          "Error",
          "Cannot fetch identified responders at this time.",
          0
        );
      });
  };
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleFileSelection = (event) => {
    const {
      service_id,
      record,
      record: { request_id },
    } = this.state;
    let fileObject = null;
    let ehr = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (_.get(event, "target.files", []).length !== 0) {
      fileObject = _.get(event, "target.files", [])[0];
    }
    if (fileObject !== null) {
      const { type, name, size } = fileObject;
      console.log(type, fileObject, "typetypetypetype");
      if (ehr.includes(type)) {
        const isLt2M = size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.openNotification("Error", "Image must be smaller than 5MB!", 0);
          return false;
        } else {
          this.getBase64(fileObject, (imageUrl) => {
            let payload = {
              user_concierge_service_id: request_id.replace(/^\D+/g, ""),
              documents: [
                {
                  type: type === "application/pdf" ? "pdf" : "image",
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
          "This file format is not supported. Choose a JPG, PDF or PNG image and try again.",
          0
        );
      }
    }
  };

  render() {
    const {
      navigationDeployed,
      record,
      nearestResponders,
      pendingResponders,
    } = this.state;

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
                    <div className="col-12">
                      <div className="request-status">
                        <h5>Current Request Status</h5>
                        <h2 className={this.classToggle}>
                          <FontAwesomeIcon icon={faCircle} />{" "}
                          {this.state.record.statusObj.name}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {record.status === 4 || record.status === 2 ? (
                    <div className="row chat-link-row">
                      <div className="col-12">
                        <div className="request-status">
                          <h5>Feedback:</h5>

                          <div className="col-6">
                            <div>
                              <fieldset
                                className="rating"
                                disabled={record.rating}
                              >
                                <input
                                  onClick={() => {
                                    this.feedbackRating(5);
                                  }}
                                  type="radio"
                                  id={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star5"
                                  }
                                  name={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id
                                  }
                                  value="5"
                                  checked={this.checkRatingNumber(5)}
                                />
                                <label
                                  className="full"
                                  htmlFor={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star5"
                                  }
                                ></label>
                                <input
                                  onClick={() => {
                                    this.feedbackRating(4);
                                  }}
                                  type="radio"
                                  id={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star4"
                                  }
                                  name={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id
                                  }
                                  value="4"
                                  checked={this.checkRatingNumber(4)}
                                />
                                <label
                                  className="full"
                                  htmlFor={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star4"
                                  }
                                ></label>
                                <input
                                  onClick={() => {
                                    this.feedbackRating(3);
                                  }}
                                  type="radio"
                                  id={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star3"
                                  }
                                  name={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id
                                  }
                                  value="3"
                                  checked={this.checkRatingNumber(3)}
                                />
                                <label
                                  className="full"
                                  htmlFor={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star3"
                                  }
                                ></label>
                                <input
                                  onClick={() => {
                                    this.feedbackRating(2);
                                  }}
                                  type="radio"
                                  id={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star2"
                                  }
                                  name={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id
                                  }
                                  value="2"
                                  checked={this.checkRatingNumber(2)}
                                />
                                <label
                                  className="full"
                                  htmlFor={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star2"
                                  }
                                ></label>
                                <input
                                  onClick={() => {
                                    this.feedbackRating(1);
                                  }}
                                  type="radio"
                                  id={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star1"
                                  }
                                  name={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id
                                  }
                                  value="1"
                                  checked={this.checkRatingNumber(1)}
                                />
                                <label
                                  className="full"
                                  htmlFor={
                                    record.request_provider[0]
                                      .request_provider_milestones[2].id +
                                    "star1"
                                  }
                                ></label>
                                <div>
                                  <button
                                    value="Submit"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      this.onSubmitFeedbackRating();
                                    }}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </fieldset>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {record.service === "Other" &&
                    (record.other_service_name ||
                      record.other_service_time) && (
                      <div className="row chat-link-row">
                        <div className="col-4">
                          <div className="other-details-pod">
                            <h5>Other Service Details</h5>
                            <span className="other-details-name">
                              What can we help you with?
                            </span>
                            <p>{record.other_service_name}</p>
                          </div>

                          <div className="other-details-pod">
                            <span className="other-details-name">
                              When do you need this service by?
                            </span>
                            <p>{record.other_service_time}</p>
                          </div>
                        </div>
                        <div className="col-4">
                          Request Source :{" "}
                          {record.source ? record.source : "N/A"}
                        </div>
                      </div>
                    )}

                  {record.service !== "Other" && record.other_service_time && (
                    <div className="row chat-link-row">
                      <div className="col-12 col-sm-4">
                        <p>{record.service}</p>
                        <p>{record.other_service_time}</p>
                      </div>

                      <div className="col-12 col-sm-4">
                        Request Source : {record.source ? record.source : "N/A"}
                      </div>
                      <div className="col-12 col-sm-4">
                        Service End Date :{" "}
                        {moment(record.service_end_date).format("DD-MM-YYYY hh:mm a")}
                      </div>
                    </div>
                  )}

                  <div className="row chat-link-row">
                    <div className="col-12">
                      <div className="request-status">
                        <h5>User Details</h5>

                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">Name: </span>
                          <span className="user-details-value">
                            {record.request_consumer.full_name}
                          </span>
                        </div>

                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">Phone: </span>
                          <span className="user-details-value">
                            {this.getUserPhone(
                              record.request_consumer.country_code,
                              record.request_consumer.mobile_number
                            )}
                          </span>
                        </div>

                        <div className="user-details-pod d-flex align-items-center justify-content-start">
                          <span className="user-details-name">Time: </span>
                          <span className="user-details-value">
                            {record.is_back_dated
                              ? `${record.created_at_formatted} (Back Dated)`
                              : record.created_at_formatted}
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
                          <span className="user-details-name">Address: </span>
                          <span className="user-details-value">
                            {record.request_address.full_address}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row pending-responder-list">
                    <div className="col-12">
                      <div className="pending-responder-list-header">
                        <h5 className="pending-responder-list-heading">
                          Identified Responders
                        </h5>
                        <Button onClick={this.fetchPendingResponders}>
                          <FontAwesomeIcon icon={faSyncAlt} />
                        </Button>
                      </div>
                      <div className="row">
                        {pendingResponders.length ? (
                          pendingResponders.map((responder, index) => {
                            return (
                              <div key={index} className="col-6">
                                <div className="pending-responder-list-item">
                                  <p>
                                    <b>
                                      Status:{" "}
                                      <span
                                        className={this.EFFECT_getPendingResponderStatusClassName(
                                          responder.responder_status
                                        )}
                                      >
                                        {responder.responder_status}
                                      </span>
                                    </b>
                                  </p>
                                  <p>
                                    <b>Name: </b>
                                    {responder.full_name}
                                  </p>
                                  <p>
                                    <b>Phone: </b>
                                    {responder.mobile_number}
                                  </p>
                                  <p>
                                    <b>Type: </b>
                                    {responder.service_type}
                                  </p>
                                  <p>
                                    <b>Location Code: </b>
                                    {responder.location_code}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr />
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
                              <div className="nearest-responder">
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => this.fetchNearestResponders()}
                                >
                                  Fetch Nearest Responders
                                </button>

                                <div className="responder-list">
                                  {nearestResponders !== null ? (
                                    <React.Fragment>
                                      <div className="responder-list-pod">
                                        <div className="responder-list-heading">
                                          <h6>By Distance</h6>
                                        </div>

                                        {nearestResponders
                                          .locationBasedResponders.length !==
                                        0 ? (
                                          <div className="responder-list-content">
                                            {nearestResponders.locationBasedResponders.map(
                                              (item, index) => {
                                                return (
                                                  <div className="responder-list-item">
                                                    <p>
                                                      <b>Name:</b>{" "}
                                                      {item.full_name}
                                                    </p>
                                                    <p>
                                                      <b>Phone:</b> +
                                                      {item.country_code}-
                                                      {item.mobile_number}
                                                    </p>
                                                    <p>
                                                      <b>Type:</b>{" "}
                                                      {
                                                        item.userableResponder
                                                          .service_type
                                                      }
                                                    </p>
                                                    <p>
                                                      <b>Distance:</b>{" "}
                                                      {item.distance} Km
                                                    </p>
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        ) : (
                                          <div className="responder-list-content">
                                            <p>No Responders Available</p>
                                          </div>
                                        )}
                                      </div>

                                      <div className="responder-list-pod">
                                        <div className="responder-list-heading">
                                          <h6>By Location Code</h6>
                                        </div>

                                        {nearestResponders.zoneBasedResponders
                                          .length !== 0 ? (
                                          <div className="responder-list-content">
                                            {nearestResponders.zoneBasedResponders.map(
                                              (item, index) => {
                                                return (
                                                  <div className="responder-list-item">
                                                    <p>
                                                      <b>Name:</b>{" "}
                                                      {item.full_name}
                                                    </p>
                                                    <p>
                                                      <b>Phone:</b> +
                                                      {item.country_code}-
                                                      {item.mobile_number}
                                                    </p>
                                                    <p>
                                                      <b>Type:</b>{" "}
                                                      {
                                                        item.userableResponder
                                                          .service_type
                                                      }
                                                    </p>
                                                    <p>
                                                      <b>Location Code:</b>{" "}
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
                                        ) : (
                                          <div className="responder-list-content">
                                            <p>No Responders Available</p>
                                          </div>
                                        )}
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                              {/* End Nearest Responder Search */}

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
                                  <Button
                                    className="btn btn-primary mx-auto"
                                    onClick={(e) =>
                                      this.assignConciergeHandler(e)
                                    }
                                    disabled={false}
                                  >
                                    Allocate Responder
                                  </Button>
                                </React.Fragment>
                              </Form>
                            </div>
                          ) : (
                            <div className="emergency-details-wrapper pt-0">
                              <div className="responder-contact d-flex align-items-center justify-content-start">
                                <span className="responder-contact-param">
                                  Name:
                                </span>
                                <span className="responder-contact-value">
                                  {record.request_provider.length
                                    ? record.request_provider[0]
                                        .request_responder.full_name
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="responder-contact d-flex align-items-center justify-content-start">
                                <span className="responder-contact-param">
                                  Contact Number:
                                </span>
                                <span className="responder-contact-value">
                                  {record.request_provider.length
                                    ? "+91" +
                                      record.request_provider[0]
                                        .request_responder.mobile_number
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="responder-contact d-flex align-items-center justify-content-start">
                                <span className="responder-contact-param">
                                  Location Code:
                                </span>
                                <span className="responder-contact-value">
                                  {record.request_provider.length &&
                                  record.request_provider[0].request_responder
                                    .owner.location_code
                                    ? record.request_provider[0]
                                        .request_responder.owner.location_code
                                    : "N/A "}
                                </span>
                              </div>

                              {record.status === 1 ? (
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

                              {this.state.editButtonToggle ? (
                                <React.Fragment>
                                  <hr />

                                  {/* Start Nearest Responder Search */}
                                  <div className="nearest-responder">
                                    <button
                                      className="btn btn-secondary"
                                      onClick={() =>
                                        this.fetchNearestResponders()
                                      }
                                    >
                                      Fetch Nearest Responders
                                    </button>

                                    <div className="responder-list">
                                      {nearestResponders !== null ? (
                                        <React.Fragment>
                                          <div className="responder-list-pod">
                                            <div className="responder-list-heading">
                                              <h6>By Distance</h6>
                                            </div>

                                            {nearestResponders
                                              .locationBasedResponders
                                              .length !== 0 ? (
                                              <div className="responder-list-content">
                                                {nearestResponders.locationBasedResponders.map(
                                                  (item, index) => {
                                                    return (
                                                      <div className="responder-list-item">
                                                        <p>
                                                          <b>Name:</b>{" "}
                                                          {item.full_name}
                                                        </p>
                                                        <p>
                                                          <b>Phone:</b> +
                                                          {item.country_code}-
                                                          {item.mobile_number}
                                                        </p>
                                                        <p>
                                                          <b>Type:</b>{" "}
                                                          {
                                                            item
                                                              .userableResponder
                                                              .service_type
                                                          }
                                                        </p>
                                                        <p>
                                                          <b>Distance:</b>{" "}
                                                          {item.distance} Km
                                                        </p>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            ) : (
                                              <div className="responder-list-content">
                                                <p>No Responders Available</p>
                                              </div>
                                            )}
                                          </div>

                                          <div className="responder-list-pod">
                                            <div className="responder-list-heading">
                                              <h6>By Location Code</h6>
                                            </div>

                                            {nearestResponders
                                              .zoneBasedResponders.length !==
                                            0 ? (
                                              <div className="responder-list-content">
                                                {nearestResponders.zoneBasedResponders.map(
                                                  (item, index) => {
                                                    return (
                                                      <div className="responder-list-item">
                                                        <p>
                                                          <b>Name:</b>{" "}
                                                          {item.full_name}
                                                        </p>
                                                        <p>
                                                          <b>Phone:</b> +
                                                          {item.country_code}-
                                                          {item.mobile_number}
                                                        </p>
                                                        <p>
                                                          <b>Type:</b>{" "}
                                                          {
                                                            item
                                                              .userableResponder
                                                              .service_type
                                                          }
                                                        </p>
                                                        <p>
                                                          <b>Location Code:</b>{" "}
                                                          {
                                                            item
                                                              .userableResponder
                                                              .location_code
                                                          }
                                                        </p>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            ) : (
                                              <div className="responder-list-content">
                                                <p>No Responders Available</p>
                                              </div>
                                            )}
                                          </div>
                                        </React.Fragment>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
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

                    {record.status > 0 ? (
                      <div className="emergency-details-column col-12 col-sm-6">
                        <div className="emergency-details-wrapper">
                          <h5>Step 2: Track the progress</h5>
                          <Form className="track-responder-form">
                            {record.status === 1 ? (
                              <React.Fragment>
                                {record.request_provider[0].request_provider_milestones.map(
                                  (milestone, index) => {
                                    if (index === 0 || index === 1)
                                      return (
                                        <React.Fragment key={index}>
                                          <Checkbox
                                            checked={
                                              milestone.status ? true : false
                                            }
                                            style={
                                              milestone.status
                                                ? this.style
                                                : null
                                            }
                                            value={milestone.id}
                                          >
                                            {milestone.request_milestone.name}
                                            <small>
                                              {milestone.status
                                                ? " - " +
                                                  (index === 0
                                                    ? record.created_at_formatted
                                                    : milestone.updated_at_formatted)
                                                : ""}
                                            </small>
                                          </Checkbox>
                                        </React.Fragment>
                                      );
                                    else
                                      return (
                                        <React.Fragment key={index}>
                                          <Checkbox
                                            checked={
                                              milestone.status ? true : false
                                            }
                                            onChange={(e, status) =>
                                              this.setMilestoneIdHandler(
                                                e,
                                                milestone.status
                                              )
                                            }
                                            style={
                                              milestone.status
                                                ? this.style
                                                : null
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
                                  }
                                )}
                              </React.Fragment>
                            ) : (
                              [
                                record.status === 2 || record.status === 4 ? (
                                  <Checkbox.Group>
                                    {record.request_provider[0].request_provider_milestones.map(
                                      (milestone, index) => {
                                        return (
                                          <div key={index}>
                                            <Checkbox
                                              indeterminate={
                                                milestone.status ? true : false
                                              }
                                              style={
                                                milestone.status
                                                  ? this.style
                                                  : null
                                              }
                                              value={milestone.id}
                                            >
                                              {milestone.request_milestone.name}
                                              <small>
                                                {milestone.status
                                                  ? " - " +
                                                    (index === 0
                                                      ? record.created_at_formatted
                                                      : milestone.updated_at_formatted)
                                                  : null}
                                              </small>
                                            </Checkbox>
                                          </div>
                                        );
                                      }
                                    )}
                                  </Checkbox.Group>
                                ) : record.status === 3 &&
                                  record.request_provider.length ? (
                                  <Checkbox.Group disabled={true}>
                                    {record.request_provider[0].request_provider_milestones.map(
                                      (milestone, index) => {
                                        return (
                                          <div>
                                            <Checkbox
                                              indeterminate={
                                                milestone.status ? true : false
                                              }
                                            >
                                              {milestone.request_milestone.name}
                                              <small>
                                                {milestone.status
                                                  ? " - " +
                                                    (index === 0
                                                      ? record.created_at_formatted
                                                      : milestone.updated_at_formatted)
                                                  : ""}
                                              </small>
                                            </Checkbox>
                                          </div>
                                        );
                                      }
                                    )}
                                  </Checkbox.Group>
                                ) : (
                                  "Request has been cancelled."
                                ),
                              ]
                            )}
                            {record.status === 1 ? (
                              <Button
                                className="btn btn-primary"
                                onClick={(e) => this.updateMilestone(e)}
                              >
                                Update
                              </Button>
                            ) : null}
                          </Form>
                        </div>
                      </div>
                    ) : null}

                    <React.Fragment>
                      {record.status !== 0 ? (
                        <div className="emergency-details-column col-12 col-sm-6"></div>
                      ) : null}

                      <div className="emergency-details-column col-12 col-sm-6">
                        <div className="document-uploader d-flex align-items-start justify-content-center flex-column">
                          <h6>Add Images</h6>
                          <div className="document-uploader-advisory">
                            <p>
                              Upload files in formats like{" "}
                              {allowedStrings.toUpperCase()}
                            </p>
                          </div>
                          <div className="d-flex">
                            <label className="document-action">
                              <input
                                type="file"
                                className="document-action-field"
                                accept={allowedStrings}
                                onChange={(event) => {
                                  this.handleFileSelection(event);
                                  event.target.value = null;
                                }}
                              />
                              <span className="document-action-text">
                                <FontAwesomeIcon icon={faFileUpload} /> Upload a
                                File
                              </span>
                            </label>
                          </div>
                        </div>
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

                            <button
                              type="button"
                              className="btn btn-secondary btn-notes"
                              onClick={() => this.updateNotes()}
                            >
                              <FontAwesomeIcon icon={faClipboard} /> Save Notes
                            </button>
                          </Form>
                        </div>

                        {record.status === 0 ||
                        record.status === 1 ||
                        record.status === 3 ? (
                          <div className="emergency-cancellation">
                            {record.status !== 3 ? (
                              <h6>Cancel Service Request</h6>
                            ) : null}
                            <Form id="emergencyCancellation">
                              <Form.Group controlId="emergencyCancellationReason">
                                <Form.Label>Reason for Cancellation</Form.Label>
                                <TextArea
                                  rows={4}
                                  maxLength="2500"
                                  id="emergencyCancellationReason"
                                  placeholder="Briefly explain the reason for service cancellation..."
                                  value={this.state.cancellation_reason}
                                  onChange={(e) =>
                                    this.setCancellationReason(e)
                                  }
                                  disabled={record.status === 3 ? true : false}
                                />
                              </Form.Group>
                              {record.status !== 3 ? (
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-cancel"
                                  onClick={() => this.confirmCancellation()}
                                >
                                  <FontAwesomeIcon
                                    icon={faExclamationTriangle}
                                  />{" "}
                                  Cancel Request
                                </button>
                              ) : null}
                            </Form>
                          </div>
                        ) : null}
                      </div>
                    </React.Fragment>
                  </div>
                  <div className="row chat-link-row chat-link-row">
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
                        <FontAwesomeIcon icon={faFileMedical} /> View Records
                      </a>
                    </div>
                    {record.status === 2 || record.status === 4 ? (
                      record.proof_exists ? (
                        <div className="col-6">
                          <div className="chat-link-name">
                            <h5>Service Request Proof</h5>
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
                        <div className="col-6">
                          <div className="chat-link-name">
                            <h5>Add Service Request Proof</h5>
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
                    ) : null}
                  </div>
                </div>
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
  getConciergeDetails,
  conciergeUpdate,
  conciergeUpdateProvider,
  serviceUpdate,
  serviceUpdateResponder,
  serviceUpdateMilestone,
  addFeedback,
  emergencyRespondersList,
  emergencyRespondersListType,
  updateNotes,
  fetchNearestRespondersList,
  conciergeImageUpload,
};

export default hasPermission(
  requireAuth(connect(mapStateToProps, mapDispatchToProps)(ViewConciergePage))
);

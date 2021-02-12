import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Button, Form, Image } from 'react-bootstrap';
import { Input, Checkbox, Modal, Select, notification } from 'antd';
import { updateResponderAvailibilty } from '../../actions/ResponderActions';
import {
  emergencyRespondersList,
  createMcxtraRequest,
} from '../../actions/EmergencyActions';
import { ROUTES } from '../../common/constants';
import {
  conciergeUpdate,
  conciergeUpdateProvider,
  serviceUpdate,
  serviceUpdateResponder,
  serviceUpdateMilestone,
  addFeedback,
  updateNotes,
} from '../../actions/ConciergeAction';
import {
  faClipboard,
  faComments,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import {
  providerList,
  addProvider,
  providerTypeList,
} from '../../actions/ProviderActions';
import requireAuth from '../../hoc/requireAuth';
import PageLoader from '../../components/PageLoader';
import RequestService from '../../service/RequestService';
import FileSelector from '../../components/FileSelector';

const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

// Handler for Exapanded Record Functions - Use API Reference https://ant.design/components/table/
class ExpandedRowRender extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: this.props.record.notes,
      providers: [],
      responders: [],
      request_id: null,
      provider_id: null,
      editButtonToggle: 0,
      milestone_uuid: null,
      updatesProviderId: null,
      showAddressFields: { display: 'none' },
      cancellation_reason: this.props.record.cancellation_reason
        ? this.props.record.cancellation_reason
        : null,
      name: null,
      last_name: null,
      mobile_number: null,
      type: null,
      location: null,
      loader: false,
      location_code: null,
      image_uuid: null,
      country_code: '91',
      countryCodesList: [],
      formatted_mobile_number: null,
      providerTypeListData: [],
      feedbackRatingValue: null,
      proofLoaded: false,
      proof: null,
      showProof: false,
      responderSearch: '',
    };
    this.autoComplete = null;
    this.cancellationReasonFlag = 0;
    this.style = {
      // color: 'maroon'
    };
    this.requestInterval = undefined;

    this.requestService = new RequestService();
  }

  componentDidMount() {
    this.getRespondersList();
    this.setState({ request_id: this.props.record.id });
    this.requestInterval = setInterval(() => {
      this.getRespondersList(this.state.page);
    }, 15000);
  }

  componentWillUnmount = async () => {
    await clearInterval(this.requestInterval);
  };

  componentWillReceiveProps = async (props) => {
    await this.setState({
      cancellation_reason:
        this.state.request_id === props.record.id
          ? this.state.cancellation_reason
          : null,
      request_id: props.record.id,
    });
  };

  getRespondersList = () => {
    // this.startLoader();

    const locationCode = _.get(
      this.props.record,
      'request_consumer.owner.location_code',
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

  setResponder = (provider_id) => {
    this.setState({
      provider_id,
    });
  };

  setUpdatedResponder = (provider_id) => {
    this.setState({ updatesProviderId: provider_id });
  };

  responderSearch = (search) => {
    this.setState({ responderSearch: search }, () => {
      this.getRespondersList();
    });
  };

  toggleEditButton = (e) => {
    if (!this.state.editButtonToggle) this.getRespondersList();
    this.setState({ editButtonToggle: !this.state.editButtonToggle });
  };

  updateProviderHandler = (e) => {
    if (
      !this.state.updatesProviderId ||
      this.state.updatesProviderId === 'VOID'
    )
      return this.props.onClick('Error', 'Please select a provider.', 0);

    let details = {
      provider_uuid: this.state.updatesProviderId,
      status: 1,
      service_request_id: this.props.record.id,
    };

    this.setState({ loader: true });
    this.props
      .conciergeUpdateProvider(details)
      .then((result) => {
        this.setState({
          editButtonToggle: !this.state.editButtonToggle,
          loader: false,
          updatesProviderId: null,
        });
        this.props.onClick('Success', 'Provider Updated Successfully.', 1);
        this.props.disableExpandRow();
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loader: false });
        this.props.onClick('Error', error.message, 0);
      });
  };

  setMilestoneIdHandler = async (e, status) => {
    await this.setState({ milestone_uuid: e.target.value });
    //console.log(e.target.value)
    confirm({
      title: 'Are you sure that you wish to perform this action?',
      okText: "Yes, I'm Sure",
      okType: 'danger',
      cancelText: 'No, Abort',
      centered: true,
      onOk: () => {
        this.updateMilestone(status);
        this.props.disableExpandRow();
      },
      onCancel() {
        return;
      },
    });
  };

  confirmCancellation = () => {
    confirm({
      title: 'Are you sure that you wish to perform this action?',
      okText: "Yes, I'm Sure",
      okType: 'danger',
      cancelText: 'No, Abort',
      centered: true,
      onOk: () => {
        this.cancelServiceHandler();
      },
      onCancel() {
        return;
      },
    });
  };

  updateMilestone = (milestoneStatus) => {
    let status = milestoneStatus ? 0 : 1;

    this.setState({ loader: true });

    this.props
      .serviceUpdateMilestone(
        this.state.request_id,
        this.state.milestone_uuid,
        status
      )
      .then((result) => {
        //console.log(result)
        this.setState({ loader: false });
        this.props.onClick('Success', 'Provider Milestone Updated.', 1);
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loader: false });
        this.props.onClick('Error', error.message, 0);
      });
  };

  setCancellationReason = (e) => {
    this.setState({ cancellation_reason: e.currentTarget.value });
  };

  setNotes = (e) => {
    this.setState({ note: e.currentTarget.value });
  };

  cancelServiceHandler = () => {
    this.props
      .serviceUpdate({
        status: 3,
        cancellation_reason: this.state.cancellation_reason,
        service_request_id: this.props.record.id,
      })
      .then((result) => {
        this.props.onClick(
          'Success',
          'Service Request Cancelled Successfully',
          1
        );
        this.setState({ editButtonToggle: 0 });
        this.props.disableExpandRow();
      })
      .catch((error) => {
        this.props.onClick('Error', error.message, 0);
      });
  };

  addProviderHandler = (e) => {
    e.preventDefault();
    let details = {
      provider_uuid: this.state.provider_id,
      status: 1,
      service_request_id: this.props.record.id,
    };

    if (!details.provider_uuid || details.provider_uuid === 'VOID')
      return this.props.onClick('Error', 'Please select a responder.', 0);

    this.setState({ loader: true });
    this.props
      .conciergeUpdate(details)
      .then((result) => {
        this.setState({ loader: false });
        this.props.onClick('Success', 'Provider Assigned Successfully.', 1);
        this.props.disableExpandRow();
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.props.onClick('Error', error.message, 0);
      });
  };

  setStateValues = (e, field) => {
    let value = e.currentTarget.value;
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);
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

  feedbackRating = (value) => {
    this.setState({
      feedbackRatingValue: value,
    });
  };

  checkRatingNumber = (starNum) => {
    if (starNum === this.props.record.rating) return true;
  };

  onSubmitFeedbackRating = () => {
    let details = {
      service_request_id: this.props.record.id,
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
        this.props.onClick('Success', 'Feedback Added Successfully.', 1);
        this.props.disableExpandRow();
        this.props.getConciergeList();
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loader: false });
        this.props.onClick('Error', error.message, 0);
      });
  };

  updateNotes = () => {
    let payload = {
      service_request_id: this.props.record.id,
      notes: this.state.note,
    };
    this.setState({
      loader: true,
    });
    this.props
      .updateNotes(payload)
      .then((data) => {
        this.setState({
          loader: false,
        });
        this.props.onClick('Success', 'Note Added Successfully.', 1);
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loader: false });
        this.props.onClick('Error', error.message, 0);
      });
  };

  startLoader = () => {
    this.setState({ loader: true });
  };

  stopLoader = () => {
    this.setState({ loader: false });
  };

  showProofHandler = () => {
    if (this.state.proofLoaded && this.state.proof) {
      this.setState({ showProof: !this.state.showProof });
    } else if (!this.state.proofLoaded) {
      this.startLoader();
      this.requestService
        .getRequestProof({
          type: 'Service',
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
              'Error',
              'Unable to fetch request media now.',
              0
            );
          }
        })
        .catch((error) => {
          this.stopLoader();
          this.openNotification('Error', 'Please try again later.', 0);
          return;
        });
    }
  };

  onFileSelection = (file) => {
    const payload = new FormData();
    payload.append('file', file);

    this.startLoader();
    this.requestService
      .addRequestMedia(payload)
      .then((result) => {
        this.openNotification('Success', 'File Uploaded Successfully.', 1);
        this.setState({ proof: result.data, loader: false });
      })
      .catch((error) => {
        this.stopLoader();
        this.openNotification('Error', 'Please try again.', 0);
      });
  };

  addRequestProof = () => {
    this.startLoader();
    this.requestService
      .addRequestProof({
        type: 'Service',
        request_id: this.state.request_id,
        image_id: this.state.proof.id,
      })
      .then((res) => {
        this.props.disableExpandRow();
        this.props.onClick(
          'Success',
          'Request Proof Uploaded Successfully.',
          1
        );
        this.setState({ proof: null, loader: false });
      })
      .catch((err) => {
        this.stopLoader();
        this.props.onClick('Error', 'Please try again.', 0);
      });
  };

  openResponderLocation = (geoLocation) => {
    const { lat, lng } = geoLocation;

    if (!lat || !lng) {
      return this.openNotification(
        'Error',
        'Location Coordinates are missing.',
        0
      );
    }

    window.open(`https://google.com/maps?q=${lat},${lng}`, '_blank');
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

      if (responder.location_code && responder.location_code !== '') {
        renderString += ` | ${responder.location_code}`;
      }
    }

    return renderString;
  };

  render() {
    return (
      <div className='concierge-details'>
        <div className='chat-link-row row'>
          <div className='col-6'>
            <div className='chat-link-name'>
              <h5>Chat With Elder</h5>
            </div>
            <Link
              to={`${ROUTES.SUPPORT}?id=${this.props.record.request_consumer.id}&name=${this.props.record.request_consumer.full_name}&mobile=${this.props.record.request_consumer.mobile_number}`}
              className='btn chat-link-btn'
              key={1}
            >
              <FontAwesomeIcon icon={faComments} /> Begin chat
            </Link>
          </div>
          {/* <div className='col-6'>
            <div className="chat-link-name" ><h5>User Medical Details</h5></div>
            <a href={`user/${this.props.record.request_consumer.id}/medical-record`} className='btn' target='_blank' ><FontAwesomeIcon icon={faFileMedical} /> Record</a>
          </div> */}
        </div>
        <div>
          {this.props.record.status === 4 || this.props.record.status === 2 ? (
            <div className='other-details-row row'>
              <div className='col-12'>
                <h5>Feedback:</h5>
              </div>
              <div className='col-6'>
                <div>
                  <fieldset
                    className='rating'
                    disabled={this.props.record.rating}
                  >
                    <input
                      onClick={() => {
                        this.feedbackRating(5);
                      }}
                      type='radio'
                      id={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star5'
                      }
                      name={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id
                      }
                      value='5'
                      checked={this.checkRatingNumber(5)}
                    />
                    <label
                      className='full'
                      htmlFor={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star5'
                      }
                    ></label>
                    <input
                      onClick={() => {
                        this.feedbackRating(4);
                      }}
                      type='radio'
                      id={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star4'
                      }
                      name={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id
                      }
                      value='4'
                      checked={this.checkRatingNumber(4)}
                    />
                    <label
                      className='full'
                      htmlFor={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star4'
                      }
                    ></label>
                    <input
                      onClick={() => {
                        this.feedbackRating(3);
                      }}
                      type='radio'
                      id={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star3'
                      }
                      name={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id
                      }
                      value='3'
                      checked={this.checkRatingNumber(3)}
                    />
                    <label
                      className='full'
                      htmlFor={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star3'
                      }
                    ></label>
                    <input
                      onClick={() => {
                        this.feedbackRating(2);
                      }}
                      type='radio'
                      id={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star2'
                      }
                      name={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id
                      }
                      value='2'
                      checked={this.checkRatingNumber(2)}
                    />
                    <label
                      className='full'
                      htmlFor={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star2'
                      }
                    ></label>
                    <input
                      onClick={() => {
                        this.feedbackRating(1);
                      }}
                      type='radio'
                      id={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star1'
                      }
                      name={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id
                      }
                      value='1'
                      checked={this.checkRatingNumber(1)}
                    />
                    <label
                      className='full'
                      htmlFor={
                        this.props.record.request_provider[0]
                          .request_provider_milestones[2].id + 'star1'
                      }
                    ></label>
                    <div>
                      <button
                        value='Submit'
                        className='btn btn-primary'
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
          ) : (
            ' '
          )}
        </div>

        {this.props.record.service === 'Other' &&
          (this.props.record.other_service_name ||
            this.props.record.other_service_time) && (
            <div className='other-details-row row'>
              <div className='col-12'>
                <h5>Other Service Details</h5>
              </div>
              <div className='col-6'>
                <div className='other-details-pod'>
                  <span className='other-details-name'>
                    What can we help you with?
                  </span>
                  <p>{this.props.record.other_service_name}</p>
                </div>
              </div>
              <div className='col-6'>
                <div className='other-details-pod'>
                  <span className='other-details-name'>
                    When do you need this service by?
                  </span>
                  <p>{this.props.record.other_service_time}</p>
                </div>
              </div>
            </div>
          )}

        {this.props.record.service !== 'Other' &&
          this.props.record.other_service_time && (
            <div className='other-details-row row'>
              <div className='col-12'>
                <h5>Service Schedule</h5>
              </div>

              <div className='col-6'>
                <div className='other-details-pod'>
                  <span className='other-details-name'>
                    When do you need this service by?
                  </span>
                  <p>{this.props.record.other_service_time}</p>
                </div>
              </div>
            </div>
          )}
        <div className='row'>
          <div className='concierge-details-column col-12 col-sm-6'>
            <div className='row'>
              <div className='col-12'>
                <div className='concierge-details-wrapper pb-0'>
                  <h5>
                    {this.props.record.status === 0
                      ? 'Step 1: Allocate a responder'
                      : 'Responder Details'}
                  </h5>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                {this.props.record.status === 0 ? (
                  <div className='concierge-details-wrapper pt-0'>
                    <Form className='map-responder-form'>
                      <Form.Group controlId='responderAllocated'>
                        <Select
                          showSearch
                          placeholder='Search for a responder'
                          optionFilterProp='children'
                          onChange={(value) => this.setResponder(value)}
                          onSearch={(value) => this.responderSearch(value)}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ minWidth: 300 }}
                        >
                          {!this.state.responders.length ? (
                            <Option disabled={true} value={''}>
                              No Responders Available
                            </Option>
                          ) : null}

                          {this.state.responders.map((responder, index) => {
                            return (
                              <Option key={index} value={responder.id}>
                                {this.getRenderableResponder(responder)}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Group>
                      <Button
                        className='btn btn-primary'
                        onClick={(e) => this.addProviderHandler(e)}
                        disabled={!this.state.provider_id}
                      >
                        Save
                      </Button>

                      <hr />
                    </Form>
                  </div>
                ) : (
                  [
                    <div className='concierge-details-wrapper pt-0'>
                      <div className='provider-contact d-flex align-items-center justify-content-start'>
                        <span className='provider-contact-param'>Name:</span>
                        <span className='provider-contact-value'>
                          {this.props.record.request_provider.length
                            ? this.props.record.request_provider[0]
                                .request_responder.full_name
                            : 'N/A'}
                        </span>
                      </div>
                      <div className='provider-contact d-flex align-items-center justify-content-start'>
                        <span className='provider-contact-param'>
                          Contact Number:
                        </span>
                        <span className='provider-contact-value'>
                          {this.props.record.request_provider.length
                            ? '+91' +
                              this.props.record.request_provider[0]
                                .request_responder.mobile_number
                            : 'N/A'}
                        </span>
                      </div>
                      {this.props.record.status === 1 ? (
                        <div className='provider-contact d-flex align-items-center justify-content-start'>
                          <span className='provider-contact-param'>
                            {!this.state.editButtonToggle ? (
                              <React.Fragment>
                                <Button
                                  className='btn btn-primary mx-auto'
                                  onClick={(e) => this.toggleEditButton(e)}
                                >
                                  Assign a new Responder
                                </Button>
                              </React.Fragment>
                            ) : (
                              <Button
                                className='btn btn-primary mx-auto'
                                onClick={(e) => this.toggleEditButton(e)}
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
                          <Form className='map-responder-form'>
                            <Form.Group controlId='responderAllocated'>
                              <Form.Label style={{ display: 'block' }}>
                                Map a new Responder
                              </Form.Label>
                              <Select
                                showSearch
                                placeholder='Search for a responder'
                                optionFilterProp='children'
                                onChange={(value) =>
                                  this.setUpdatedResponder(value)
                                }
                                onSearch={(value) =>
                                  this.responderSearch(value)
                                }
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                style={{ minWidth: 300 }}
                              >
                                {!this.state.responders.length ? (
                                  <Option disabled={true} value={''}>
                                    No Responders Available
                                  </Option>
                                ) : null}

                                {this.state.responders.map(
                                  (responder, index) => {
                                    return (
                                      <Option key={index} value={responder.id}>
                                        {this.getRenderableResponder(responder)}
                                      </Option>
                                    );
                                  }
                                )}
                              </Select>
                            </Form.Group>
                          </Form>
                          <div className='provider-contact d-flex align-items-center justify-content-start'>
                            <span className='provider-contact-param'>
                              <Button
                                className='btn btn-primary mx-auto'
                                onClick={(e) => this.updateProviderHandler(e)}
                              >
                                Update
                              </Button>
                            </span>
                          </div>
                          <hr />
                        </React.Fragment>
                      ) : null}
                    </div>,
                  ]
                )}
              </div>
            </div>
          </div>

          {this.props.record.status > 0 ? (
            <div className='concierge-details-column col-12 col-sm-6'>
              <div className='concierge-details-wrapper'>
                <h5>Step 2: Track the progress</h5>
                <Form className='track-responder-form'>
                  {this.props.record.status === 1 ? (
                    <React.Fragment>
                      {this.props.record.request_provider[0].request_provider_milestones.map(
                        (milestone, index) => {
                          if (index === 0 || index === 1)
                            return (
                              <React.Fragment>
                                <Checkbox
                                  checked={milestone.status ? true : false}
                                  style={milestone.status ? this.style : null}
                                  value={milestone.id}
                                >
                                  {milestone.request_milestone.name}
                                  <small>
                                    {milestone.status
                                      ? ' - ' +
                                        (index === 0
                                          ? this.props.record
                                              .created_at_formatted
                                          : milestone.updated_at_formatted)
                                      : ''}
                                  </small>
                                </Checkbox>
                              </React.Fragment>
                            );
                          else
                            return (
                              <React.Fragment>
                                <Checkbox
                                  checked={milestone.status ? true : false}
                                  onChange={(e, status) =>
                                    this.setMilestoneIdHandler(
                                      e,
                                      milestone.status
                                    )
                                  }
                                  style={milestone.status ? this.style : null}
                                  value={milestone.id}
                                >
                                  {milestone.request_milestone.name}
                                  <small>
                                    {milestone.status
                                      ? ' - ' + milestone.updated_at_formatted
                                      : ''}
                                  </small>
                                </Checkbox>
                              </React.Fragment>
                            );
                        }
                      )}
                    </React.Fragment>
                  ) : (
                    [
                      this.props.record.status === 2 ||
                      this.props.record.status === 4 ? (
                        <Checkbox.Group>
                          {this.props.record.request_provider[0].request_provider_milestones.map(
                            (milestone, index) => {
                              return (
                                <div>
                                  <Checkbox
                                    indeterminate={
                                      milestone.status ? true : false
                                    }
                                    style={milestone.status ? this.style : null}
                                    value={milestone.id}
                                  >
                                    {milestone.request_milestone.name}
                                    <small>
                                      {milestone.status
                                        ? ' - ' +
                                          (index === 0
                                            ? this.props.record
                                                .created_at_formatted
                                            : milestone.updated_at_formatted)
                                        : null}
                                    </small>
                                  </Checkbox>
                                </div>
                              );
                            }
                          )}
                        </Checkbox.Group>
                      ) : this.props.record.status === 3 &&
                        this.props.record.request_provider.length ? (
                        <Checkbox.Group disabled={true}>
                          {this.props.record.request_provider[0].request_provider_milestones.map(
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
                                        ? ' - ' +
                                          (index === 0
                                            ? this.props.record
                                                .created_at_formatted
                                            : milestone.updated_at_formatted)
                                        : ''}
                                    </small>
                                  </Checkbox>
                                </div>
                              );
                            }
                          )}
                        </Checkbox.Group>
                      ) : (
                        'Request has been cancelled.'
                      ),
                    ]
                  )}
                  {this.props.record.status === 1 ? (
                    <Button
                      className='btn btn-primary'
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
            {this.props.record.status !== 0 ? (
              <div className='concierge-details-column col-12 col-sm-6'></div>
            ) : null}
            <div className='concierge-details-column col-12 col-sm-6'>
              <div
                className='concierge-cancellation'
                style={
                  this.props.record.status === 0
                    ? {
                        marginTop: '16px',
                        paddingTop: '0px',
                        borderTop: '0px',
                      }
                    : undefined
                }
              >
                <h6> Add Notes</h6>
                <Form id='conciergeNotes'>
                  <Form.Group controlId='conciergeNoteDetails'>
                    <TextArea
                      rows={4}
                      id='conciergeNoteDetails'
                      placeholder='Add Note Here...'
                      maxLength='2500'
                      value={this.state.note}
                      onChange={(e) => this.setNotes(e)}
                    />
                    <Form.Label style={{ marginTop: 5 }}>
                      {this.props.record.notes_update_date_formatted
                        ? `Last Updated At: ` +
                          this.props.record.notes_update_date_formatted
                        : ''}
                    </Form.Label>
                  </Form.Group>
                  <Button
                    className='btn btn-secondary'
                    onClick={() => this.updateNotes()}
                  >
                    <FontAwesomeIcon icon={faClipboard} />
                    {this.props.record.notes ? ' Update Note' : ' Add Note'}
                  </Button>
                </Form>
              </div>
              {this.props.record.status === 0 ||
              this.props.record.status === 1 ||
              this.props.record.status === 3 ? (
                <div
                  className='concierge-cancellation'
                  style={
                    this.props.record.status === 0
                      ? {
                          marginTop: '16px',
                          paddingTop: '0px',
                          borderTop: '0px',
                        }
                      : undefined
                  }
                >
                  <hr />
                  {this.props.record.status !== 3 ? (
                    <h6>Cancel Concierge Request</h6>
                  ) : null}

                  <Form id='conciergeCancellation'>
                    <Form.Group controlId='conciergeCancellationReason'>
                      <Form.Label>Reason for Cancellation</Form.Label>
                      <TextArea
                        rows={4}
                        id='conciergeCancellationReason'
                        placeholder='Briefly explain the reason for concierge cancellation...'
                        maxLength='2500'
                        value={this.state.cancellation_reason}
                        onChange={(e) => this.setCancellationReason(e)}
                        disabled={this.props.record.status === 3 ? true : false}
                      />
                    </Form.Group>

                    {this.props.record.status !== 3 ? (
                      <Button
                        className='btn btn-secondary'
                        onClick={() => this.confirmCancellation()}
                      >
                        Cancel Concierge Request
                      </Button>
                    ) : null}
                  </Form>
                </div>
              ) : null}
            </div>
          </React.Fragment>

          {this.props.record.status === 2 || this.props.record.status === 4 ? (
            <div className='concierge-details-column col-12 col-sm-12 '>
              <div className='row chat-link-row chat-link-row'>
                {this.props.record.proof_exists ? (
                  <div className='col-6'>
                    <div className='chat-link-name'>
                      <h5>Service Request Proof</h5>
                    </div>
                    <button
                      onClick={this.showProofHandler}
                      type='button'
                      className='btn btn-chat'
                    >
                      {this.state.showProof ? 'Hide' : 'View'}
                    </button>
                    {this.state.showProof ? (
                      <React.Fragment>
                        <Image
                          onClick={() =>
                            window.open(this.state.proof.url, '_blank')
                          }
                          src={this.state.proof.url}
                          className='proof-image'
                        ></Image>
                        {this.state.proof.metadata &&
                        this.state.proof.metadata.geo_location ? (
                          <button
                            onClick={() =>
                              this.openResponderLocation(
                                this.state.proof.metadata.geo_location
                              )
                            }
                            type='button'
                            className='btn btn-chat'
                          >
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            Responder's Location
                          </button>
                        ) : null}
                      </React.Fragment>
                    ) : null}
                  </div>
                ) : (
                  <div className='col-6'>
                    <div className='chat-link-name'>
                      <h5>Add Service Request Proof</h5>
                    </div>
                    <FileSelector
                      openNotification={this.openNotification}
                      onSelection={this.onFileSelection}
                      maxFileSize={10000}
                      fileType='image'
                    />

                    {this.state.proof && this.state.proof.url ? (
                      <div>
                        <Image
                          onClick={() =>
                            window.open(this.state.proof.url, '_blank')
                          }
                          src={this.state.proof.url}
                          className='proof-image'
                        ></Image>
                        <button
                          onClick={this.addRequestProof}
                          type='button'
                          className='btn btn-chat'
                        >
                          Save
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {this.state.loader ? <PageLoader /> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default requireAuth(
  connect(mapStateToProps, {
    providerTypeList,
    conciergeUpdateProvider,
    addProvider,
    conciergeUpdate,
    providerList,
    emergencyRespondersList,
    serviceUpdate,
    serviceUpdateResponder,
    serviceUpdateMilestone,
    updateResponderAvailibilty,
    createMcxtraRequest,
    addFeedback,
    updateNotes,
  })(ExpandedRowRender)
);

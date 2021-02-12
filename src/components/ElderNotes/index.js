import React from "react";
import get from "lodash/get";
import { uniqBy } from "lodash";
import { Input, Empty, Modal } from "antd";
import { connect } from "react-redux";
import { Button, Form } from "react-bootstrap";
import {
  fetchElderNotes,
  addElderNote,
  editElderNote,
  deleteElderNote,
  resetExistingNotes,
} from "../../actions/ElderActions";
import { NOTESFILETYPES } from "../../common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faFileDownload,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { UPLOAD_NOTES_DOCUMENT } from "../../common/backendConstants";

import ElderNotesDataManager from "./dataManager";
import DocumentUploader from "../DocumentUploader";
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';
import styles from "./elder-notes.scss";

const { confirm } = Modal;

class ElderNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      currentPage: 0,
      edittingNote: "",
      isEditting: false,
      addedAttachments: [],
      isMoreAvailable: false,
      edittingAttachments: [],
      addUploaderKey: Date.now(),
      editUploaderKey: Date.now(),
      formData: {
        elderNote: "",
        healthStatus: "",
        callSource: "",
        callStatus: "",
        attachments: [],
        sleep_status: "",
        mood_of_the_elder: "",
        mental_status: "",
        physical_activities: "",
        fall: "",
      },
    };

    this.notesDataManager = new ElderNotesDataManager();
  }

  componentDidMount() {
    this.props.resetExistingNotes();
    this.getElderNotesData();
    this.getElderNotesDataTimeOut();
  }

  getElderNotesDataTimeOut = () => {
    this.props.startLoader();

    const { currentPage, searchText } = this.state;

    const dataPayload = {
      page: currentPage,
      search: searchText,
      elderIdentifier: this.props.currentElderIdentifier,
    };

    this.notesDataManager
      .getElderNotes(dataPayload)
      .then((responseData) => {
        this.props.stopLoader();

        // Store Data Inside Storage
        this.props.fetchElderNotes(responseData.data);

        if (
          (dataPayload.page + 1) * responseData.meta.pagination.perPage <
          responseData.meta.pagination.total
        ) {
          this.setState({
            isMoreAvailable: true,
          });
        } else {
          this.setState({
            isMoreAvailable: false,
          });
        }
      })
      .catch((errorData) => {
        this.props.stopLoader();
      });
  };

  getElderNotesData = () => {
    setInterval(() => this.getElderNotesDataTimeOut(), 120000);
  };

  handleEditNote = (currentNotesObject) => {
    if (
      currentNotesObject !== undefined &&
      currentNotesObject !== null &&
      typeof currentNotesObject === "object"
    ) {
      let currentEditAttachmentsArr = [];

      for (let item of currentNotesObject.attachments) {
        currentEditAttachmentsArr.push(item.id);
      }

      this.setState({
        isEditting: true,
        edittingNote: currentNotesObject.id,
        edittingAttachments: currentNotesObject.attachments,
        formData: {
          elderNote: currentNotesObject.note,
          healthStatus: currentNotesObject.health_status,
          callSource: currentNotesObject.call_source,
          callStatus: currentNotesObject.call_status,
          attachments: currentEditAttachmentsArr,
          sleep_status: currentNotesObject.sleep_status,
          mood_of_the_elder: currentNotesObject.mood_of_the_elder,
          mental_status: currentNotesObject.mental_status,
          physical_activities: currentNotesObject.physical_activities,
          fall: currentNotesObject.fall,
        },
      });
    }
  };

  handleDeleteConfirmation = (noteIdentifier) => {
    confirm({
      title: "Are you sure you wish to remove this note?",
      okType: "danger",
      okText: "Yes, Continue",
      cancelText: "No, Abort",
      centered: true,
      onOk: () => {
        this.handleDeleteNote(noteIdentifier);
      },
      onCancel() {
        return;
      },
    });
  };

  handleDeleteNote = (noteIdentifier) => {
    if (
      noteIdentifier !== undefined &&
      noteIdentifier !== null &&
      typeof noteIdentifier === "string"
    ) {
      const dataPayload = {
        noteIdentifier: noteIdentifier,
      };

      this.notesDataManager
        .deleteElderNote(dataPayload)
        .then((responseData) => {
          // Store Data Inside Storage
          this.props.deleteElderNote(dataPayload);

          this.clearNoteEditting();
        })
        .catch((errorData) => {
          console.log("UNABLE TO DELETE NOTE", errorData);
        });
    }
  };

  handleFieldUpdate = (fieldName, fieldValue) => {
    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        [`${fieldName}`]: fieldValue,
      },
    }));
  };

  handleAddNoteSubmit = () => {
    this.props.startLoader();

    const { formData } = this.state;

    if (formData.elderNote !== "") {
      const dataPayload = {
        note: formData.elderNote,
        user_id: this.props.currentElderIdentifier,
        health_status: formData.healthStatus,
        call_source: formData.callSource,
        call_status: formData.callStatus,
        attachments: formData.attachments,
        sleep_status: formData.sleep_status,
        mood_of_the_elder: formData.mood_of_the_elder,
        mental_status: formData.mental_status,
        physical_activities: formData.physical_activities,
        fall: formData.fall,
      };

      this.notesDataManager
        .addElderNote(dataPayload)
        .then((responseData) => {
          this.props.stopLoader();

          this.props.addElderNote(responseData.data);

          this.props.openNotification(
            "Success!",
            "Note was saved successfully.",
            1
          );

          this.clearNoteEditting();
        })
        .catch((errorData) => {
          console.log("UNABLE TO ADD NOTE", errorData);

          this.props.stopLoader();

          this.props.openNotification(
            "Error!",
            errorData.response.data.message,
            0
          );
        });
    } else {
      this.props.stopLoader();
      this.props.openNotification("Error!", "Notes cannot be empty.", 0);
    }
  };

  handleEditNoteSubmit = () => {
    const { formData } = this.state;

    if (formData.elderNote !== "") {
      this.props.startLoader();

      const dataPayload = {
        note: formData.elderNote,
        note_id: this.state.edittingNote,
        health_status: formData.healthStatus,
        call_source: formData.callSource,
        call_status: formData.callStatus,
        attachments: formData.attachments,
        sleep_status: formData.sleep_status,
        mood_of_the_elder: formData.mood_of_the_elder,
        mental_status: formData.mental_status,
        physical_activities: formData.physical_activities,
        fall: formData.fall,
      };

      this.notesDataManager
        .editElderNote(dataPayload)
        .then((responseData) => {
          this.props.stopLoader();

          this.props.editElderNote(responseData.data);

          this.props.openNotification(
            "Success!",
            "Note was updated successfully.",
            1
          );

          this.clearNoteEditting();
        })
        .catch((errorData) => {
          console.log("UNABLE TO EDIT NOTE", errorData);

          this.props.stopLoader();

          this.props.openNotification(
            "Error!",
            errorData.response.data.message,
            0
          );
        });
    } else {
      this.props.openNotification("Error!", "Notes cannot be empty.", 0);
    }
  };

  clearNoteEditting = () => {
    this.setState((state) => ({
      ...state,
      edittingNote: "",
      isEditting: false,
      addedAttachments: [],
      edittingAttachments: [],
      formData: {
        ...state.formData,
        elderNote: "",
        healthStatus: "",
        callSource: "",
        callStatus: "",
        attachments: [],
        sleep_status: "",
        mood_of_the_elder: "",
        mental_status: "",
        physical_activities: "",
        fall: "",
      },
    }));
  };

  handleLoadMore = () => {
    console.log('clicked');
    this.setState(
      (state) => ({
        ...state,
        currentPage: state.currentPage + 1,
      }),
      () => {
        this.getElderNotesDataTimeOut();
      }
    );
  };

  onKeyFormSubmission = (evt) => {
    if (evt.key === "Enter" && this.state.searchText) {
      evt.preventDefault();
      evt.stopPropagation();
      this.props.resetExistingNotes();
      this.getElderNotesData();
    }
  };

  handleNotesSearch = () => {
    this.props.resetExistingNotes();
    this.getElderNotesData();
  };

  handleAddNoteAttachment = (uploadedAttachmentObj) => {
    if (uploadedAttachmentObj && typeof uploadedAttachmentObj === "object") {
      let updatedAttachmentsArr = Object.assign(
        [],
        this.state.formData.attachments
      );
      updatedAttachmentsArr.push(uploadedAttachmentObj.id);

      let addedAttactmentArr = Object.assign([], this.state.addedAttachments);
      addedAttactmentArr.push(uploadedAttachmentObj);

      this.setState((state) => ({
        ...state,
        addedAttachments: addedAttactmentArr,
        formData: {
          ...state.formData,
          attachments: updatedAttachmentsArr,
        },
      }));
    }
  };

  handleEditAddNoteAttachment = (uploadedAttachmentObj) => {
    if (uploadedAttachmentObj && typeof uploadedAttachmentObj === "object") {
      let updatedAttachmentsArr = Object.assign(
        [],
        this.state.formData.attachments
      );
      updatedAttachmentsArr.push(uploadedAttachmentObj.id);

      let editAddAttachmentArr = Object.assign(
        [],
        this.state.edittingAttachments
      );
      editAddAttachmentArr.push(uploadedAttachmentObj);

      this.setState((state) => ({
        ...state,
        edittingAttachments: editAddAttachmentArr,
        formData: {
          ...state.formData,
          attachments: updatedAttachmentsArr,
        },
      }));
    }
  };

  handleEditRemoveAttachment = (attachmentIdentifier) => {
    if (attachmentIdentifier) {
      let updatedAttachmentArr = Object.assign(
        [],
        this.state.formData.attachments
      );
      updatedAttachmentArr = updatedAttachmentArr.filter((item, index) => {
        return item !== attachmentIdentifier;
      });

      let updatedEditAttachmentsArr = Object.assign(
        [],
        this.state.edittingAttachments
      );
      updatedEditAttachmentsArr = updatedEditAttachmentsArr.filter(
        (item, index) => {
          return item.id !== attachmentIdentifier;
        }
      );

      this.setState((state) => ({
        ...state,
        edittingAttachments: updatedEditAttachmentsArr,
        formData: {
          ...state.formData,
          attachments: updatedAttachmentArr,
        },
      }));
    }
  };

  render() {
    const { TextArea } = Input;
    const { elderNotes } = this.props;
    const {
      formData,
      isEditting,
      isMoreAvailable,
      addedAttachments,
      edittingAttachments,
    } = this.state;

    return (
      <div className="elder-notes" style={styles}>
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="elder-notes-left">
              <div className="elder-notes-header d-flex justify-content-between align-items-center">
                <h4>Notes</h4>

                <div className="global-search">
                  <Form.Group
                    className="position-relative"
                    controlId="searchNotes"
                  >
                    <Form.Control
                      name="searchNotes"
                      placeholder="Search for Notes"
                      value={this.state.searchText}
                      onKeyDown={(e) => this.onKeyFormSubmission(e)}
                      onChange={(e) =>
                        this.setState({ searchText: e.currentTarget.value })
                      }
                    />

                    <Button
                      type="button"
                      className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
                      onClick={() => this.handleNotesSearch()}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                  </Form.Group>
                </div>
              </div>

              {elderNotes !== undefined &&
              elderNotes !== null &&
              elderNotes.length !== 0 &&
              typeof elderNotes === "object" ? (
                <div className="elder-notes-list">
                  {uniqBy(elderNotes, "id").map((item, index) => {
                    return (
                      <div className="notes-pod" key={index}>
                        <div className="notes-pod-header d-flex align-items-start justify-content-between">
                          <div className="pod-left d-flex align-items-center justify-content-start">
                            <h6 className="pod-author">
                              {get(item, "admin_name", "N/A")}
                            </h6>
                            <span className="pod-created">
                              at {get(item, "updated_at", "N/A")} wrote
                            </span>
                          </div>
                          {get(item, "edited", false) !== false && (
                            <div className="pod-right">
                              <span className="pod-editted">Editted</span>
                            </div>
                          )}
                        </div>
                        <div className="notes-pod-content">
                          <p className="pod-content">
                            {get(item, "note", "No Content")}
                          </p>
                        </div>

                        {get(item, "attachments", []).length !== 0 && (
                          <div className="notes-pod-attachments">
                            <h6>Attachments</h6>

                            {get(item, "attachments", []).map(
                              (attachmentObj, attachmentIndex) => {
                                return (
                                  <div
                                    className="notes-attachment d-flex align-items-center justify-content-between"
                                    key={attachmentIndex}
                                  >
                                    <p>{attachmentObj.name}</p>

                                    <a
                                      download={true}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="button button-link"
                                      href={`${attachmentObj.webRoute}`}
                                    >
                                      <FontAwesomeIcon icon={faFileDownload} />
                                    </a>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}

                        <div className="notes-pod-footer d-flex align-items-center justify-content-between">
                          <div className="notes-pod-details">
                            <div className="notes-pod-health">
                              Health Status -{" "}
                              {item && item.health_status
                                ? get(item, "health_status", "N/A")
                                : "N/A"}
                            </div>
                            <div className="notes-pod-call-source">
                              Call Source -{" "}
                              {item && item.call_source
                                ? get(item, "call_source", "N/A")
                                : "N/A"}
                            </div>
                            <div className="notes-pod-call-status">
                              Call Status -{" "}
                              {item && item.call_status
                                ? get(item, "call_status", "N/A")
                                : "N/A"}
                            </div>

                            <div className="notes-pod-call-status">
                              Sleep Status -{" "}
                              {item && item.sleep_status
                                ? get(item, "sleep_status", "N/A")
                                : "N/A"}
                            </div>

                            <div className="notes-pod-call-status">
                              Mood of the elder -{" "}
                              {item && item.mood_of_the_elder
                                ? get(item, "mood_of_the_elder", "N/A")
                                : "N/A"}
                            </div>

                            <div className="notes-pod-call-status">
                              Mental Status -{" "}
                              {item && item.mental_status
                                ? get(item, "mental_status", "N/A")
                                : "N/A"}
                            </div>

                            <div className="notes-pod-call-status">
                              Physical Activities -{" "}
                              {item && item.physical_activities
                                ? get(item, "physical_activities", "N/A")
                                : "N/A"}
                            </div>

                            <div className="notes-pod-call-status">
                              Fall -{" "}
                              {item && item.fall
                                ? get(item, "fall", "N/A")
                                : "N/A"}
                            </div>
                          </div>

                          {get(item, "actionable", false) !== false && (
                            <div className="notes-pod-actions">
                              <button
                                type="button"
                                className="button button-link"
                                onClick={() => this.handleEditNote(item)}
                              >
                                Edit
                              </button>
                              {" | "}
                              <button
                                type="button"
                                className="button button-link"
                                onClick={() =>
                                  this.handleDeleteConfirmation(
                                    get(item, "id", null)
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty />
              )}
            </div>
            {isMoreAvailable && (
                    <div className="notes-load d-flex align-items-center justify-content-center">
                      <button
                        type="button"
                        className="button button-load"
                        onClick={() => this.handleLoadMore()}
                      >
                        Load More
                      </button>
                    </div>
                  )}
          </div>


          <div className="col-12 col-sm-6">
            <div className="elder-notes-right">
              {!isEditting ? (
                <div className="notes-add">
                  <h4>Add New Note</h4>

                  <Form.Group controlId="addElderNotes">
                    <Form.Label>Notes</Form.Label>

                    <TextArea
                      rows={4}
                      style={{ width: "100%" }}
                      placeholder="Type your notes here..."
                      value={formData.elderNote}
                      onChange={(event) =>
                        this.handleFieldUpdate("elderNote", event.target.value)
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="health_status">
                    <Form.Label>Health Status</Form.Label>

                    <Form.Control
                      as="select"
                      value={formData.healthStatus}
                      onChange={(e) =>
                        this.handleFieldUpdate("healthStatus", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Choose a Health Status
                      </option>
                      <option value="Feeling Well">Feeling Well</option>
                      <option value="Feeling Sick">Feeling Sick</option>
                      <option value="Hospitalized">Hospitalized</option>
                      <option value="Not Available">Not Available</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="sleep_status">
                    <Form.Label>
                      How was the elder’s sleep yesterday?
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.sleep_status}
                      onChange={(e) =>
                        this.handleFieldUpdate("sleep_status", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Choose a sleep status
                      </option>
                      <option value="Slept Well">Slept Well</option>
                      <option value="Disturbed sleep">Disturbed sleep</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="elder_mood">
                    <Form.Label>How is the elder’s mood?</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.mood_of_the_elder}
                      onChange={(e) =>
                        this.handleFieldUpdate(
                          "mood_of_the_elder",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled>
                        Choose a elder mood
                      </option>
                      <option value="Normal">Normal</option>
                      <option value="Happy">Happy</option>
                      <option value="Sad">Sad</option>
                      <option value="Frustrated">Frustrated</option>
                      <option value="Angry">Angry</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="mental_status">
                    <Form.Label>How is the elder’s mental state?</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.mental_status}
                      onChange={(e) =>
                        this.handleFieldUpdate("mental_status", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Choose a mental status
                      </option>
                      <option value="Alert">Alert</option>
                      <option value="Confused">Confused</option>
                      <option value="Forgetful">Forgetful</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="physical_activities">
                    <Form.Label>
                      What physical activity did elder do recently?
                    </Form.Label>
                    <TextArea
                      rows={4}
                      style={{ width: "100%" }}
                      placeholder="Type your Physical Activities..."
                      value={formData.physical_activities}
                      onChange={(event) =>
                        this.handleFieldUpdate(
                          "physical_activities",
                          event.target.value
                        )
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="fall">
                    <Form.Label>
                      Did elder have a fall or lose balance recently?
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.fall}
                      onChange={(e) =>
                        this.handleFieldUpdate("fall", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Choose a fall status
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="call_source">
                    <Form.Label>Call Source</Form.Label>

                    <Form.Control
                      as="select"
                      value={formData.callSource}
                      onChange={(e) =>
                        this.handleFieldUpdate("callSource", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Choose a Call Source
                      </option>
                      <option value="IVR Call">IVR Call</option>
                      <option value="WMS Video">WMS Video</option>
                      <option value="Whatsapp Video">Whatsapp Video</option>
                      <option value="Direct Call">Direct Call</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="call_status">
                    <Form.Label>Call status</Form.Label>

                    <Form.Control
                      as="select"
                      value={formData.callStatus}
                      onChange={(e) =>
                        this.handleFieldUpdate("callStatus", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Choose a Call status
                      </option>
                      <option value="Call completed">Call completed</option>
                      <option value="Call not connected">
                        Call not connected
                      </option>
                      <option value="Requested call back">
                        Requested call back
                      </option>
                    </Form.Control>
                  </Form.Group>

                  {addedAttachments.length !== 0 && (
                    <div className="existing-attachments">
                      {addedAttachments.map(
                        (attachmentItem, attachmentIndex) => {
                          return (
                            <div
                              className="existing-attachments-item d-flex align-items-center justify-content-between"
                              key={attachmentIndex}
                            >
                              <p className="existing-attachments-text">
                                {attachmentItem.name}
                              </p>

                              <button
                                type="button"
                                title="Remove"
                                className="existing-attachments-remove"
                                onClick={() =>
                                  this.handleEditRemoveAttachment(
                                    attachmentItem.id
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                  <DocumentUploader
                    uploadedFileType={10}
                    acceptedFileSize={20000}
                    acceptedTypes={NOTESFILETYPES}
                    key={this.state.addUploaderKey}
                    stopLoader={this.props.stopLoader}
                    startLoader={this.props.startLoader}
                    uploadDocumentAPI={UPLOAD_NOTES_DOCUMENT}
                    openNotification={this.props.openNotification}
                    acceptedTypesString={
                      "JPG, JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX"
                    }
                    uploadSuccessCallback={this.handleAddNoteAttachment}
                  />

                  <Button
                    className="btn btn-primary"
                    onClick={() => this.handleAddNoteSubmit()}
                  >
                    Save Note
                  </Button>
                </div>
              ) : (
                <div className="notes-edit">
                  <h4>Edit Note</h4>

                  <Form.Group controlId="editElderNotes">
                    <Form.Label>Notes</Form.Label>

                    <TextArea
                      rows={4}
                      style={{ width: "100%" }}
                      placeholder="Type your notes here..."
                      value={formData.elderNote}
                      onChange={(event) =>
                        this.handleFieldUpdate("elderNote", event.target.value)
                      }

                    />
                  </Form.Group>

                  <Form.Group controlId="health_status">
                    <Form.Label>Health Status</Form.Label>

                    <Form.Control
                      as="select"
                      value={formData.healthStatus}
                      onChange={(e) =>
                        this.handleFieldUpdate("healthStatus", e.target.value)
                      }

                    >
                      <option value="" disabled>
                        Choose a Health Status
                      </option>
                      <option value="Feeling Well">Feeling Well</option>
                      <option value="Feeling Sick">Feeling Sick</option>
                      <option value="Hospitalized">Hospitalized</option>
                      <option value="Not Available">Not Available</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="sleep_status">
                    <Form.Label>
                      How was the elder’s sleep yesterday?
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.sleep_status}
                      onChange={(e) =>
                        this.handleFieldUpdate("sleep_status", e.target.value)
                      }

                    >
                      <option value="" disabled>
                        Choose a sleep status
                      </option>
                      <option value="Slept Well">Slept Well</option>
                      <option value="Disturbed sleep">Disturbed sleep</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="elder_mood">
                    <Form.Label>How is the elder’s mood?</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.mood_of_the_elder}
                      onChange={(e) =>
                        this.handleFieldUpdate(
                          "mood_of_the_elder",
                          e.target.value
                        )
                      }

                    >
                      <option value="" disabled>
                        Choose a elder mood
                      </option>
                      <option value="Normal">Normal</option>
                      <option value="Happy">Happy</option>
                      <option value="Sad">Sad</option>
                      <option value="Frustrated">Frustrated</option>
                      <option value="Angry">Angry</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="mental_status">
                    <Form.Label>How is the elder’s mental state?</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.mental_status}
                      onChange={(e) =>
                        this.handleFieldUpdate("mental_status", e.target.value)
                      }

                    >
                      <option value="" disabled>
                        Choose a mental status
                      </option>
                      <option value="Alert">Alert</option>
                      <option value="Confused">Confused</option>
                      <option value="Forgetful">Forgetful</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="physical_activities">
                    <Form.Label>
                      What physical activity did elder do recently?
                    </Form.Label>
                    <TextArea
                      rows={4}
                      style={{ width: "100%" }}
                      placeholder="Type your Physical Activities..."
                      value={formData.physical_activities}
                      onChange={(event) =>
                        this.handleFieldUpdate(
                          "physical_activities",
                          event.target.value
                        )
                      }

                    />
                  </Form.Group>
                  <Form.Group controlId="fall">
                    <Form.Label>
                      Did elder have a fall or lose balance recently?
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.fall}
                      onChange={(e) =>
                        this.handleFieldUpdate("fall", e.target.value)
                      }

                    >
                      <option value="" disabled>
                        Choose a fall status
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  {edittingAttachments.length !== 0 && (
                    <div className="existing-attachments">
                      {edittingAttachments.map(
                        (attachmentItem, attachmentIndex) => {
                          return (
                            <div
                              className="existing-attachments-item d-flex align-items-center justify-content-between"
                              key={attachmentIndex}
                            >
                              <p className="existing-attachments-text">
                                {attachmentItem.name}
                              </p>

                              <button
                                type="button"
                                title="Remove"
                                className="existing-attachments-remove"
                                onClick={() =>
                                  this.handleEditRemoveAttachment(
                                    attachmentItem.id
                                  )
                                }

                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                  <Form.Group controlId="call_source">
                    <Form.Label>Call Source</Form.Label>

                    <Form.Control
                      as="select"
                      value={formData.callSource}
                      onChange={(e) =>
                        this.handleFieldUpdate("callSource", e.target.value)
                      }

                    >
                      <option value="" disabled>
                        Choose a Call Source
                      </option>
                      <option value="IVR Call">IVR Call</option>
                      <option value="WMS Video">WMS Video</option>
                      <option value="Whatsapp Video">Whatsapp Video</option>
                      <option value="Direct Call">Direct Call</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="call_status">
                    <Form.Label>Call status</Form.Label>

                    <Form.Control
                      as="select"
                      value={formData.callStatus}
                      onChange={(e) =>
                        this.handleFieldUpdate("callStatus", e.target.value)
                      }

                    >
                      <option value="" disabled>
                        Choose a Call status
                      </option>
                      <option value="Call completed">Call completed</option>
                      <option value="Call not connected">
                        Call not connected
                      </option>
                      <option value="Requested call back">
                        Requested call back
                      </option>
                    </Form.Control>
                  </Form.Group>

                  <DocumentUploader
                    uploadedFileType={10}
                    acceptedFileSize={20000}
                    acceptedTypes={NOTESFILETYPES}
                    key={this.state.editUploaderKey}
                    stopLoader={this.props.stopLoader}
                    startLoader={this.props.startLoader}
                    uploadDocumentAPI={UPLOAD_NOTES_DOCUMENT}
                    openNotification={this.props.openNotification}
                    acceptedTypesString={
                      "JPG, JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX"
                    }
                    uploadSuccessCallback={this.handleEditAddNoteAttachment}

                  />

                  <Button
                    className="btn btn-primary"
                    onClick={() => this.handleEditNoteSubmit()}

                  >
                    Save Note
                  </Button>
                  <Button
                    className="btn btn-secondary"
                    onClick={() => this.clearNoteEditting()}

                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this.props.resetExistingNotes();
  }
}

const mapStateToProps = (state) => ({
  elderNotes: state.elder.elderNotes,
});

const mapDispatchToProps = {
  addElderNote,
  editElderNote,
  fetchElderNotes,
  deleteElderNote,
  resetExistingNotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(ElderNotes);

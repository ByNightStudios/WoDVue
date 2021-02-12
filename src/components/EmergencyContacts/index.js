import React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import { connect } from 'react-redux';
import { Modal, Empty, DatePicker } from 'antd';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  addEmergencyContact,
  removeEmergencyContact,
  updateEmergencyContact,
} from '../../actions/ElderActions';
import { getCountryCodesList } from '../../actions/ConfigActions';
import PhoneNumber from '../PhoneNumber';
import ImageUploader from '../ImageUploader';
import EmergencyContactsManager from './dataManager';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';
import DefaultImage from '../../assets/images/icons/default.png';
import phoneNumbers from './phone.json';

const { confirm } = Modal;

class EmergencyContacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countryCodesList: [],
      relationshipsList: [],
      preloadedPhotoURL: null,
      isCurrentlyEditing: false,
      currentEditingObject: null,
      formData: {
        gender: '',
        photo: null,
        lastName: '',
        firstName: '',
        mobileNumber: '',
        relationship: '',
        countryCode: '91',
        dateOfBirth: null,
      },
      emergencyContactMobileNumber: '',
    };

    this.emergencyContactManager = new EmergencyContactsManager();
    this.renderRelationShipOptions = this.renderRelationShipOptions.bind(this);
    this.renderPhoneNumbers = this.renderPhoneNumbers.bind(this);
  }

  componentDidMount() {
    this.getCountryCodesList();
  }

  getCountryCodesList() {
    const include = 'relationships';

    this.props
      .getCountryCodesList(include)
      .then(result => {
        this.setState({
          countryCodesList: result.country_codes,
          relationshipsList: result.relationships,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleRemoveContact = contactIndentifier => {
    if (contactIndentifier !== null) {
      confirm({
        title: 'Are you sure you wish to remove this contact?',
        okType: 'danger',
        okText: 'Yes, Continue',
        cancelText: 'No, Abort',
        centered: true,
        onOk: () => {
          this.confirmRemoveContact(contactIndentifier);
        },
        onCancel() {},
      });
    } else {
    }
  };

  confirmRemoveContact = contactIndentifier => {
    if (contactIndentifier) {
      this.props.startLoader();

      const { emergencyContact } = this.props.elderdata.owner;

      this.emergencyContactManager
        .removeContact(emergencyContact, contactIndentifier)
        .then(responseData => {
          this.props.removeEmergencyContact(responseData);

          this.resetStateToDefault();

          this.props.stopLoader();

          this.props.openNotification(
            'Success',
            'Emergency Contact Deleted Successfully.',
            1,
          );

          console.log('RETURNED', responseData);
        })
        .catch(errorData => {
          this.props.stopLoader();

          console.log('RETURNED ERROR', errorData);
        });
    }
  };

  handleFieldUpdate = (fieldName, fieldValue) => {
    if (fieldName === 'dateOfBirth') {
      fieldValue = fieldValue
        ? moment(fieldValue._d).format('YYYY-MM-DD 00:00:00')
        : null;
    }

    this.setState(
      state => ({
        ...state,
        formData: {
          ...state.formData,
          mobileNumber: this.state.emergencyContactMobileNumber,
          [`${fieldName}`]: fieldValue,
        },
      }),
      () => console.log('STATE BECAME', this.state.formData),
    );
  };

  handleUploadedImage = imageIdentifier => {
    this.setState(state => ({
      ...state,
      formData: { ...state.formData, photo: imageIdentifier },
    }));
  };

  validateAddContact = () => {
    let isFormValid = true;
    const { formData } = this.state;

    Object.keys(formData).map((item, index) => {
      if (item === 'mobileNumber') {
        console.log(formData[item].length);
        if (formData[item].length < 8 || formData[item].length > 15) {
          return (isFormValid = false);
        }
      }

      if ((!formData[item] || formData[item] === '') && item !== 'photo') {
        return (isFormValid = false);
      }
    });

    return isFormValid;
  };

  handleAddContact = () => {
    this.props.startLoader();

    const isFormValid = this.validateAddContact();

    if (isFormValid) {
      // Form is Valid, Continue
      const { formData } = this.state;
      const { elderdata } = this.props;

      const dataPayload = {
        consumer_uuid: elderdata.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        mobile_number: formData.mobileNumber,
        gender: formData.gender,
        relationship: formData.relationship,
        country_code: formData.countryCode,
        image_uuid: formData.photo ? formData.photo : null,
        dob: formData.dateOfBirth,
      };

      this.emergencyContactManager
        .addContact(dataPayload)
        .then(responseData => {
          this.props.addEmergencyContact(responseData);

          this.resetStateToDefault();

          this.props.stopLoader();

          this.props.openNotification(
            'Success',
            'Emergency Contact Added Successfully.',
            1,
          );

          console.log('RESPONSE WAS', responseData);
        })
        .catch(errorData => {
          this.props.stopLoader();

          console.log('ERROR WAS', errorData);

          this.props.openNotification(
            'Error',
            errorData.response.data.message,
            0,
          );
        });
    } else {
      this.props.stopLoader();

      this.props.openNotification(
        'Error',
        'You have either missed a field or data is in incorrect format. Please check and try again.',
        0,
      );
    }
  };

  resetStateToDefault = () => {
    this.setState(state => ({
      ...state,
      preloadedPhotoURL: null,
      isCurrentlyEditing: false,
      currentEditingObject: null,
      formData: {
        photo: null,
        firstName: '',
        lastName: '',
        relationship: '',
        countryCode: '91',
        mobileNumber: '',
        gender: '',
        dateOfBirth: null,
      },
    }));
  };

  handleEditContact = contactObject => {
    if (contactObject) {
      this.setState(state => ({
        ...state,
        isCurrentlyEditing: true,
        currentEditingObject: contactObject,
        preloadedPhotoURL: contactObject.media,
        formData: {
          ...state.formData,
          firstName: contactObject.first_name,
          lastName: contactObject.last_name,
          relationship: contactObject.relationship_id,
          countryCode: contactObject.country_code,
          mobileNumber: contactObject.mobile_number,
          gender: contactObject.gender,
          dateOfBirth: contactObject.dob,
        },
        emergencyContactMobileNumber: contactObject.mobile_number,
      }));
    }
  };

  handleCancelEditContact = () => {
    this.resetStateToDefault();
  };

  handleUpdateContact = () => {
    this.props.startLoader();

    const isFormValid = this.validateAddContact();

    if (isFormValid) {
      // Form is Valid, Continue
      const { currentEditingObject, formData } = this.state;
      const { elderdata } = this.props;

      const dataPayload = {
        consumer_uuid: elderdata.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        mobile_number: formData.mobileNumber,
        gender: formData.gender,
        relationship: formData.relationship,
        country_code: formData.countryCode,
        image_uuid: formData.photo ? formData.photo : null,
        dob: formData.dateOfBirth,
      };

      this.emergencyContactManager
        .updateContact(currentEditingObject.id, dataPayload)
        .then(responseData => {
          this.props.updateEmergencyContact(responseData);

          this.resetStateToDefault();

          this.props.stopLoader();

          this.props.openNotification(
            'Success',
            'Emergency Contact Updated Successfully.',
            1,
          );
          console.log('RESPONSE WAS', responseData);
        })
        .catch(errorData => {
          this.props.stopLoader();

          console.log('ERROR WAS', errorData);

          this.props.openNotification(
            'Error',
            errorData.response.data.message,
            0,
          );
        });
    } else {
      this.props.stopLoader();

      this.props.openNotification(
        'Error',
        'You have either missed a field or data is in incorrect format. Please check and try again.',
        0,
      );
    }
  };

  renderRelationShipOptions(relationship, index) {
    if (relationship.label === 'Maid' || relationship.label === 'Society') {
      return null;
    }
    return (
      <option key={index} value={relationship.value}>
        {relationship.label}
      </option>
    );
  }

  renderPhoneNumbers(code, index) {
    const phoneNumberData = _.find(phoneNumbers, { dial_code: `+${code}` });
    return (
      <option key={index} value={code}>
        {phoneNumberData.dial_code}, {phoneNumberData.name}
      </option>
    );
  }

  render() {
    const { elderdata } = this.props;
    const {
      countryCodesList,
      relationshipsList,
      isCurrentlyEditing,
      currentEditingObject,
    } = this.state;

    return (
      <div className="elder-emergency">
        <div className="row">
          <div className="col-12 col-sm-5">
            <div className="emergency-display">
              <h4>Emergency Contacts</h4>

              {elderdata ? (
                elderdata.owner.emergencyContact.length !== 0 ? (
                  elderdata.owner.emergencyContact.map((item, index) => (
                    <div className="emergency-item" key={index}>
                      <div className="emergency-item-content d-flex align-items-center justify-content-start">
                        <div className="emergency-item-left">
                          <img
                            src={
                              _.get(item, 'media_exists', false)
                                ? _.get(item, 'media', DefaultImage)
                                : DefaultImage
                            }
                            className="emergency-item-image"
                            alt="Aayush Duta"
                          />
                        </div>

                        <div className="emergency-item-right">
                          <h6>{_.get(item, 'full_name', 'Unnamed Contact')}</h6>
                          <p>{_.get(item, 'relationship', 'N/A')}</p>

                            {`${item.mobile_number}`}
                        </div>
                      </div>

                      <div className="emergency-item-options d-flex align-items-center justify-content-start">
                        <Button
                          type="button"
                          className="btn btn-link"
                          onClick={() => this.handleEditContact(item)}
                          disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit Details
                        </Button>

                        <Button
                          type="button"
                          className="btn btn-link"
                          onClick={() =>
                            this.handleRemoveContact(_.get(item, 'id', null))
                          }
                          disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} /> Remove Member
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty />
                )
              ) : (
                <Empty />
              )}
            </div>
          </div>

          <div className="col-12 col-sm-7">
            {!isCurrentlyEditing && currentEditingObject === null ? (
              <div className="address-capture">
                <h4>Add Emergency Contact</h4>

                <div className="row">
                  <div className="col-12">
                    <Form.Group controlId="displayPictureAdd">
                      <Form.Label>Display Picture</Form.Label>

                      <ImageUploader
                        type="Media"
                        file_type="3"
                        owner_type="User"
                        uploadTitle="No Photo"
                        stopLoader={this.props.stopLoader}
                        startLoader={this.props.startLoader}
                        openNotification={this.props.openNotification}
                        onImageUpload={this.handleUploadedImage}
                        {...this.props}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="firstNameAdd">
                      <Form.Label>First Name *</Form.Label>

                      <Form.Control
                        type="text"
                        required
                        placeholder="Vikram"
                        value={this.state.formData.firstName}
                        onChange={event =>
                          this.handleFieldUpdate(
                            'firstName',
                            event.target.value,
                          )
                        }
                      />
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="lastNameAdd">
                      <Form.Label>Last Name *</Form.Label>

                      <Form.Control
                        type="text"
                        required
                        placeholder="Batra"
                        value={this.state.formData.lastName}
                        onChange={event =>
                          this.handleFieldUpdate('lastName', event.target.value)
                        }
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="relationshipAdd">
                      <Form.Label>Relationship *</Form.Label>

                      <Form.Control
                        as="select"
                        required
                        value={this.state.formData.relationship}
                        onChange={event =>
                          this.handleFieldUpdate(
                            'relationship',
                            event.target.value,
                          )
                        }
                        disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                      >
                        <option disabled value="">
                          Select a Relationship
                        </option>

                        {relationshipsList.map((relationship, index) =>
                          this.renderRelationShipOptions(relationship, index),
                        )}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="phone-wrapper">
                      <Form.Label>Contact Number *</Form.Label>

                      <div className="phone-wrapper-fields d-flex align-items-center justify-content-start">
                        <Form.Group controlId="countryCodeAdd">
                          <PhoneNumber
                            phoneNo={`${this.state.formData.mobileNumber}`}
                            onChange={(phoneNumber) => {
                              this.setState({ emergencyContactMobileNumber: _.join(_.split(phoneNumber, '-'),'')})
                            }
                            }
                            code='91'
                            disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="genderAdd">
                      <Form.Label>Gender *</Form.Label>

                      <Form.Control
                        as="select"
                        required
                        value={this.state.formData.gender}
                        onChange={event =>
                          this.handleFieldUpdate('gender', event.target.value)
                        }
                        disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                      >
                        <option disabled value="">
                          Select a Gender
                        </option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="elderDateOfBirth">
                      <Form.Label>Date of Birth</Form.Label>
                      <DatePicker
                        onChange={val =>
                          this.handleFieldUpdate('dateOfBirth', val)
                        }
                        disabledDate={date => date.isAfter(moment())}
                        disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleAddContact()}
                  disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="address-capture address-editor">
                <h4>Edit Emergency Contact</h4>

                <div className="row">
                  <div className="col-12">
                    <Form.Group controlId="displayPictureEdit">
                      <Form.Label>Display Picture</Form.Label>

                      <ImageUploader
                        type="Media"
                        file_type="3"
                        owner_type="User"
                        uploadTitle="No Photo"
                        stopLoader={this.props.stopLoader}
                        startLoader={this.props.startLoader}
                        image_url={this.state.preloadedPhotoURL}
                        openNotification={this.props.openNotification}
                        onImageUpload={this.handleUploadedImage}
                        {...this.props}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="firstNameEdit">
                      <Form.Label>First Name</Form.Label>

                      <Form.Control
                        type="text"
                        required
                        placeholder="Vikram"
                        value={this.state.formData.firstName}
                        onChange={event =>
                          this.handleFieldUpdate(
                            'firstName',
                            event.target.value,
                          )
                        }
                      />
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="lastNameEdit">
                      <Form.Label>Last Name</Form.Label>

                      <Form.Control
                        type="text"
                        required
                        value={this.state.formData.lastName}
                        placeholder="Batra"
                        onChange={event =>
                          this.handleFieldUpdate('lastName', event.target.value)
                        }
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="relationshipEdit">
                      <Form.Label>Relationship</Form.Label>

                      <Form.Control
                        as="select"
                        required
                        value={this.state.formData.relationship}
                        onChange={event =>
                          this.handleFieldUpdate(
                            'relationship',
                            event.target.value,
                          )
                        }
                        disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                      >
                        <option disabled value="">
                          Select a Relationship
                        </option>

                        {relationshipsList.map((relationship, index) => (
                          <option key={index} value={relationship.value}>
                            {relationship.label}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="phone-wrapper">
                      <Form.Label>Contact Number</Form.Label>

                      <div className="phone-wrapper-fields d-flex align-items-center justify-content-start">
                        {this.state.formData.mobileNumber}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="genderEdit">
                      <Form.Label>Gender</Form.Label>

                      <Form.Control
                        as="select"
                        required
                        value={this.state.formData.gender}
                        onChange={event =>
                          this.handleFieldUpdate('gender', event.target.value)
                        }
                        disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                      >
                        <option disabled value="">
                          Select a Gender
                        </option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="elderDateOfBirth">
                      <Form.Label>Date of Birth</Form.Label>
                      <DatePicker
                        value={
                          this.state.formData.dateOfBirth != null
                            ? moment(
                              this.state.formData.dateOfBirth,
                              'YYYY-MM-DD',
                            )
                            : null
                        }
                        onChange={val =>
                          this.handleFieldUpdate('dateOfBirth', val)
                        }
                        disabledDate={date => date.isAfter(moment())}
                        disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="address-editor-options d-flex align-items-center justify-content-start">
                  <Button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => this.handleUpdateContact()}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  >
                    Save
                  </Button>

                  <Button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => this.handleCancelEditContact()}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = state => ({
  elderdata: state.elder.elderData,
});

const mapDispatchToProps = {
  getCountryCodesList,
  removeEmergencyContact,
  addEmergencyContact,
  updateEmergencyContact,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmergencyContacts);

import React from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Empty, DatePicker, notification, Switch } from 'antd';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  addFamilyContact,
  removeFamilyContact,
  updateFamilyContact,
  addEmergencyContact,
  getElderData,
} from '../../actions/ElderActions';
import { getCountryCodesList } from '../../actions/ConfigActions';

import FamilyContactsManager from './dataManager';
import ElderDetailsDataManager from '../ElderDetails/dataManager';
import EmergencyContactsManager from '../EmergencyContacts/dataManager';

import ImageUploader from '../ImageUploader';

import DefaultImage from '../../assets/images/icons/default.png';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';

const { confirm } = Modal;

class FamilyMembers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countryCodesList: [],
      relationshipsList: [],
      medicalConditionsList: [],
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
        gender: '1',
        dateOfBirth: null,
        bloodGroup: '',
        allergies: [''],
        currentMedicalConditions: [''],
        consent_given: 'no',
      },
      disabled: false,
    };

    this.familyMemberManager = new FamilyContactsManager();
    this.emergencyContactManager = new EmergencyContactsManager();
    this.elderDetailsDataManager = new ElderDetailsDataManager();
    this.renderRelationShipOptions = this.renderRelationShipOptions.bind(this);
  }

  componentDidMount() {
    this.getCountryCodesList();
  }

  componentDidUpdate(prevProps, prevState) {}

  getCountryCodesList() {
    const include = 'relationships,medical_conditions';

    this.props
      .getCountryCodesList(include)
      .then(result => {
        this.setState({
          countryCodesList: result.country_codes,
          relationshipsList: result.relationships,
          medicalConditionsList: [...result.medical_conditions],
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

  handleAddToEmergancyContact = formData => {
    const { elderdata } = this.props;
    this.props.startLoader();
    const dataPayload = {
      consumer_uuid: elderdata.id,
      first_name: formData.details.first_name,
      last_name: formData.details.last_name,
      mobile_number: formData.details.mobile_number,
      gender: formData.details.gender,
      relationship: formData.relationship_id,
      country_code: formData.details.country_code,
      image_uuid: formData.photo ? formData.photo : null,
      dob: formData.details.userableConsumer.dob,
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
  };

  confirmRemoveContact = contactIndentifier => {
    if (contactIndentifier) {
      this.props.startLoader();

      this.familyMemberManager
        .removeContact(contactIndentifier)
        .then(responseData => {
          this.props.removeFamilyContact(responseData);

          this.resetStateToDefault();

          this.props.stopLoader();

          this.props.openNotification(
            'Success',
            'Family Member Deleted Succesfully.',
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
    const isFormValid = true;
    // const { formData } = this.state;
    // Object.keys(formData).map((item, index) => {
    //   if (
    //     (!formData[item] || formData[item] === '') &&
    //     item !== 'photo' &&
    //     item !== 'allergies' &&
    //     item !== 'currentMedicalConditions' &&
    //     item !== 'bloodGroup'
    //   ) {
    //     return (isFormValid = false);
    //   }
    // });

    return isFormValid;
  };

  validateEditContact = () => {
    const isFormValid = true;
    // const { formData } = this.state;
    // console.log('formData', formData);
    // Object.keys(formData).map((item, index) => {
    //   if (
    //     (!formData[item] || formData[item] === '') &&
    //     item !== 'photo' &&
    //     item !== 'allergies' &&
    //     item !== 'countryCode' &&
    //     item !== 'mobileNumber' &&
    //     item !== 'currentMedicalConditions' &&
    //     item !== 'bloodGroup'
    //   ) {
    //     return (isFormValid = false);
    //   }
    // });

    return isFormValid;
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

  handleAddContact = () => {
    const isFormValid = this.validateAddContact();
    // this.props.startLoader();
    // Mobile number validation
    const regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    const mobileRegex = /^[0-9]*$/;
    console.log(isFormValid, 'isFormValid');
    if (
      this.state.formData.mobileNumber === null ||
      this.state.formData.mobileNumber === ''
    ) {
      return this.openNotification('Error', 'Mobile number is required.', 0);
    }

    this.state.formData.mobileNumber = this.state.formData.mobileNumber.replace(
      /-/g,
      '',
    );

    if (!mobileRegex.test(this.state.formData.mobileNumber)) {
      return this.openNotification('Error', 'Mobile number is invalid.', 0);
    }

    const formatted_mobile_number = `+${this.state.formData.countryCode.replace(
      /-/g,
      '',
    )}${this.state.formData.mobileNumber}`;

    if (!regex.test(formatted_mobile_number))
      return this.openNotification('Error', 'Mobile number is invalid.', 0);

    if (isFormValid) {
      // Form is Valid, Continue
      const { formData } = this.state;
      const { elderdata } = this.props;

      const newCurrentMedicalConditionsArr = [];
      const currentMedicalConditionsArr = [
        ...new Set(formData.currentMedicalConditions),
      ];

      for (let index = 0; index < currentMedicalConditionsArr.length; index++) {
        newCurrentMedicalConditionsArr.push({
          inputValue: currentMedicalConditionsArr[index],
        });
      }

      const dataPayload = {
        user_type: 3,
        consumer_uuid: elderdata.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        mobile_number: formData.mobileNumber,
        gender: formData.gender,
        relationship: formData.relationship,
        country_code: formData.countryCode,
        blood_group: formData.bloodGroup,
        allergies: formData.allergies,
        dob: formData.dateOfBirth,
        current_medical_conditions: newCurrentMedicalConditionsArr,
        image_uuid: formData.photo ? formData.photo : null,
        consent_given: formData.consent_given,
      };

      this.familyMemberManager
        .addContact(dataPayload)
        .then(responseData => {
          this.props.addFamilyContact(responseData);

          this.resetStateToDefault();

          this.props.stopLoader();

          this.props.openNotification(
            'Success',
            'Family Member Added Succesfully.',
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
        gender: '1',
        dateOfBirth: null,
        bloodGroup: '',
        allergies: [''],
        currentMedicalConditions: [''],
        consent_given: 'no',
      },
    }));
    this.setState({
      disabled: false,
    });
  };

  getGenderMapping = value => {
    const stringIntMapping = {
      1: 1,
      2: 2,
      2: 2,
      1: 1,
    };
    return stringIntMapping[value];
  };

  handleEditContact = contactObject => {
    if (contactObject) {
      console.log('CURRENTLY EDITING', contactObject);

      const newCurrentMedicalConditionsArr = [];
      const currentMedicalConditionsArr =
        contactObject.details.userableConsumer.current_medical_conditions;
      for (let index = 0; index < currentMedicalConditionsArr.length; index++) {
        newCurrentMedicalConditionsArr.push(
          currentMedicalConditionsArr[index].inputValue,
        );
      }

      this.setState(state => ({
        ...state,
        isCurrentlyEditing: true,
        currentEditingObject: contactObject,
        preloadedPhotoURL: contactObject.details.media,
        formData: {
          ...state.formData,
          firstName: contactObject.details.first_name,
          lastName: contactObject.details.last_name,
          relationship: contactObject.relationship_id,
          gender: contactObject.details.gender,
          dateOfBirth: contactObject.details.userableConsumer.dob,
          bloodGroup: contactObject.details.userableConsumer.blood_group,
          allergies:
            contactObject.details.userableConsumer.allergies.length !== 0
              ? contactObject.details.userableConsumer.allergies
              : [''],
          currentMedicalConditions:
            newCurrentMedicalConditionsArr.length !== 0
              ? newCurrentMedicalConditionsArr
              : [''],
          consent_given: contactObject.consent_given,
        },
      }));
    }
  };

  handleCancelEditContact = () => {
    this.setState({
      isCurrentlyEditing: false,
      currentEditingObject: null,
    });
  };

  handleUpdateContact = () => {
    this.props.startLoader();

    const isFormValid = this.validateEditContact();

    if (isFormValid) {
      // Form is Valid, Continue
      const { currentEditingObject, formData } = this.state;
      const { elderdata } = this.props;

      const newCurrentMedicalConditionsArr = [];
      const currentMedicalConditionsArr = [
        ...new Set(formData.currentMedicalConditions),
      ];
      for (let index = 0; index < currentMedicalConditionsArr.length; index++) {
        newCurrentMedicalConditionsArr.push({
          inputValue: currentMedicalConditionsArr[index],
        });
      }

      const dataPayload = {
        user_type: 3,
        consumer_uuid: elderdata.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        relationship: formData.relationship,
        blood_group: formData.bloodGroup,
        allergies: formData.allergies,
        dob: formData.dateOfBirth,
        current_medical_conditions: newCurrentMedicalConditionsArr,
        image_uuid: formData.photo ? formData.photo : null,
        consent_given: formData.consent_given,
      };

      this.familyMemberManager
        .updateContact(currentEditingObject.id, dataPayload)
        .then(responseData => {
          this.props.updateFamilyContact(responseData);

          this.resetStateToDefault();

          this.props.stopLoader();

          this.props.openNotification(
            'Success',
            'Family Member Updated Succesfully.',
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

  handleAllergyUpdate = (index, fieldValue) => {
    const updatedAllergies = this.state.formData.allergies;
    updatedAllergies[index] = fieldValue;

    this.setState(
      state => ({
        ...state,
        formData: {
          ...state.formData,
          allergies: updatedAllergies,
        },
      }),
      () => console.log('STATE BECAME', this.state.formData),
    );
  };

  getGenderMapping = value => {
    const stringIntMapping = {
      1: 1,
      2: 2,
      2: 2,
      1: 1,
    };
    return stringIntMapping[value];
  };

  handleAddAllergyRow = () => {
    const updatedAllergies = this.state.formData.allergies;
    updatedAllergies.push('');

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        allergies: updatedAllergies,
      },
    }));
  };

  handleRemoveAllergyRow = removeIndex => {
    let updatedAllergies = this.state.formData.allergies;

    updatedAllergies = updatedAllergies.filter(
      (item, index) => index !== removeIndex,
    );

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        allergies: updatedAllergies,
      },
    }));
  };

  handleCMCUpdate = (index, fieldValue) => {
    const updatedCurrentMedicalConditions = this.state.formData
      .currentMedicalConditions;
    updatedCurrentMedicalConditions[index] = fieldValue;

    this.setState(
      state => ({
        ...state,
        formData: {
          ...state.formData,
          currentMedicalConditions: updatedCurrentMedicalConditions,
        },
      }),
      () => console.log('STATE BECAME', this.state.formData),
    );
  };

  handleAddCMCRow = () => {
    const updatedCurrentMedicalConditions = this.state.formData
      .currentMedicalConditions;
    updatedCurrentMedicalConditions.push('');

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        currentMedicalConditions: updatedCurrentMedicalConditions,
      },
    }));
  };

  handleRemoveCMCRow = removeIndex => {
    let updatedCurrentMedicalConditions = this.state.formData
      .currentMedicalConditions;

    updatedCurrentMedicalConditions = updatedCurrentMedicalConditions.filter(
      (item, index) => index !== removeIndex,
    );

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        currentMedicalConditions: updatedCurrentMedicalConditions,
      },
    }));
  };

  fillPopulatingDataFamilyMember = existingData => {
    const { first_name, last_name, gender, owner } = existingData;
    const { blood_group, allergies, current_medical_conditions, dob } = owner;
    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        firstName: first_name,
        lastName: last_name,
        gender,
        bloodGroup: blood_group,
        allergies: allergies.length > 0 ? allergies : [''],
        dateOfBirth: dob,
        currentMedicalConditions:
          current_medical_conditions.length > 0
            ? current_medical_conditions
            : [''],
      },
    }));
    this.setState({
      disabled: true,
    });
  };

  handlePrePopulateDataForFamilyMember = () => {
    const { mobileNumber } = this.state.formData;
    this.props.startLoader();
    this.familyMemberManager
      .prePopulateData(mobileNumber)
      .then(result => {
        if (result.data.length > 0) {
          const { full_name } = result.data[0];
          confirm({
            title: `We have found details related to ${mobileNumber} - ${full_name}. Do you want to fetch and fill it?`,
            okType: 'danger',
            okText: 'Yes, Continue',
            cancelText: 'No, Abort',
            centered: true,
            onOk: () => {
              this.fillPopulatingDataFamilyMember(result.data[0]);
            },
            onCancel: () => {
              this.resetStateToDefault();
            },
          });
        } else {
          this.openNotification(
            'Error',
            `No details are found with Phone Number ${mobileNumber}`,
          );
        }
        this.props.stopLoader();
      })
      .catch(error => {
        console.log(error);
        this.props.stopLoader();
      });
  };

  handleOnNokChange(e, item) {
    const payload = {
      is_nok: e ? '1' : '0',
    };

    this.familyMemberManager
      .addNokFamilyMember(item.id, payload)
      .then(response => {
        if (response) {
          this.openNotification('Success', `Nok has been updated`, 1);
          this.elderDetailsDataManager
            .getElderData({ id: this.props.currentElderIdentifier })
            .then(responseData => {
              if (responseData.data && responseData.data.length) {
                this.props.getElderData(responseData.data[0]);
              }
            });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.stopLoader();
      });
  }

  renderToggle(item) {
    if (
      _.get(item, 'relationship', 'N/A') === 'Son' ||
      _.get(item, 'relationship', 'N/A') === 'Daughter'
    ) {
      return (
        <Switch
          checkedChildren="Nok(yes)"
          unCheckedChildren="Nok(no)"
          checked={item.is_nok}
          onChange={e => this.handleOnNokChange(e, item)}
          disabled={checkIsErmOrErmSuperVisor(
            this.props.user,
            this.props.elderdata,
          )}
        />
      );
    }
    return null;
  }

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

  render() {
    const { elderdata } = this.props;
    const {
      countryCodesList,
      relationshipsList,
      isCurrentlyEditing,
      currentEditingObject,
    } = this.state;

    return (
      <div className="elder-family">
        <div className="row">
          <div className="col-12 col-sm-5">
            <div className="family-display">
              <h4>Family Members</h4>

              {elderdata ? (
                elderdata.user_relationships.length !== 0 ? (
                  elderdata.user_relationships.map((item, index) => (
                    <div className="family-item" key={index}>
                      <div className="family-item-content d-flex align-items-center justify-content-start">
                        <div className="family-item-left">
                          <img
                            src={
                              _.get(item.details, 'media_exists', false)
                                ? _.get(item.details, 'media', DefaultImage)
                                : DefaultImage
                            }
                            className="family-item-image"
                            alt="Aayush Dutta"
                          />
                        </div>

                        <div className="family-item-right">
                          <a
                            target="_blank"
                            href={`/elder/details/${_.get(item.details, 'id')}`}
                          >
                            <h6>
                              {_.get(
                                item.details,
                                'full_name',
                                'Unnamed Contact',
                              )}
                            </h6>
                          </a>
                          {/* <Link
                              to={`/elder/details/${_.get(item.details, 'id')}`}
                              title='View Details'
                              key={index}
                            ></Link> */}
                          <p>{_.get(item, 'relationship', 'N/A')}</p>
                          <p>{this.renderToggle(item)}</p>
                          <p>{`+${_.get(
                            item.details,
                            'country_code',
                            '91',
                          )}-${_.get(
                            item.details,
                            'mobile_number',
                            'N/A',
                          )}`}</p>
                        </div>
                      </div>

                      <div className="family-item-options d-flex align-items-center justify-content-start">
                        <Button
                          type="button"
                          className="btn btn-link"
                          onClick={() => this.handleEditContact(item)}
                          disabled={checkIsErmOrErmSuperVisor(
                            this.props.user,
                            this.props.elderdata,
                          )}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit Details
                        </Button>

                        <Button
                          type="button"
                          className="btn btn-link"
                          onClick={() =>
                            this.handleRemoveContact(_.get(item, 'id', null))
                          }
                          disabled={checkIsErmOrErmSuperVisor(
                            this.props.user,
                            this.props.elderdata,
                          )}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} /> Remove Member
                        </Button>
                        <Button
                          type="button"
                          className="btn btn-link"
                          onClick={() => this.handleAddToEmergancyContact(item)}
                          disabled={checkIsErmOrErmSuperVisor(
                            this.props.user,
                            this.props.elderdata,
                          )}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add to emergancy
                          contact
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
                <h4>Add Family Member</h4>

                <div className="row">
                  <div className="col-12">
                    <Form.Group controlId="displayPictureAdd">
                      <Form.Label>Display Picture</Form.Label>

                      <ImageUploader
                        type="Media"
                        file_type="2"
                        owner_type="User"
                        uploadTitle="No Photo"
                        stopLoader={this.props.stopLoader}
                        startLoader={this.props.startLoader}
                        openNotification={this.props.openNotification}
                        onImageUpload={this.handleUploadedImage}
                        userRole={this.props.userRole}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <div className="phone-wrapper">
                      <Form.Label>Contact Number</Form.Label>

                      <div className="phone-wrapper-fields d-flex align-items-center justify-content-start">
                        <Form.Group controlId="countryCodeAdd">
                          <Form.Control
                            as="select"
                            required
                            value={this.state.formData.countryCode}
                            onChange={event =>
                              this.handleFieldUpdate(
                                'countryCode',
                                event.target.value,
                              )
                            }
                          >
                            {countryCodesList.map((code, index) => (
                              <option key={index} value={code}>
                                +{code}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="mobileNumberAdd">
                          <Form.Control
                            type="number"
                            required
                            placeholder="98XXXXXXXX"
                            className="no-arrow"
                            value={this.state.formData.mobileNumber}
                            onChange={event =>
                              this.handleFieldUpdate(
                                'mobileNumber',
                                event.target.value,
                              )
                            }
                          />
                        </Form.Group>
                        {!this.state.disabled ? (
                          <Form.Group>
                            <Button
                              type="button"
                              className="btn btn-primary"
                              onClick={() =>
                                this.handlePrePopulateDataForFamilyMember()
                              }
                              disabled={checkIsErmOrErmSuperVisor(
                                this.props.user,
                                this.props.elderdata,
                              )}
                            >
                              Check
                            </Button>
                          </Form.Group>
                        ) : (
                          <Form.Group>
                            <Button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => this.resetStateToDefault()}
                              disabled={checkIsErmOrErmSuperVisor(
                                this.props.user,
                                this.props.elderdata,
                              )}
                            >
                              Reset
                            </Button>
                          </Form.Group>
                        )}
                      </div>
                    </div>
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
                    <Form.Group controlId="genderAdd">
                      <Form.Label>Gender *</Form.Label>

                      <Form.Control
                        as="select"
                        required
                        value={this.getGenderMapping(
                          this.state.formData.gender,
                        )}
                        onChange={event =>
                          this.handleFieldUpdate('gender', event.target.value)
                        }
                      >
                        <option disabled value="">
                          Select a Gender
                        </option>
                        <option value={1}>Male</option>
                        <option value={2}>Female</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="familyDateOfBirth">
                      <Form.Label>Date of Birth </Form.Label>
                      <DatePicker
                        value={
                          this.state.formData.dateOfBirth != null
                            ? moment(
                                this.state.formData.dateOfBirth,
                                'YYYY-MM-DD',
                              )
                            : null
                        }
                        onChange={value =>
                          this.handleFieldUpdate('dateOfBirth', value)
                        }
                        disabledDate={value => value.isAfter(moment())}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="relationshipAdd">
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
                    <Form.Group controlId="bloodGroupAdd">
                      <Form.Label>Blood Group</Form.Label>

                      <Form.Control
                        as="select"
                        value={this.state.formData.bloodGroup}
                        onChange={event =>
                          this.handleFieldUpdate(
                            'bloodGroup',
                            event.target.value,
                          )
                        }
                      >
                        <option disabled value="">
                          Select a Blood Group
                        </option>

                        <option value="A">A</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B">B</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB">AB</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O">O</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>Notification to NOK Consent Given</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={e =>
                          this.handleFieldUpdate(
                            'consent_given',
                            e.target.value,
                          )
                        }
                        value={this.state.formData.consent_given}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
                {/* <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <div className='multiparty-inputs'>
                      <Form.Label>Allergies</Form.Label>

                      {this.state.formData.allergies.map((item, index) => {
                        return (
                          <div
                            className='multiparty-inputs-row d-flex align-items-center justify-content-start'
                            key={index}
                          >
                            <Form.Group>
                              <Form.Control
                                type='text'
                                placeholder='Allergy'
                                value={item}
                                onChange={(event) =>
                                  this.handleAllergyUpdate(
                                    index,
                                    event.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            <Button
                              type='button'
                              className='btn btn-link'
                              disabled={
                                this.state.formData.allergies.length <= 1
                              }
                              onClick={() => this.handleRemoveAllergyRow(index)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </div>
                        );
                      })}

                      <Button
                        type='button'
                        className='btn btn-link'
                        onClick={() => this.handleAddAllergyRow()}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add Another
                      </Button>
                    </div>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <div className='multiparty-inputs'>
                      <Form.Label>Current Medical Conditions</Form.Label>

                      {this.state.formData.currentMedicalConditions.map(
                        (item, index) => {
                          return (
                            <div
                              className='multiparty-inputs-row d-flex align-items-center justify-content-start'
                              key={index}
                            >
                              <Form.Group>
                                <Form.Control
                                  as='select'
                                  value={item}
                                  onChange={(event) =>
                                    this.handleCMCUpdate(
                                      index,
                                      event.target.value
                                    )
                                  }
                                >
                                  <option value=''>
                                    Select a medical condition
                                  </option>
                                  {this.state.medicalConditionsList &&
                                    this.state.medicalConditionsList.length &&
                                    this.state.medicalConditionsList.map(
                                      (medicalCondition, index) => {
                                        return (
                                          <option
                                            value={medicalCondition.itemKey}
                                            key={index}
                                          >
                                            {medicalCondition.label}
                                          </option>
                                        );
                                      }
                                    )}
                                </Form.Control>
                              </Form.Group>

                              <Button
                                type='button'
                                className='btn btn-link'
                                disabled={
                                  this.state.formData.currentMedicalConditions
                                    .length <= 1
                                }
                                onClick={() => this.handleRemoveCMCRow(index)}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </Button>
                            </div>
                          );
                        }
                      )}

                      <Button
                        type='button'
                        className='btn btn-link'
                        onClick={() => this.handleAddCMCRow()}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add Another
                      </Button>
                    </div>
                  </div>
                </div> */}

                <Button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleAddContact()}
                  disabled={checkIsErmOrErmSuperVisor(
                    this.props.user,
                    this.props.elderdata,
                  )}
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="address-capture address-editor">
                <h4>Edit {`${this.state.formData.firstName}'s Details`}</h4>

                <div className="row">
                  <div className="col-12">
                    <Form.Group controlId="displayPictureAdd">
                      <Form.Label>Display Picture</Form.Label>

                      <ImageUploader
                        type="Media"
                        file_type="2"
                        owner_type="User"
                        uploadTitle="No Photo"
                        stopLoader={this.props.stopLoader}
                        startLoader={this.props.startLoader}
                        image_url={this.state.preloadedPhotoURL}
                        openNotification={this.props.openNotification}
                        onImageUpload={this.handleUploadedImage}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="firstNameAdd">
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
                    <Form.Group controlId="lastNameAdd">
                      <Form.Label>Last Name</Form.Label>

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
                    <Form.Group controlId="genderAdd">
                      <Form.Label>Gender</Form.Label>

                      <Form.Control
                        as="select"
                        required
                        value={this.state.formData.gender}
                        onChange={event =>
                          this.handleFieldUpdate('gender', event.target.value)
                        }
                      >
                        <option disabled value="">
                          Select a Gender
                        </option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="familyDateOfBirth">
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
                        onChange={value =>
                          this.handleFieldUpdate('dateOfBirth', value)
                        }
                        disabledDate={value => value.isAfter(moment())}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="bloodGroupAdd">
                      <Form.Label>Blood Group</Form.Label>

                      <Form.Control
                        as="select"
                        value={this.state.formData.bloodGroup}
                        onChange={event =>
                          this.handleFieldUpdate(
                            'bloodGroup',
                            event.target.value,
                          )
                        }
                      >
                        <option disabled value="">
                          Select a Blood Group
                        </option>

                        <option value="A">A</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B">B</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB">AB</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O">O</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <div className="multiparty-inputs">
                      <Form.Label>Allergies</Form.Label>

                      {this.state.formData.allergies.map((item, index) => (
                        <div
                          className="multiparty-inputs-row d-flex align-items-center justify-content-start"
                          key={index}
                        >
                          <Form.Group>
                            <Form.Control
                              type="text"
                              placeholder="Allergy"
                              value={item}
                              onChange={event =>
                                this.handleAllergyUpdate(
                                  index,
                                  event.target.value,
                                )
                              }
                            />
                          </Form.Group>

                          <Button
                            type="button"
                            className="btn btn-link"
                            disabled={this.state.formData.allergies.length <= 1}
                            onClick={() => this.handleRemoveAllergyRow(index)}
                            disabled={checkIsErmOrErmSuperVisor(
                              this.props.user,
                              this.props.elderdata,
                            )}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        className="btn btn-link"
                        onClick={() => this.handleAddAllergyRow()}
                        disabled={checkIsErmOrErmSuperVisor(
                          this.props.user,
                          this.props.elderdata,
                        )}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add Another
                      </Button>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="multiparty-inputs">
                      <Form.Label>Current Medical Conditions</Form.Label>

                      {this.state.formData.currentMedicalConditions.map(
                        (item, index) => (
                          <div
                            className="multiparty-inputs-row d-flex align-items-center justify-content-start"
                            key={index}
                          >
                            <Form.Group>
                              <Form.Control
                                as="select"
                                value={item}
                                onChange={event =>
                                  this.handleCMCUpdate(
                                    index,
                                    event.target.value,
                                  )
                                }
                              >
                                <option value="">
                                  Select a medical condition
                                </option>
                                {this.state.medicalConditionsList &&
                                  this.state.medicalConditionsList.length &&
                                  this.state.medicalConditionsList.map(
                                    (medicalCondition, index) => (
                                      <option
                                        value={medicalCondition.itemKey}
                                        key={index}
                                      >
                                        {medicalCondition.label}
                                      </option>
                                    ),
                                  )}
                              </Form.Control>
                            </Form.Group>

                            <Button
                              type="button"
                              className="btn btn-link"
                              disabled={
                                this.state.formData.currentMedicalConditions
                                  .length <= 1
                              }
                              onClick={() => this.handleRemoveCMCRow(index)}
                              disabled={checkIsErmOrErmSuperVisor(
                                this.props.user,
                                this.props.elderdata,
                              )}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </div>
                        ),
                      )}

                      <Button
                        type="button"
                        className="btn btn-link"
                        onClick={() => this.handleAddCMCRow()}
                        disabled={checkIsErmOrErmSuperVisor(
                          this.props.user,
                          this.props.elderdata,
                        )}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add Another
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group>
                      <Form.Label>Notification to NOK Consent Given</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={e =>
                          this.handleFieldUpdate(
                            'consent_given',
                            e.target.value,
                          )
                        }
                        value={this.state.formData.consent_given}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>

                <div className="address-editor-options d-flex align-items-center justify-content-start">
                  <Button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => this.handleUpdateContact()}
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      this.props.elderdata,
                    )}
                  >
                    Save
                  </Button>

                  <Button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => this.handleCancelEditContact()}
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      this.props.elderdata,
                    )}
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
  removeFamilyContact,
  addFamilyContact,
  updateFamilyContact,
  addEmergencyContact,
  getElderData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FamilyMembers);

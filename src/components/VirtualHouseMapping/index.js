import React from 'react';
import { get, isEqual, isArray, includes } from 'lodash';

import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import * as _ from 'lodash';
import {
  checkIsCCTeamOrCCHead,
  checkIsErmOrErmSuperVisor,
} from 'utils/checkElderEditPermission';
import { Checkbox, DatePicker } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { format } from 'highcharts';
import VirtualHouseMappingManager, {
  itemLabelMapping,
  selectionOptions,
} from './dataManager';
import styles from './virtual-house-mapping.scss';

class VirtualHouseMapping extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'virtual_house_mapping',
      emergencyHospitalization: '',
      emergencyHospitalizationAddress: '',
      hospitalContact: '',
      verified: [],
      verifyDate: null,

      formData: {
        police: [
          {
            phoneNumber: '',
            address: '',
            verified: [],
            verifyDate: null,
          },
        ],
        fireDepartment: [
          {
            phoneNumber: '',
            address: '',
            verified: [],
            verifyDate: null,
          },
        ],
        nearestHospitals: [
          {
            phoneNumber: '',
            address: '',
            verified: [],
            verifyDate: null,
            orgName: '',
            contactPersonName: '',
            contactPersonPhone: '',
            googleUrl: '',
            contactPersonAddress: '',
          },
        ],
        covidCenters: [
          {
            phoneNumber: '',
            address: '',
            verified: [],
            verifyDate: null,
            orgName: '',
            contactPersonName: '',
            contactPersonPhone: '',
            googleUrl: '',
            contactPersonAddress: '',
          },
        ],
        ambulanceProvider: [
          {
            phoneNumber: '',
            address: '',
            verified: [],
            verifyDate: null,
            orgName: '',
            contactPersonName: '',
            contactPersonPhone: '',
            googleUrl: '',
            contactPersonAddress: '',
          },
        ],
        chemist: [
          {
            phoneNumber: '',
            address: '',
            verified: [],
            verifyDate: null,
          },
        ],
        groceryStore: [
          {
            phoneNumber: '',
            address: '',
            verified: [],
            verifyDate: null,
            orgName: '',
            contactPersonName: '',
            contactPersonPhone: '',
            googleUrl: '',
            contactPersonAddress: '',
          },
        ],
      },
    };
    this.vhmDataManager = new VirtualHouseMappingManager();
    this.itemLabelMapping = itemLabelMapping;
  }

  checkbackwardCompatibilityOnFormData = formData => {
    Object.keys(formData).map((item, index) => {
      switch (item) {
        case 'police':
        case 'fireDepartment':
        case 'chemist':
          formData[item].map((element, inner_index) => {
            if (!element.hasOwnProperty('verified')) {
              formData[item][inner_index].verified = [];
            }
            if (!element.hasOwnProperty('verifyDate')) {
              formData[item][inner_index].verifyDate = null;
            }
          });
          break;
        case 'nearestHospitals':
        case 'covidCenters':
        case 'ambulanceProvider':
        case 'groceryStore':
          formData[item].map((element, inner_index) => {
            if (!element.hasOwnProperty('verified')) {
              formData[item][inner_index].verified = [];
            }
            if (!element.hasOwnProperty('verifyDate')) {
              formData[item][inner_index].verifyDate = null;
            }
            if (!element.hasOwnProperty('orgName')) {
              formData[item][inner_index].orgName = '';
            }
            if (!element.hasOwnProperty('contactPersonName')) {
              formData[item][inner_index].contactPersonName = '';
            }
            if (!element.hasOwnProperty('contactPersonPhone')) {
              formData[item][inner_index].contactPersonPhone = '';
            }
            if (!element.hasOwnProperty('googleUrl')) {
              formData[item][inner_index].googleUrl = '';
            }
            if (!element.hasOwnProperty('contactPersonAddress')) {
              formData[item][inner_index].contactPersonAddress = '';
            }
          });
      }
    });

    return formData;
  };

  componentDidMount() {
    if (this.props.formData !== null) {
      const formData = this.checkbackwardCompatibilityOnFormData(
        get(this.props, 'formData.formData', {}),
      );
      console.log(this.props);
      this.setState({
        formData,

        emergencyHospitalization: get(
          this.props,
          'formData.emergencyHospitalization',
        ),
        emergencyHospitalizationAddress: get(
          this.props,
          'formData.emergencyHospitalizationAddress',
        ),
        hospitalContact: get(this.props, 'formData.hospitalContact'),
        verified: get(this.props, 'formData.verified', []),
        verifyDate: get(this.props, 'formData.verifyDate', null),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.formData, this.props.formData)) {
      const formData = this.checkbackwardCompatibilityOnFormData(
        get(this.props, 'formData.formData', {}),
      );
      this.setState({
        formData,
        emergencyHospitalization: get(
          this.props,
          'formData.emergencyHospitalization',
        ),
        emergencyHospitalizationAddress: get(
          this.props,
          'formData.emergencyHospitalizationAddress',
        ),
        hospitalContact: get(this.props, 'formData.hospitalContact'),
        verified: get(this.props, 'formData.verified', []),
        verifyDate: get(this.props, 'formData.verifyDate', null),
      });
    }
  }

  setStateValues = (e, item, index, field) => {
    const formData = Object.assign({}, this.state.formData);

    switch (field) {
      case 'verified':
        formData[`${item}`][index][`${field}`] = e;
        if (!e.length) {
          formData[`${item}`][index].verifyDate = null;
        }
        break;
      case 'verifyDate':
        formData[`${item}`][index][`${field}`] = e
          ? moment(e._d).format('YYYY-MM-DD')
          : null;
        break;
      default:
        formData[`${item}`][index][`${field}`] = e.currentTarget.value;
    }
    // formData[`${item}`][index][`${field}`] = e.currentTarget.value;
    this.setState(state => ({
      ...state,
      formData,
    }));
  };

  handleCheckBoxValue = (e, item) => {
    let value = '';
    switch (item) {
      case 'verified':
        value = e;
        break;

      case 'verifyDate':
        value = e ? moment(e._d).format('YYYY-MM-DD') : '';
        break;
      default:
        value = e.target.value;
    }
    const state = Object.assign({}, this.state);
    this.setState(state => ({
      ...state,
      [item]: value,
    }));
  };

  handleStateValue = (e, item) => {
    this.setState({
      [item]: e.currentTarget.value,
    });
  };

  handleRemoveFormData = (key, indexToRemove) => {
    let currentFields = Object.assign([], this.state.formData[key]);
    currentFields = currentFields.filter(
      (item, index) => index !== indexToRemove,
    );
    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        [key]: currentFields,
      },
    }));
  };

  handleAddFormData = key => {
    const currentFields = Object.assign([], this.state.formData[key]);
    let label = '';
    const obj = {
      phoneNumber: '',
      address: '',
      verified: [],
      verifyDate: '',
      orgName: '',
      contactPersonName: '',
      contactPersonPhone: '',
      googleUrl: '',
      contactPersonAddress: '',
    };
    switch (key) {
      case 'nearestHospitals':
      case 'covidCenters':
      case 'ambulanceProvider':
      case 'groceryStore':
        label = obj;
        break;
      default:
        label = {
          phoneNumber: '',
          address: '',
          verified: [],
          verifyDate: null,
        };
    }

    currentFields.push(label);
    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        [key]: currentFields,
      },
    }));
  };

  submitData = () => {
    const {
      formData,
      type,
      emergencyHospitalization,
      emergencyHospitalizationAddress,
      hospitalContact,
      verified,
      verifyDate,
    } = this.state;
    console.log(formData);
    const { validate, label } = this.vhmDataManager.validateVirtualMappingData(
      formData,
    );

    if (!validate || (verified && verified.length && verifyDate === null)) {
      const value = this.itemLabelMapping[label];

      this.props.openNotification(
        'Error!',
        `Please fill the form correctly.
         For more than one selection please fill all the fields `,
        0,
      );
    } else {
      const finalPayload = {
        column: type,
        elder_id: this.props.currentElderIdentifier,
        data: {
          formData,
          emergencyHospitalization,
          emergencyHospitalizationAddress,
          hospitalContact,
          hospitalContact,
          verified,
          verifyDate,
        },
      };

      this.props.startLoader();

      this.vhmDataManager
        .updateElderFormData(finalPayload)
        .then(response => {
          this.props.stopLoader();
          this.props.openNotification(
            'Success!',
            `Form Fields Updated Successfully`,
            1,
          );
        })
        .catch(errorData => {
          this.props.stopLoader();
          this.props.openNotification(
            'Error!',
            errorData.response.data.message,
            0,
          );
        });
    }
  };

  render() {
    const { formData, verified, verifyDate } = this.state;
    const { itemLabelMapping } = this;

    return (
      <div className="elder-virtual" style={styles}>
        <h4>Virtual House Mapping </h4>
        <div className="replication-pod-item">
          <div className="replication-pod-fieldset d-flex align-items-center justify-content-start">
            <div className="replication-pod-item">Preferred Hospital</div>
            <div className="replication-pod-item">
              <Form.Group controlId="emergencyHospitalization">
                <Form.Control
                  type="text"
                  placeholder="Hospital Name"
                  value={get(this.state, 'emergencyHospitalization', '')}
                  onChange={e =>
                    this.handleStateValue(e, 'emergencyHospitalization')
                  }
                />
              </Form.Group>
            </div>
            <div className="replication-pod-item">
              <Form.Group controlId="hospitalContact">
                <Form.Control
                  type="text"
                  placeholder="Hospital contact"
                  value={get(this.state, 'hospitalContact', '')}
                  onChange={e => this.handleStateValue(e, 'hospitalContact')}
                />
              </Form.Group>
            </div>
            <div className="replication-pod-item">
              <Form.Group controlId="emergencyHospitalizationAddress">
                <Form.Control
                  type="text"
                  placeholder="Hospital Address"
                  value={get(this.state, 'emergencyHospitalizationAddress', '')}
                  onChange={e =>
                    this.handleStateValue(e, 'emergencyHospitalizationAddress')
                  }
                />
              </Form.Group>
            </div>
            <div className="replication-pod-item wrapper-checkbox">
              {
                <Checkbox.Group
                  options={get(selectionOptions, 'verified')}
                  value={verified}
                  onChange={e => this.handleCheckBoxValue(e, 'verified')}
                />
              }

              <Form.Group controlId="datepicker">
                {verified.length > 0 && (
                  <DatePicker
                    disabled={!verified.includes('Verified')}
                    placeholder="Select Date"
                    value={
                      !verified.includes('Verified')
                        ? ''
                        : verified && verifyDate
                        ? moment(verifyDate, 'YYYY-MM-DD')
                        : moment()
                    }
                    onChange={e => this.handleCheckBoxValue(e, 'verifyDate')}
                    disabledDate={d => d.isAfter(moment())}
                  />
                )}
              </Form.Group>
            </div>
          </div>
        </div>

        {formData &&
          Object.keys(formData).map((item, index) => (
            <div className="replication-pod" key={index}>
              {formData[item] &&
                formData[item].length !== 0 &&
                formData[item].map((inner_item, inner_index) => (
                  <div>
                    <div
                      className="replication-pod-fieldset d-flex align-items-center justify-content-start"
                      key={`${item} ${index} ${inner_index}`}
                    >
                      <div className="replication-pod-item">
                        {itemLabelMapping[item]} {inner_index + 1}
                      </div>

                      <div className="replication-pod-item">
                        <Form.Group
                          controlId={`phoneNumber ${item} ${inner_item} ${inner_index}`}
                        >
                          <Form.Control
                            type="tel"
                            className="no-arrow"
                            maxLength={15}
                            placeholder="Phone number"
                            value={get(inner_item, 'phoneNumber', '')}
                            onChange={e =>
                              this.setStateValues(
                                e,
                                item,
                                inner_index,
                                'phoneNumber',
                              )
                            }
                            disabled={checkIsCCTeamOrCCHead(
                              this.props.userRole,
                            )}
                          />
                        </Form.Group>
                      </div>

                      <div className="replication-pod-item">
                        <Form.Group
                          controlId={`address ${item} ${inner_item} ${inner_index}`}
                        >
                          <Form.Control
                            type="text"
                            placeholder="Address"
                            value={get(inner_item, 'address', '')}
                            onChange={e =>
                              this.setStateValues(
                                e,
                                item,
                                inner_index,
                                'address',
                              )
                            }
                            disabled={checkIsCCTeamOrCCHead(
                              this.props.userRole,
                            )}
                          />
                        </Form.Group>
                      </div>
                      <div className="replication-pod-item wrapper-checkbox">
                        <Form.Group
                          controlId={`verified ${item} ${inner_item} ${inner_index}`}
                        >
                          <div className="form-multicheck">
                            <Checkbox.Group
                              options={get(selectionOptions, 'verified')}
                              value={formData[item][inner_index].verified}
                              onChange={e =>
                                this.setStateValues(
                                  e,
                                  item,
                                  inner_index,
                                  'verified',
                                )
                              }
                              disabled={checkIsCCTeamOrCCHead(
                                this.props.userRole,
                              )}
                            />
                          </div>
                        </Form.Group>

                        <Form.Group
                          controlId={`verifyDate ${item} ${inner_item} ${inner_index}`}
                        >
                          <DatePicker
                            placeholder="Select Date"
                            disabled={
                              !get(inner_item, 'verified', []).includes(
                                'Verified',
                              )
                            }
                            value={
                              !get(inner_item, 'verified', []).includes(
                                'Verified',
                              )
                                ? null
                                : inner_item && inner_item.verifyDate
                                ? moment(inner_item.verifyDate, 'YYYY-MM-DD')
                                : moment()
                            }
                            onChange={e =>
                              this.setStateValues(
                                e,
                                item,
                                inner_index,
                                'verifyDate',
                              )
                            }
                            disabledDate={d => d.isAfter(moment())}
                            disabled={checkIsCCTeamOrCCHead(
                              this.props.userRole,
                            )}
                          />
                        </Form.Group>
                      </div>

                      <div className="replication-pod-item">
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={formData[item].length <= 1}
                          onClick={() =>
                            this.handleRemoveFormData(item, inner_index)
                          }
                          disabled={checkIsCCTeamOrCCHead(this.props.userRole)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </div>

                    <div className="replication-pod-fieldset d-flex align-items-center justify-content-start">
                      {inner_item && inner_item.hasOwnProperty('orgName') && (
                        <div className="replication-pod-item">
                          <Form.Group
                            controlId={`orgName ${item} ${inner_item} ${inner_index}`}
                          >
                            <Form.Control
                              type="text"
                              placeholder="Organization Name"
                              value={get(inner_item, 'orgName', '')}
                              onChange={e =>
                                this.setStateValues(
                                  e,
                                  item,
                                  inner_index,
                                  'orgName',
                                )
                              }
                              disabled={checkIsCCTeamOrCCHead(
                                this.props.userRole,
                              )}
                            />
                          </Form.Group>
                        </div>
                      )}
                      {inner_item &&
                        inner_item.hasOwnProperty('contactPersonName') && (
                          <div className="replication-pod-item">
                            <Form.Group
                              controlId={`contactPersonName ${item} ${inner_item} ${inner_index}`}
                            >
                              <Form.Control
                                type="text"
                                placeholder="Contact Person Name"
                                value={get(inner_item, 'contactPersonName', '')}
                                onChange={e =>
                                  this.setStateValues(
                                    e,
                                    item,
                                    inner_index,
                                    'contactPersonName',
                                  )
                                }
                                disabled={checkIsCCTeamOrCCHead(
                                  this.props.userRole,
                                )}
                              />
                            </Form.Group>
                          </div>
                        )}
                      {inner_item &&
                        inner_item.hasOwnProperty('contactPersonPhone') && (
                          <div className="replication-pod-item">
                            <Form.Group
                              controlId={`contactPersonPhone ${item} ${inner_item} ${inner_index}`}
                            >
                              <Form.Control
                                type="tel"
                                placeholder="Contact Person Phone"
                                maxLength={15}
                                value={get(
                                  inner_item,
                                  'contactPersonPhone',
                                  '',
                                )}
                                onChange={e =>
                                  this.setStateValues(
                                    e,
                                    item,
                                    inner_index,
                                    'contactPersonPhone',
                                  )
                                }
                                disabled={checkIsCCTeamOrCCHead(
                                  this.props.userRole,
                                )}
                              />
                            </Form.Group>
                          </div>
                        )}
                      {inner_item && inner_item.hasOwnProperty('googleUrl') && (
                        <div className="replication-pod-item">
                          <Form.Group
                            controlId={`googleUrl ${item} ${inner_item} ${inner_index}`}
                          >
                            <Form.Control
                              type="url"
                              placeholder="Google url"
                              value={get(inner_item, 'googleUrl', '')}
                              onChange={e =>
                                this.setStateValues(
                                  e,
                                  item,
                                  inner_index,
                                  'googleUrl',
                                )
                              }
                              disabled={checkIsCCTeamOrCCHead(
                                this.props.userRole,
                              )}
                            />
                          </Form.Group>
                        </div>
                      )}
                      {inner_item &&
                        inner_item.hasOwnProperty('contactPersonAddress') && (
                          <div className="replication-pod-item">
                            <Form.Group
                              controlId={`contactPersonAddress ${item} ${inner_item} ${inner_index}`}
                            >
                              <Form.Control
                                type="text"
                                placeholder="Contact Person Address"
                                value={get(
                                  inner_item,
                                  'contactPersonAddress',
                                  '',
                                )}
                                onChange={e =>
                                  this.setStateValues(
                                    e,
                                    item,
                                    inner_index,
                                    'contactPersonAddress',
                                  )
                                }
                                disabled={checkIsCCTeamOrCCHead(
                                  this.props.userRole,
                                )}
                              />
                            </Form.Group>
                          </div>
                        )}
                    </div>
                  </div>
                ))}

              <button
                type="button"
                className="btn btn-link"
                onClick={() => this.handleAddFormData(item)}
                disabled={checkIsCCTeamOrCCHead(this.props.userRole)}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Another
              </button>
            </div>
          ))}

        <Button
          type="button"
          className="btn btn-primary"
          onClick={event => this.submitData()}
          disabled={
            !includes(
              ['ERM', 'ERM Head', 'ERM Supervisors', 'C&C User', 'C&C Head'],
              get(this.props, 'user.roles[0]', ''),
            )
          }
        >
          Save
        </Button>
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VirtualHouseMapping);

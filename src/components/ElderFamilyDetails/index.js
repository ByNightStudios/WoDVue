import React from 'react';
import moment from 'moment';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { get, isEqual } from 'lodash';
import ElderFamilyDetailsManager, { itemLabelMapping } from './dataManager';
import styles from './elder-family-details.scss';
import { DatePicker } from 'antd';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';

class ElderFamilyDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'family_details',
      formData: {
        elder_kids_details: [
          {
            name: '',
            birthday: '',
            email_id: '',
          },
        ],
        elder_grand_kids_details: [
          {
            name: '',
            birthday: '',
            email_id: '',
          },
        ],
      },
    };

    this.ElderFamilyDetailsManager = new ElderFamilyDetailsManager();
    this.itemLabelMapping = itemLabelMapping;
  }

  componentDidMount() {
    if (this.props.formData !== null) {
      this.setState({
        formData: this.props.formData,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.formData, this.props.formData)) {
      this.setState({
        formData: this.props.formData,
      });
    }
  }

  setStateValues = (e, item, index, field) => {
    let formData = Object.assign({}, this.state.formData);
    let value = null;
    if (field === 'birthday') {
      if (e !== null) {
        value = moment(e._d).format('YYYY-MM-DD 00:00:00');
      } else {
        value = moment().format('YYYY-MM-DD 00:00:00');
      }
    } else {
      value = e.currentTarget.value;
    }

    formData[item][index][field] = value;
    this.setState((state) => ({
      ...state,
      formData: formData,
    }));
  };

  handleRemoveFormData = (key, indexToRemove) => {
    let currentFields = this.state.formData[key];
    currentFields = currentFields.filter((item, index) => {
      return index !== indexToRemove;
    });
    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        [key]: currentFields,
      },
    }));
  };

  handleAddFormData = (key) => {
    let currentFields = this.state.formData[key];
    currentFields.push({
      name: '',
      birthday: '',
      email_id: '',
    });
    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        [key]: currentFields,
      },
    }));
  };

  submitForm = () => {
    const { formData } = this.state;
    const { validate, label } = this.ElderFamilyDetailsManager.validate(
      formData
    );
    if (!validate) {
      const value = this.itemLabelMapping[label];
      this.props.openNotification(
        'Error!',
        `Please fill all the ${value} fields`,
        0
      );
    } else {
      const finalPayload = {
        column: this.state.type,
        elder_id: this.props.currentElderIdentifier,
        data: formData,
      };
      this.props.startLoader();
      this.ElderFamilyDetailsManager.updateElderFamilyDetailsData(finalPayload)
        .then((response) => {
          this.props.stopLoader();
          this.props.openNotification(
            'Success!',
            `Form Fields Updated Successfully`,
            1
          );
        })
        .catch((errorData) => {
          this.props.stopLoader();
          this.props.openNotification(
            'Error!',
            errorData.response.data.message,
            0
          );
        });
    }
  };

  render() {
    const { formData } = this.state;
    const itemLabelMapping = this.itemLabelMapping;

    return (
      <div className='elder-family' style={styles}>
        <h4>Family Details</h4>

        <div className='elder-family-form'>
          {formData &&
            Object.keys(formData).map((item, index) => {
              return (
                <div className='replication-pod' key={index}>
                  {formData[item] &&
                    formData[item].length !== 0 &&
                    formData[item].map((inner_item, inner_index) => {
                      return (
                        <div
                          className='replication-pod-fieldset d-flex align-items-center justify-content-start'
                          key={`${inner_index}`}
                        >
                          <div className='replication-pod-item'>
                            {itemLabelMapping[item]} {inner_index + 1}
                          </div>

                          <div className='replication-pod-item'>
                            <Form.Group
                              controlId={`name ${index} ${inner_index}`}
                            >
                              <Form.Control
                                type='text'
                                placeholder='Name'
                                value={get(inner_item, 'name', '')}
                                onChange={(e) =>
                                  this.setStateValues(
                                    e,
                                    item,
                                    inner_index,
                                    'name'
                                  )
                                }
                                disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                              />
                            </Form.Group>
                          </div>

                          <div className='replication-pod-item'>
                            <Form.Group
                              controlId={`birthday ${index} ${inner_index}`}
                            >
                              <DatePicker
                                placeholder='Date of Birth'
                                value={
                                  inner_item && inner_item.birthday
                                    ? moment(
                                        inner_item.birthday,
                                        'YYYY-MM-DD HH:mm A'
                                      )
                                    : null
                                }
                                onChange={(e) =>
                                  this.setStateValues(
                                    e,
                                    item,
                                    inner_index,
                                    'birthday'
                                  )
                                }
                                disabledDate={(value) =>
                                  value.isAfter(moment())
                                }
                                disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                              />
                            </Form.Group>
                          </div>

                          <div className='replication-pod-item'>
                            <Form.Group
                              controlId={`emailAddress ${index} ${inner_index}`}
                            >
                              <Form.Control
                                type='text'
                                placeholder='Email Id'
                                value={get(inner_item, 'email_id', '')}
                                onChange={(e) =>
                                  this.setStateValues(
                                    e,
                                    item,
                                    inner_index,
                                    'email_id'
                                  )
                                }
                                disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                              />
                            </Form.Group>
                          </div>

                          <div className='replication-pod-item'>
                            <button
                              type='button'
                              className='btn btn-link'
                              disabled={formData[item].length <= 1}
                              onClick={() =>
                                this.handleRemoveFormData(item, inner_index)
                              }
                              disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  <Button
                    type='button'
                    className='btn btn-link'
                    onClick={(event) => this.handleAddFormData(item)}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </div>
              );
            })}

          <Button
            type='button'
            className='btn btn-primary'
            onClick={(event) => this.submitForm()}
            disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  componentWillUnmount() {}
}

export default ElderFamilyDetails;

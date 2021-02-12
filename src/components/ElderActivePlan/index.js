import React from 'react';

import get from 'lodash/get';
import moment from 'moment';

import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { Select, DatePicker, Modal } from 'antd';

import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './elder-active-plan.scss';
import ElderActivePlanDataManager from './dataManager';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';

const { Option } = Select;
const { confirm } = Modal;

class ElderActivePlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plans: [],
      formData: {
        serviceInitiationDate: null,
        startDate: null,
        userID: null,
        planID: null,
        currency: 'INR',
        amount: '',
        duration: '',
      },
      planPage: 0,
      planSearch: '',
      userSearch: '',
      editingState: false,
    };

    this.elderActivePlanDataManager = new ElderActivePlanDataManager();
  }

  componentDidMount() {
    if (this.state.plans.length === 0) {
      this.getPlans();
    }
    setInterval(() => this.getPlans(), 120000);
  }

  getPlans = () => {
    const payload = {
      page: this.state.planPage,
      search: this.state.planSearch,
    };

    this.elderActivePlanDataManager
      .getPlans(payload)
      .then(result => {
        const plansData = [];
        if (result.data && result.data.length) {
          const { data } = result;

          for (const category of data) {
            if (category.plan && category.plan.length) {
              for (const plan of category.plan) {
                plan.category = category.category;
                plan.description =
                  plan.description && plan.description.length > 100
                    ? `${plan.description.substr(0, 100)}...`
                    : plan.description;
                plansData.push(plan);
              }
            }
          }
        }

        this.setState({ plans: plansData });
      })
      .catch(error => {
        this.props.openNotification(
          'Error',
          'Something went wrong while fetching plans',
          0,
        );
      });
  };

  formValidation = () => {
    const {
      serviceInitiationDate,
      duration,
      planID,
      amount,
      currency,
      startDate,
    } = this.state.formData;

    if (
      !duration ||
      !serviceInitiationDate ||
      !planID ||
      !amount ||
      !currency ||
      !startDate
    ) {
      this.props.openNotification('Error', 'All fields are required', 0);
      return false;
    }

    const digitRegex = /^[0-9]*$/;
    if (!digitRegex.test(duration)) {
      this.props.openNotification('Error', 'Duration must be an integer.', 0);
      return false;
    }

    if (duration < 1) {
      this.props.openNotification(
        'Error',
        'Duration must be greater than 0.',
        0,
      );
      return false;
    }

    return true;
  };

  setStateValues = (e, field) => {
    let value;
    const formData = Object.assign({}, this.state.formData);
    if (field === 'serviceInitiationDate' || field === 'startDate') {
      value = (e && e._d) || null;
    } else {
      value = e;
    }
    formData[`${field}`] = value;
    this.setState({ formData });
  };

  confirmAddUserPlan = () => {
    const isFormValid = this.formValidation();

    if (!isFormValid) return;

    confirm({
      title: 'Assigning a new plan will expire the exisiting plan. Continue?',
      okType: 'danger',
      okText: 'Yes, Continue',
      cancelText: 'No, Abort',
      centered: true,
      onOk: () => {
        this.addUserPlanHandler();
      },
      onCancel() {},
    });
  };

  addUserPlanHandler = () => {
    const payload = Object.assign({}, this.state.formData);

    payload.userID = this.props.currentElderIdentifier;

    this.props.startLoader();

    this.elderActivePlanDataManager
      .addElderPlan(payload)
      .then(res => {
        this.props.openNotification(
          'Success',
          'Plan has been successfully mapped.',
          1,
        );

        this.props.getElderPlans();

        this.resetState();
      })
      .catch(error => {
        this.props.stopLoader();

        const errorMessage = get(
          error,
          'response.data.message',
          'Something went wrong. Please try again in sometime.',
        );

        this.props.openNotification('Error', errorMessage, 0);
      });
  };

  resetState = () => {
    this.setState({
      planPage: 0,
      planSearch: '',
      userSearch: '',
      formData: {
        duration: '',
        serviceInitiationDate: null,
        startDate: null,
        userID: null,
        planID: null,
        currency: 'INR',
        amount: '',
      },
      editingState: false,
    });
  };

  toggleEditingState = () => {
    this.setState(
      state => ({
        ...state,
        editingState: !state.editingState,
      }),
      () => {
        if (this.state.editingState) {
          this.setState(state => ({
            ...state,
            formData: {
              ...state.formData,
              duration: get(this.props, 'activePlan.duration', 0),
              amount: get(this.props, 'activePlan.amount', 0),
            },
          }));
        }
      },
    );
  };

  initiateServiceFormValidation = () => {
    const { serviceInitiationDate, amount, duration } = this.state.formData;

    if (!serviceInitiationDate || !amount || !duration) {
      this.props.openNotification('Error', 'All fields are required.', 0);

      return false;
    }

    const digitRegex = /^[0-9]*$/;
    if (!digitRegex.test(duration)) {
      this.props.openNotification('Error', 'Duration must be an integer.', 0);
      return false;
    }

    if (duration < 1) {
      this.props.openNotification(
        'Error',
        'Duration must be greater than 0.',
        0,
      );
      return false;
    }

    return true;
  };

  initiateUserService = () => {
    const { serviceInitiationDate, amount, duration } = this.state.formData;

    const valid = this.initiateServiceFormValidation();

    if (!valid) {
      return;
    }

    this.props.startLoader();

    const { activePlan } = this.props;

    const payload = {
      amount,
      duration,
      serviceInitiationDate,
      userPlanID: activePlan.id,
    };

    this.elderActivePlanDataManager
      .initiateUserService(payload)
      .then(responseData => {
        this.props.openNotification(
          'Success',
          'Service has been successfully initiated.',
          1,
        );

        this.props.getElderPlans();

        this.resetState();
      })
      .catch(error => {
        this.props.stopLoader();

        const errorMessage = get(
          error,
          'response.data.message',
          'Something went wrong. Please try again in sometime.',
        );

        this.props.openNotification('Error', errorMessage, 0);
      });
  };

  render() {
    const { plans, formData, editingState } = this.state;
    const { activePlan, elderdata, elderData } = this.props;

    return (
      <div className="plans-activeplan" style={styles}>
        <div className="row">
          <div className="col-12 col-sm-5">
            <h4>Current Active Plan</h4>

            <div className="plans-activeplan-wrapper">
              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Status:</span>
                <span className="detail-item-value">
                  {activePlan
                    ? activePlan.status === '1'
                      ? 'Active'
                      : activePlan.status === '4'
                      ? 'On Hold'
                      : 'N/A'
                    : 'N/A'}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Source:</span>
                <span className="detail-item-value">
                  {(activePlan && activePlan.source) || 'N/A'}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Reference ID:</span>
                <span className="detail-item-value">
                  {get(activePlan, 'reference_id', 'N/A')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Order ID:</span>
                <span className="detail-item-value">
                  {get(activePlan, 'gateway_order_id', 'N/A')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Payment ID:</span>
                <span className="detail-item-value">
                  {get(activePlan, 'gateway_payment_id', 'N/A')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Plan Category:</span>
                <span className="detail-item-value">
                  {get(activePlan, 'category', 'N/A')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                {get(activePlan, 'source') !== 'Zoho' ? (
                  <span className="detail-item-param">App Plan Name:</span>
                ) : (
                  <span className="detail-item-param">Plan Name:</span>
                )}
                <span className="detail-item-value">
                  {get(activePlan, 'name', 'N/A')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">Amount:</span>
                <span className="detail-item-value">
                  {get(activePlan, 'currency', '')}{' '}
                  {get(activePlan, 'amount', 'N/A')}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                {get(activePlan, 'source') !== 'Zoho' ? (
                  <span className="detail-item-param">App Plan Duration:</span>
                ) : (
                  <span className="detail-item-param">Duration:</span>
                )}
                <span className="detail-item-value">
                  {activePlan && activePlan.duration
                    ? `${activePlan.duration} Days`
                    : 'N/A'}
                </span>
              </div>

              {get(activePlan, 'source') !== 'Zoho' && (
                <div className="detail-item d-flex align-items-center justify-content-start">
                  <span className="detail-item-param">App Start Date:</span>
                  <span className="detail-item-value">
                    {get(activePlan, 'created_at', 'N/A')}
                  </span>
                </div>
              )}

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">
                  Service Initiation Date:
                </span>
                <span className="detail-item-value">
                  {(activePlan && activePlan.service_initiation_date) || 'N/A'}
                </span>
              </div>

              <div className="detail-item d-flex align-items-center justify-content-start">
                <span className="detail-item-param">End Date:</span>
                <span className="detail-item-value">
                  {(activePlan && activePlan.expiry_date) || 'N/A'}
                </span>
              </div>

              {activePlan && activePlan.status === '4' && (
                <div className="detail-item d-flex align-items-center justify-content-start">
                  <Button
                    onClick={() => this.toggleEditingState()}
                    type="button"
                    className="btn btn-link"
                  >
                    <FontAwesomeIcon icon={faEdit} />{' '}
                    {!editingState ? 'Edit Details' : 'Cancel'}
                  </Button>
                </div>
              )}

              {get(activePlan, 'source') === 'Zoho' && (
                <>
                  {/* <h4>Zoho CRM Data</h4> */}

                  <div className="detail-item d-flex align-items-center justify-content-start">
                    <span className="detail-item-param">Customer Type:</span>
                    <span className="detail-item-value">
                      {(elderdata &&
                        elderdata.owner &&
                        elderdata.owner.customer_type) ||
                        'N/A'}
                    </span>
                  </div>

                  <div className="detail-item d-flex align-items-center justify-content-start">
                    <span className="detail-item-param">
                      Subscription Plan:
                    </span>
                    <span className="detail-item-value">
                      {(elderdata &&
                        elderdata.owner &&
                        elderdata.owner.product_package) ||
                        'N/A'}
                    </span>
                  </div>

                  <div className="detail-item d-flex align-items-center justify-content-start">
                    <span className="detail-item-param">Payment Status:</span>
                    <span className="detail-item-value">
                      {(elderdata &&
                        elderdata.owner &&
                        elderdata.owner.payment_status) ||
                        'N/A'}
                    </span>
                  </div>

                  <div className="detail-item d-flex align-items-center justify-content-start">
                    <span className="detail-item-param">Payment Source:</span>
                    <span className="detail-item-value">
                      {(elderdata &&
                        elderdata.owner &&
                        elderdata.owner.payment_source) ||
                        'N/A'}
                    </span>
                  </div>

                  <div className="detail-item d-flex align-items-center justify-content-start">
                    <span className="detail-item-param">
                      Sales Closure Date:
                    </span>
                    <span className="detail-item-value">
                      {elderdata &&
                      elderdata.zoho_object &&
                      elderdata.zoho_object.Created_Time
                        ? moment(elderdata.zoho_object.Created_Time).format(
                            'Do MMM, YYYY',
                          )
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="detail-item d-flex align-items-center justify-content-start">
                    <span className="detail-item-param">
                      Sales Closure Time:
                    </span>
                    <span className="detail-item-value">
                      {elderdata &&
                      elderdata.zoho_object &&
                      elderdata.zoho_object.Created_Time
                        ? moment(elderdata.zoho_object.Created_Time).format(
                            'hh:mm A',
                          )
                        : 'N/A'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {!editingState ? (
            <div className="col-12 col-sm-7">
              <h4>Assign New Plan</h4>

              <div className="form-container">
                <Form.Group controlId="communityEventCity">
                  <Form.Label>Select a plan</Form.Label>
                  <div className="form-select">
                    <Select
                      showSearch
                      placeholder="Select a plan"
                      onChange={e => this.setStateValues(e, 'planID')}
                      value={formData.planID}
                      style={{ minWidth: 300 }}
                      disabled={checkIsErmOrErmSuperVisor(
                        this.props.user,
                        elderData,
                      )}
                    >
                      <Option value={null} disabled>
                        Please select a plan
                      </Option>
                      {plans &&
                        plans.length !== 0 &&
                        plans.map((plan, index) => (
                          <Option key={index} value={plan.id}>
                            {plan.name}
                          </Option>
                        ))}
                    </Select>
                  </div>
                </Form.Group>

                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    showToday={false}
                    format="YYYY-MM-DD HH:mm"
                    onChange={e => this.setStateValues(e, 'startDate')}
                    value={
                      formData.startDate != null
                        ? moment(formData.startDate, 'YYYY-MM-DD HH:mm A')
                        : null
                    }
                    disabledDate={d => !d || d.isAfter(moment())}
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="serviceInitiationDate">
                  <Form.Label>Service Initiation Date</Form.Label>
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    showToday={false}
                    format="YYYY-MM-DD HH:mm"
                    onChange={e =>
                      this.setStateValues(e, 'serviceInitiationDate')
                    }
                    value={
                      formData.serviceInitiationDate != null
                        ? moment(
                            formData.serviceInitiationDate,
                            'YYYY-MM-DD HH:mm A',
                          )
                        : null
                    }
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="currency">
                  <Form.Label>Choose a Currency</Form.Label>

                  <div className="form-select">
                    <Select
                      value={formData.currency}
                      placeholder="Currency (INR)"
                      onChange={val => this.setStateValues(val, 'currency')}
                      style={{ minWidth: 300 }}
                      disabled={checkIsErmOrErmSuperVisor(
                        this.props.user,
                        elderData,
                      )}
                    >
                      <Select.Option key="1" value="INR">
                        INR
                      </Select.Option>
                      <Select.Option key="2" value="USD">
                        USD
                      </Select.Option>
                      <Select.Option key="2" value="GBP">
                        GBP
                      </Select.Option>
                      <Select.Option key="2" value="EUR">
                        EUR
                      </Select.Option>
                    </Select>
                  </div>
                </Form.Group>

                <Form.Group controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1000"
                    onChange={e =>
                      this.setStateValues(e.currentTarget.value, 'amount')
                    }
                    value={formData.amount}
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="duration">
                  <Form.Label>Duration (In Days)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="30"
                    onChange={e =>
                      this.setStateValues(e.currentTarget.value, 'duration')
                    }
                    value={formData.duration}
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <button
                  onClick={() => this.confirmAddUserPlan()}
                  className="btn btn-primary"
                  disabled={checkIsErmOrErmSuperVisor(
                    this.props.user,
                    elderData,
                  )}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="col-12 col-sm-7">
              <h4>Initiate User Service</h4>

              <div className="form-container">
                <Form.Group controlId="communityEventCity">
                  <Form.Label>Plan Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Plan Name"
                    disabled
                    value={get(activePlan, 'name', 'N/A')}
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Start Date"
                    disabled
                    value={get(activePlan, 'created_at', 'N/A')}
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="serviceInitiationDate">
                  <Form.Label>Service Initiation Date</Form.Label>
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    showToday={false}
                    format="YYYY-MM-DD HH:mm"
                    onChange={e =>
                      this.setStateValues(e, 'serviceInitiationDate')
                    }
                    value={
                      formData.serviceInitiationDate != null
                        ? moment(
                            formData.serviceInitiationDate,
                            'YYYY-MM-DD HH:mm A',
                          )
                        : null
                    }
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="currency">
                  <Form.Label>Choose a Currency</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Currency"
                    disabled
                    value={get(activePlan, 'currency', 'N/A')}
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Amount"
                    value={get(formData, 'amount')}
                    onChange={e =>
                      this.setStateValues(e.currentTarget.value, 'amount')
                    }
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="durationEditing">
                  <Form.Label>Duration (In Days)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Duration"
                    value={get(formData, 'duration')}
                    onChange={e =>
                      this.setStateValues(e.currentTarget.value, 'duration')
                    }
                    disabled={checkIsErmOrErmSuperVisor(
                      this.props.user,
                      elderData,
                    )}
                  />
                </Form.Group>

                <button
                  onClick={() => this.initiateUserService()}
                  className="btn btn-primary"
                  disabled={checkIsErmOrErmSuperVisor(
                    this.props.user,
                    elderData,
                  )}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  elderdata: state.elder.elderData,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ElderActivePlan);

import React from 'react';
import { Button, Form } from 'react-bootstrap';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import styles from './add-user-plan-page.scss';
import moment from 'moment';
import { notification, Select, DatePicker } from 'antd';
import { connect } from 'react-redux';
import requireAuth from '../../hoc/requireAuth';

import UserPlanManager from './dataManager';
import ElderService from '../../service/ElderService';
import hasPermission from '../../hoc/hasPermission';

const { Option } = Select;

class AddUserPlanPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      loader: false,
      users: [],
      plans: [],
      serviceInitiationDate: null,
      duration: null,
      startDate: null,
      userIDs: [],
      planID: null,
      planPage: 0,
      planSearch: '',
      userSearch: '',
      currency: 'INR',
      amount: '',
    };

    this.userPlanManager = new UserPlanManager();
    this.elderService = new ElderService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Add an Event';
    this.getPlans();
  }

  getPlans = () => {
    let payload = {
      page: this.state.planPage,
      search: this.state.planSearch,
    };

    this.userPlanManager
      .getPlans(payload)
      .then((result) => {
        let plansData = [];
        if (result.data && result.data.length) {
          let data = result.data;
          for (let category of data) {
            if (category.plan && category.plan.length) {
              for (let plan of category.plan) {
                plan['category'] = category.category;
                plan['description'] =
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
      .catch((error) => {
        this.stopLoader();
      });
  };

  startLoader = () => {
    this.setState({ loader: true });
  };

  stopLoader = () => {
    this.setState({ loader: false });
  };

  formValidation = () => {
    const {
      duration,
      serviceInitiationDate,
      planID,
      userIDs,
      amount,
      currency,
      startDate,
    } = this.state;

    if (
      !duration ||
      !serviceInitiationDate ||
      !planID ||
      !userIDs.length ||
      !amount ||
      !currency ||
      !startDate
    ) {
      this.openNotification('Error', 'All fields are mandatory.', 0);
      return false;
    }

    const digitRegex = /^[0-9]*$/;
    if (!digitRegex.test(duration)) {
      this.openNotification('Error', 'Duration must be an integer.', 0);
      return false;
    }

    if (duration < 1) {
      this.openNotification('Error', 'Duration must be greater than 0.', 0);
      return false;
    }

    return true;
  };

  setStateValues = (e, field) => {
    let state = this.state;
    state[`${field}`] = e;
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

  getUsers = (userSearch) => {
    this.elderService
      .getInactivePlanUsers(userSearch)
      .then((res) => {
        if (res.data && res.data.length) {
          this.setState({ users: res.data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addUserPlanHandler = () => {
    const formValid = this.formValidation();

    if (!formValid) {
      return;
    }

    this.startLoader();

    const {
      planID,
      userIDs,
      serviceInitiationDate,
      duration,
      currency,
      amount,
      startDate,
    } = this.state;
    const payload = {
      planID,
      userIDs,
      serviceInitiationDate,
      duration,
      currency,
      amount,
      startDate,
    };

    this.userPlanManager
      .adduserPlan(payload)
      .then((res) => {
        this.openNotification(
          'Success',
          'Plan has been successfully mapped to all the selected users.',
          1
        );
        this.setState({
          loader: false,
          users: [],
          plans: [],
          serviceInitiationDate: null,
          duration: null,
          startDate: null,
          userIDs: [],
          planID: null,
          planPage: 0,
          planSearch: '',
          userSearch: '',
          amount: '',
          currency: 'INR',
        });
      })
      .catch((error) => {
        this.stopLoader();
        this.openNotification(
          'Error',
          'Something went wrong. Please try again in sometime.',
          0
        );
      });
  };

  render() {
    const { navigationDeployed } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? 'addelders-page sidebar-page sidebar-page--open position-relative'
              : 'addelders-page sidebar-page sidebar-page--closed position-relative'
          }
          style={styles}
        >
          {navigationDeployed ? (
            <SideNavigation handleClose={this.handleNavigationToggle} />
          ) : (
            <Button
              type='button'
              className='btn btn-trigger'
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001"  />
            </Button>
          )}

          <main className='sidebar-page-wrapper position-relative'>
            <div className='internal-header'>
              <div className='internal-header-left'>
                <h2>Add Users Plan</h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-12 col-sm-8'>
                  <div className='form-container'>
                    <Form className='map-provider-form'>
                      <div className='row'>
                        <div className='col-12'>
                          <div className='row'>
                            <div className='col-sm-10'>
                              <Form.Group controlId='communityEventCity'>
                                <Form.Label>
                                  Please select multiple users
                                </Form.Label>
                                <Select
                                  showSearch
                                  mode='multiple'
                                  placeholder='select multiple users'
                                  onChange={(e) =>
                                    this.setStateValues(e, 'userIDs')
                                  }
                                  value={this.state.userIDs}
                                  onSearch={this.getUsers}
                                  defaultActiveFirstOption={false}
                                  filterOption={false}
                                  style={{ minWidth: 300 }}
                                >
                                  <Option value={''} disabled>
                                    Please select multiple users
                                  </Option>
                                  {this.state.users && this.state.users.length
                                    ? this.state.users.map((user, index) => (
                                        <Option key={index} value={user.id}>
                                          {`${user.full_name} (${user.mobile_number})`}
                                        </Option>
                                      ))
                                    : null}
                                </Select>
                              </Form.Group>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-sm-10'>
                              <Form.Group controlId='communityEventCity'>
                                <Form.Label>Select a plan</Form.Label>
                                <Select
                                  showSearch
                                  placeholder='select a plan'
                                  onChange={(e) =>
                                    this.setStateValues(e, 'planID')
                                  }
                                  value={this.state.planID}
                                  style={{ minWidth: 300 }}
                                >
                                  <Option value={null} disabled>
                                    Please select a plan
                                  </Option>
                                  {this.state.plans && this.state.plans.length
                                    ? this.state.plans.map((plan, index) => (
                                        <Option key={index} value={plan.id}>
                                          {plan.name}
                                        </Option>
                                      ))
                                    : null}
                                </Select>
                              </Form.Group>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-sm-10'>
                              <Form.Group controlId='startDate'>
                                <Form.Label>Start Date</Form.Label>
                                <DatePicker
                                  showTime={{ format: 'HH:mm' }}
                                  showToday={false}
                                  format={'YYYY-MM-DD HH:mm'}
                                  onChange={(e) =>
                                    this.setStateValues(e._d, 'startDate')
                                  }
                                  value={
                                    this.state.startDate != null
                                      ? moment(
                                          this.state.startDate,
                                          'YYYY-MM-DD HH:mm A'
                                        )
                                      : null
                                  }
                                  disabledDate={(d) =>
                                    !d || d.isAfter(moment())
                                  }
                                />
                              </Form.Group>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-sm-10'>
                              <Form.Group controlId='serviceInitiationDate'>
                                <Form.Label>Service Initiation Date</Form.Label>
                                <DatePicker
                                  showTime={{ format: 'HH:mm' }}
                                  showToday={false}
                                  format={'YYYY-MM-DD HH:mm'}
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e._d,
                                      'serviceInitiationDate'
                                    )
                                  }
                                  value={
                                    this.state.serviceInitiationDate != null
                                      ? moment(
                                          this.state.serviceInitiationDate,
                                          'YYYY-MM-DD HH:mm A'
                                        )
                                      : null
                                  }
                                />
                              </Form.Group>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-sm-10'>
                              <Form.Group controlId='currency'>
                                <Form.Label>Choose a Currency</Form.Label>

                                <Select
                                  value={this.state.currency}
                                  placeholder='Currency (INR)'
                                  onChange={(val) =>
                                    this.setStateValues(val, 'currency')
                                  }
                                  style={{ minWidth: 300 }}
                                >
                                  <Select.Option key='1' value='INR'>
                                    INR
                                  </Select.Option>
                                  <Select.Option key='2' value='USD'>
                                    USD
                                  </Select.Option>
                                  <Select.Option key='2' value='GBP'>
                                    GBP
                                  </Select.Option>
                                  <Select.Option key='2' value='EUR'>
                                    EUR
                                  </Select.Option>
                                </Select>
                              </Form.Group>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-sm-10'>
                              <Form.Group controlId='amount'>
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                  type='text'
                                  placeholder='1000'
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e.currentTarget.value,
                                      'amount'
                                    )
                                  }
                                  value={this.state.amount}
                                />
                              </Form.Group>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-sm-10'>
                              <Form.Group controlId='duration'>
                                <Form.Label>Duration (In Months)</Form.Label>
                                <Form.Control
                                  type='number'
                                  placeholder='3'
                                  onChange={(e) =>
                                    this.setStateValues(
                                      e.currentTarget.value,
                                      'duration'
                                    )
                                  }
                                  value={this.state.duration}
                                />
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={this.addUserPlanHandler}
                        className='btn btn-primary'
                      >
                        Save
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
  requireAuth(connect(mapStateToProps, {})(AddUserPlanPage))
);

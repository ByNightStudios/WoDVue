import React from 'react';
import moment from 'moment';

import { Button, Form } from 'react-bootstrap';
import {
  notification,
  Select,
  Checkbox,
  Tooltip,
  Button as AntdButton,
  Typography,
  Divider,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { getRenderingHeader } from '../../common/helpers';
import {
  emergencyCreate,
  consumerSearchList,
} from '../../actions/EmergencyActions';
import { consumerList } from '../../actions/ConsumerActions';

import requireAuth from '../../hoc/requireAuth';
import hasPermission from '../../hoc/hasPermission';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';

import styles from './add-emergency-page.scss';

const { Title } = Typography;

class AddEmergencyPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      consumers: [],
      consumer_number: '',
      consumer_dob: '',
      consumer_blood_group: '',
      consumer_uuid: '',
      consumer_country_code: '',
      loader: false,
      consumerFlag: false,
      searchFieldText: null,
      back_date_service: null,
      is_simulated: null,
      is_alarm: null,
      is_simulated_yes_checkbox: false,
      is_simulated_no_checkbox: false,
      is_alarm_yes_checkbox: false,
      is_alarm_no_checkbox: false,
    };
    this.renderGetPopupContainer = this.renderGetPopupContainer.bind(this);
    this.renderGetIsSimulatedContainer = this.renderGetIsSimulatedContainer.bind(
      this,
    );
  }

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  componentDidMount() {
    document.title = 'Emoha Admin | Create an emergency';
    // this.getConsumersList()
  }

  getConsumersList = async query => {
    let consumers = [];
    if (!query || query === '') {
      consumers = [];
      this.setState({ consumers });
      return;
    }
    await this.props.consumerSearchList(query, 1).then(result => {
      result.data.forEach((data, index) => {
        consumers.push(data);
      });
    });

    this.setState({ consumers });
  };

  userSearchHandler = value => {
    this.setState({ searchFieldText: value });
    this.getConsumersList(value);
  };

  disabledDate = current =>
    // Can not select days before today and today
    current && current > moment().endOf('day');

  setStateValues = (e, field) => {
    if (field === 'is_simulated') {
      this.setState({ is_simulated: !this.state.is_simulated }, () => {
        console.log(this.state.is_simulated);
      });
    } else if (field === 'back_date_service') {
      this.setState({
        back_date_service: e
          ? moment(e._d).format('YYYY-MM-DD HH:mm:ss')
          : null,
      });
    } else {
      // let index = e.target.selectedIndex
      // let consumer_number = e.target.childNodes[index].getAttribute('data-number')
      // let consumer_dob = e.target.childNodes[index].getAttribute('data-dob')
      // let consumer_blood_group = e.target.childNodes[index].getAttribute('data-blood-group')
      // let consumer_uuid = e.currentTarget.value
      // this.setState({consumer_number, consumer_dob, consumer_blood_group, consumer_uuid})
      const consumer = this.state.consumers.filter(consumer => {
        if (consumer.id === e) return consumer;
      });

      if (consumer) {
        const consumer_number = consumer[0].mobile_number;
        const consumer_dob = consumer[0].owner.dob_formatted;
        const consumer_blood_group = consumer[0].owner.blood_group;
        const consumer_country_code = consumer[0].country_code;
        const consumer_uuid = e;
        this.setState({
          consumer_number,
          consumer_dob,
          consumer_blood_group,
          consumer_uuid,
          consumer_country_code,
          consumerFlag: true,
        });
      }
    }
  };

  addEmergencyHandler = e => {
    if (!this.state.consumer_uuid)
      return this.openNotification('Error', 'Please select an elder', 0);
    this.setState({ loader: true });
    const body = {
      consumer_uuid: this.state.consumer_uuid,
    };
    if (this.state.back_date_service) {
      body.created_at = this.state.back_date_service;
    }
    if (this.state.is_alarm || !this.state.is_alarm) {
      body.is_alarm = this.state.is_alarm;
    }
    if (this.state.is_simulated || !this.state.is_simulated) {
      body.is_simulated = this.state.is_simulated;
    }


    this.props
      .emergencyCreate(body)
      .then(result => {
        this.setState({ loader: false });
        this.openNotification(
          'Success',
          'Emergency was successfully declared for this elder.',
          1,
        );
        this.props.history.push('/emergencies');
      })
      .catch(error => {
        this.setState({ loader: false });
        this.openNotification('Error', error.message, 0);
      });
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

  renderGetPopupContainer() {
    return (
      <div className="d-flex flex-column">
        <Title level={4} strong className="emergency-false-alaram-title">
          Set False Alarm
        </Title>
        <div className="d-flex flex-row">
          <AntdButton
            className="emergency-false-alaram-button"
            onClick={() => {
              this.setState({
                is_alarm: true,
                is_alarm_tooltip: false,
              });
            }}
          >
            Yes
          </AntdButton>
          <AntdButton
            className="emergency-false-alaram-button"
            onClick={() => {
              this.setState({
                is_alarm: false,
                is_alarm_tooltip: false,
              });
            }}
          >
            No
          </AntdButton>
        </div>
      </div>
    );
  }

  renderGetIsSimulatedContainer() {
    return (
      <div className="d-flex flex-column">
        <Title level={4} strong className="emergency-false-alaram-title">
          Set Simulation
        </Title>
        <div className="d-flex flex-row">
          <AntdButton
            className="emergency-false-alaram-button"
            onClick={() => {
              this.setState({
                is_simulated: true,
                is_simulated_tooltip: false,
              });
            }}
          >
            Yes
          </AntdButton>
          <AntdButton
            className="emergency-false-alaram-button"
            onClick={() => {
              this.setState({
                is_simulated: false,
                is_simulated_tooltip: false,
              });
            }}
          >
            No
          </AntdButton>
        </div>
      </div>
    );
  }

  handleOnChangeYesSimulator() {
    this.setState({
      is_simulated: true,
      is_simulated_no_checkbox: !this.state.is_simulated_no_checkbox,
    });
  }

  handleOnChangeNoSimulator() {
    this.setState({
      is_simulated: false,
      is_simulated_yes_checkbox: !this.state.is_simulated_yes_checkbox,
    });
  }

  handleOnChangeYesFalse() {
    this.setState({
      is_alarm: true,
      is_alarm_no_checkbox: !this.state.is_alarm_no_checkbox,
    });
  }

  handleOnChangeNoFalse() {
    this.setState({
      is_alarm: false,
      is_alarm_yes_checkbox: !this.state.is_alarm_yes_checkbox,
    });
  }

  render() {
    const { navigationDeployed } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? 'addemergency-page sidebar-page sidebar-page--open position-relative'
              : 'addemergency-page sidebar-page sidebar-page--closed position-relative'
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
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001" />
            </Button>
          )}

          <main className="sidebar-page-wrapper position-relative">
            <div className="internal-header">
              <div className="internal-header-left">
                <h2>Declare an Emergency</h2>
              </div>
            </div>
            <div className="internal-content">
              <div className="row">
                <div className="col-12 col-sm-8">
                  <div className="form-container">
                    <Form className="map-responder-form">
                      <div className="row">
                        <div className="col-12">
                          <p className="emergency-user-title">
                            Who has the emergency? Please choose a user from the
                            dropdown below:
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <Form.Group controlId="emergencyUser">
                            <Form.Label>Elder: </Form.Label>
                            <br />
                            <Select
                              showSearch
                              style={{ width: 300 }}
                              showArrow={false}
                              notFoundContent={
                                this.state.searchFieldText === '' ||
                                this.state.searchFieldText === null
                                  ? null
                                  : 'User not found'
                              }
                              defaultActiveFirstOption={false}
                              onSearch={value => this.userSearchHandler(value)}
                              onChange={e => this.setStateValues(e, 'elder')}
                              placeholder="Please search for an elder"
                              filterOption={false}
                            >
                              {this.state.consumers.map((consumer, index) => (
                                <Select.Option
                                  key={consumer.id}
                                  value={consumer.id}
                                  data-number={consumer.mobile_number}
                                  data-dob={consumer.owner.dob_formatted}
                                  data-blood-group={consumer.owner.blood_group}
                                  data-country_code={consumer.country_code}
                                >{`${consumer.full_name}  ${
                                    consumer.mobile_number
                                      ? `(${consumer.country_code}-${
                                        consumer.mobile_number
                                      })`
                                      : ''
                                  }`}</Select.Option>
                              ))}
                            </Select>
                          </Form.Group>
                          <div className="emergency-metadata d-flex align-items-center justify-content-start">
                            <span className="emergency-metadata-param">
                              Contact Number:
                            </span>
                            <span className="emergency-metadata-value">
                              {this.state.consumer_number
                                ? `+${this.state.consumer_country_code} - ${
                                  this.state.consumer_number
                                }`
                                : ''}
                            </span>
                          </div>
                          <div className="emergency-metadata d-flex align-items-center justify-content-start">
                            <span className="emergency-metadata-param">
                              Date of Birth:
                            </span>
                            <span className="emergency-metadata-value">
                              {this.state.consumer_dob}
                            </span>
                          </div>
                          <div className="emergency-metadata d-flex align-items-center justify-content-start">
                            <span className="emergency-metadata-param">
                              Blood Group:
                            </span>
                            <span className="emergency-metadata-value">
                              {this.state.consumer_blood_group}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <Form.Group controlId="conciergeUser">
                            Simulation (Create as a test emergency)
                            <br />
                            <Checkbox
                              onChange={() => this.handleOnChangeYesSimulator()}
                              disabled={this.state.is_simulated_yes_checkbox}
                            >
                              Yes
                            </Checkbox>
                            <Checkbox
                              onChange={() => this.handleOnChangeNoSimulator()}
                              disabled={this.state.is_simulated_no_checkbox}
                            >
                              No
                            </Checkbox>
                          </Form.Group>
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <Form.Group controlId="conciergeUser">
                            False Alarm
                            <br />
                            <Checkbox
                              onChange={() => this.handleOnChangeYesFalse()}
                              disabled={this.state.is_alarm_yes_checkbox}
                            >
                              Yes
                            </Checkbox>
                            <Checkbox
                              onChange={() => this.handleOnChangeNoFalse()}
                              disabled={this.state.is_alarm_no_checkbox}
                            >
                              No
                            </Checkbox>
                          </Form.Group>
                        </div>
                      </div>
                      <br />
                      <Button
                        className="btn btn-primary"
                        onClick={e => this.addEmergencyHandler(e)}
                      >
                        Declare Emergency
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

const mapStateToProps = state => ({
  user: state.user.user,
});

export default hasPermission(
  requireAuth(
    connect(
      mapStateToProps,
      {
        consumerList,
        emergencyCreate,
        consumerSearchList,
      },
    )(AddEmergencyPage),
  ),
);

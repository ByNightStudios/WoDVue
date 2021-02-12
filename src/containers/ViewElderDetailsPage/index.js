import React from 'react';
import * as _ from 'lodash';

import { notification, message, Alert, Popover } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faHands,
  faComments,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { InfoCircleOutlined } from '@ant-design/icons';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';
import { getRenderingHeader } from '../../common/helpers';
import { getElderData, removeElderData } from '../../actions/ElderActions';
import { getCountryCodesList } from '../../actions/ConfigActions';
import { emergencyCreate } from '../../actions/EmergencyActions';

import requireAuth from '../../hoc/requireAuth';
import hasPermission from '../../hoc/hasPermission';
import TabsNavigator from '../../components/TabsNavigator';
import SideNavigation from '../../components/SideNavigation';
import ElderDetailsDataManager from './dataManager';
import AlertLight from '../../assets/images/icons/alert-light.svg';

import styles from './view-elder-details-page.scss';
class ViewElderDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      navigationDeployed: true,
    };

    this.dataManager = new ElderDetailsDataManager();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Elder Profile';
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.elderData && this.props.elderData.full_name) {
      document.title = `Emoha Admin | ${this.props.elderData
        ? `${_.get(this.props.elderData, 'full_name', 'Elder')}'s Profile`
        : `Elder's Profile`
        }`;
    }
  }

  openNotification = (message, description, status) => {
    const style = { color: status ? 'green' : 'red' };

    const args = {
      message,
      description,
      duration: 5,
      style,
    };

    notification.open(args);
  };

  _startPageLoader = () => {
    this.setState({ loader: true });
  };

  _stopPageLoader = () => {
    this.setState({ loader: false });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  addEmergencyHandler = () => {
    const consumer_uuid = this.props.elderData.id;
    if (!consumer_uuid)
      return this.openNotification('Error', 'Please select an elder', 0);

    this._startPageLoader();

    const body = {
      consumer_uuid,
    };

    this.props
      .emergencyCreate(body)
      .then(result => {
        this._stopPageLoader();
        this.openNotification(
          'Success',
          'Emergency was successfully declared for this elder.',
          1,
        );
        this.props.history.push('/emergencies');
      })
      .catch(error => {
        this._stopPageLoader();
        this.openNotification('Error', error.message, 0);
      });
  };

  resyncZoho = () => {
    const zoho_id = _.get(this.props.elderData, 'zoho_id', null);
    const mobile_number = _.get(this.props.elderData, 'mobile_number', null);

    if (zoho_id && mobile_number) {
      this._startPageLoader();
      this.dataManager
        .elderZohoResync(zoho_id, mobile_number)
        .then(result => {
          this._stopPageLoader();
          this.openNotification(
            'Success',
            'Record data will be re-synced from the Zoho server in the background.',
            1,
          );
        })
        .catch(error => {
          this._stopPageLoader();
          this.openNotification(
            'Error',
            'Something went wrong. Please try again later',
            0,
          );
        });
    }
  };

  renderAlerPermission() {
    if (!checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)) {
      return (
        <Alert
          type="success"
          message="You have perform operations on elder profile"
        />
      );
    }
    return <Alert type="error" message="You can only view the elder profile" />;
  }

  render() {
    const { navigationDeployed } = this.state;
    const { elderData } = this.props;
    const success = () => {
      const hide = message.loading('Fetching data in progress..', 0);
      // Dismiss manually and asynchronously
      setTimeout(hide, 500);
    };
    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? 'elderdetails-page sidebar-page sidebar-page--open position-relative'
              : 'elderdetails-page sidebar-page sidebar-page--closed position-relative'
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
                <div className="d-flex flex-row justify-content-center">
                  <h2>
                    {elderData
                      ? `${_.get(elderData, 'full_name', 'Elder')}'s Profile`
                      : `Elder's Details`}{' '}
                  </h2>
                  <Popover
                    title={null}
                    content={this.renderAlerPermission()}
                    placement="rightTop"
                    style={{ marginLeft: 10 }}
                  >
                    <InfoCircleOutlined />
                  </Popover>
                </div>
              </div>
              <div className="internal-header-right">
                <div className="record-actions d-flex align-items-center justify-content-start">
                  <button
                    title="Create Emergency"
                    className="btn btn-record-action"
                    onClick={() => this.addEmergencyHandler()}
                  >
                    <img
                      src={AlertLight}
                      className="alert-lamp"
                      alt="Emergency"
                    />
                  </button>
                  <Link
                    title="Create Concierge"
                    to={`/concierge/create/${this.props.match.params.id}`}
                  >
                    <FontAwesomeIcon icon={faHands} />
                  </Link>
                  <Link
                    title="Start Chat"
                    to={`/support?id=${this.props.match.params.id}&name=${_.get(
                      elderData,
                      'full_name',
                      'Unnamed',
                    )}&mobile=${_.get(elderData, 'mobile_number', '')}`}
                  >
                    <FontAwesomeIcon icon={faComments} />
                  </Link>
                  {elderData && elderData.zoho_id && (
                    <>
                      <span className="vertical-separator" />
                      <button
                        title="Resync From Zoho"
                        className="btn btn-record-action"
                        onClick={() => this.resyncZoho()}
                      >
                        <FontAwesomeIcon icon={faSyncAlt} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="internal-content">
              <TabsNavigator
                startLoader={this._startPageLoader}
                stopLoader={this._stopPageLoader}
                openNotification={this.openNotification}
                currentElderIdentifier={this.props.match.params.id}
                loading={this.state.loader}
                elderData={this.props.elderData}
                userRole={this.props.user.roles}
                user={this.props.user}
              />
            </div>
          </main>
        </div>

        {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
        {this.state.loader ? success() : null}
      </React.Fragment>
    );
  }

  componentWillUnmount() {
    this.props.removeElderData();
  }
}
const mapsStateToProps = state => ({
  user: state.user.user,
  elderData: state.elder.elderData,
});

const mapDispatchToProps = {
  getElderData,
  removeElderData,
  getCountryCodesList,
  emergencyCreate,
};

export default hasPermission(
  requireAuth(
    connect(
      mapsStateToProps,
      mapDispatchToProps,
    )(ViewElderDetailsPage),
  ),
);

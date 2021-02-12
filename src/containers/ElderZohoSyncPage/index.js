import React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import { notification, Select } from 'antd';
import requireAuth from '../../hoc/requireAuth';

import ElderService from '../../service/ElderService';
import hasPermission from '../../hoc/hasPermission';
import ZohoRefer from '../../assets/images/icons/zoho-id-refer.png';

import styles from './elder-zoho-sync-page.scss';

class ElderZohoSyncPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      loader: false,
      zoho_id: '',
      mobile_number: '',
    };

    this.elderService = new ElderService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Elder Zoho Sync';
  }

  startLoader = () => {
    this.setState({ loader: true });
  };

  stopLoader = () => {
    this.setState({ loader: false });
  };

  formValidation = () => {
    const { zoho_id, mobile_number } = this.state;

    if (!zoho_id || !mobile_number) {
      return false;
    }
    return true;
  };

  setStateValues = (e, field) => {
    let value = e.currentTarget.value;

    this.setState((state) => ({
      ...state,
      [`${field}`]: value,
    }));
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
      style,
    };
    notification.open(args);
  };

  elderZohoSync = () => {
    const valid = this.formValidation();

    if (!valid) {
      return this.openNotification('Error', 'All fields are required', 0);
    }

    const dataPayload = {
      zoho_id: this.state.zoho_id,
      mobile_number: this.state.mobile_number,
    };

    this.startLoader();

    this.elderService
      .elderZohoSync(dataPayload)
      .then((responseData) => {
        this.stopLoader();
        this.openNotification(
          'Success',
          'Record data will be synced from the Zoho server in the background.',
          1
        );
        this.resetStateHandler();
      })
      .catch((errorData) => {
        this.stopLoader();
        const errorMessage = get(
          errorData,
          'response.data.message',
          'Something went wrong. Please try again later.'
        );

        this.openNotification('Error', errorMessage, 0);
      });
  };

  resetStateHandler = () => {
    this.setState({
      zoho_id: '',
      mobile_number: '',
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
                <h2>Elder Zoho Sync</h2>
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
                                <Form.Label>Enter Elder Zoho ID</Form.Label>
                                <Form.Control
                                  type='text'
                                  placeholder='3908758000040514599'
                                  value={this.state.zoho_id}
                                  onChange={(e) =>
                                    this.setStateValues(e, 'zoho_id')
                                  }
                                />
                              </Form.Group>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-sm-10'>
                              <Form.Group controlId='communityEventCity'>
                                <Form.Label>
                                  Enter Elder Zoho Mobile Number
                                </Form.Label>
                                <Form.Control
                                  type='text'
                                  placeholder='9665050455'
                                  value={this.state.mobile_number}
                                  onChange={(e) =>
                                    this.setStateValues(e, 'mobile_number')
                                  }
                                />
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        className='btn btn-primary'
                        onClick={() => this.elderZohoSync()}
                      >
                        Save
                      </Button>

                      <div className='row'>
                        <div className='col-sm-10'>
                          <h5>
                            **Please refer to the image below to get the Zoho ID
                            of the elder's record.
                          </h5>
                          <img src={ZohoRefer} />
                        </div>
                      </div>
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
  requireAuth(connect(mapStateToProps, {})(ElderZohoSyncPage))
);

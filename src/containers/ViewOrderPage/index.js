import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';

import requireAuth from '../../hoc/requireAuth';
import PageLoader from '../../components/PageLoader';
import SubHeader from '../../components/SubHeader';
import SideNavigation from '../../components/SideNavigation';
import OrdersManagerFile from './dataManager';
import styles from './view-order.scss';
import hasPermission from '../../hoc/hasPermission';

const OrdersManager = new OrdersManagerFile();

class ViewOrderPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      orderDetails: null,
      classToggle: '',
    };

    this.style = {};
  }

  componentDidMount() {
    this.getOrderData(this.props.match.params.id);
  }

  getOrderData = (order_id) => {
    OrdersManager.getOrderByIDData({ order_id })
      .then((res) => {
        this.setState({ orderDetails: res.data, loader: false }, () => {
          document.title = `Emoha Admin | Order No. ${_.get(
            res.data,
            'reference_id',
            ''
          )}`;
          this.EFFECT_getStatusClassName();
        });
      })
      .catch((error) => {
        this.stopLoader();
        this.notification(
          'Error',
          'Incorrect order identifier detected. Please close this tab and re-open from the orders list.',
          0
        );
      });
  };

  startLoader = () => {
    this.setState({ loader: true });
  };

  stopLoader = () => {
    this.setState({ loader: false });
  };

  handleNavigationToggle = () => {
    this.setState((state) => ({
      navigationDeployed: !state.navigationDeployed,
    }));
  };

  EFFECT_getStatusClassName = () => {
    const { status } = this.state.orderDetails;
    let { classToggle } = this.state;

    if (status === 0) {
      classToggle = 'request-status-value status-orange';
    } else if (status === 1) {
      classToggle = 'request-status-value status-green';
    } else if (status === 2) {
      classToggle = 'request-status-value status-red';
    } else if (status === 3) {
      classToggle = 'request-status-value';
    }

    this.setState({ classToggle });
  };

  getRenderingSubHeader = () => {
    const leftChildren = [
      <h2 key={0}>
        Order :{' '}
        {this.state.orderDetails !== undefined
          ? this.state.orderDetails.reference
          : ''}
      </h2>,
    ];

    const rightChildren = [];

    return (
      <SubHeader leftChildren={leftChildren} rightChildren={rightChildren} />
    );
  };

  render() {
    const { navigationDeployed, orderDetails } = this.state;

    return (
      orderDetails && (
        <React.Fragment>
          {getRenderingHeader(this.props.user)}

          <div
            className={
              navigationDeployed
                ? 'emergencies-page sidebar-page sidebar-page--open position-relative'
                : 'emergencies-page sidebar-page sidebar-page--closed position-relative'
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
              {/* Include the Sub Header on the Page */}
              {this.getRenderingSubHeader()}

              <div className='internal-content'>
                <div className='emergency-details'>
                  <div className='row chat-link-row'>
                    <div className='col-12'>
                      <div className='request-status'>
                        <h5>Order Status</h5>
                        <h2 className={this.state.classToggle}>
                          <FontAwesomeIcon icon={faCircle} />{' '}
                          {orderDetails.statusText}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className='row chat-link-row'>
                    <div className='col-12'>
                      <div className='request-status'>
                        <h5>User Details</h5>
                        <div className='user-details-pod d-flex align-items-center justify-content-start'>
                          <span className='user-details-name'>Name: </span>
                          <span className='user-details-value'>
                            {_.get(orderDetails, 'user.full_name', '')}
                          </span>
                        </div>
                        <div className='user-details-pod d-flex align-items-center justify-content-start'>
                          <span className='user-details-name'>Phone: </span>
                          <span className='user-details-value'>
                            {_.get(
                              orderDetails,
                              'user.formatted_mobile_number',
                              ''
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row chat-link-row'>
                    <div className='col-12'>
                      <div className='request-status'>
                        <h5>Order Details</h5>
                        <div className='user-details-pod d-flex align-items-center justify-content-start'>
                          <span className='user-details-name'>
                            Reference ID:{' '}
                          </span>
                          <span className='user-details-value'>
                            {_.get(orderDetails, 'reference_id', '')}
                          </span>
                        </div>
                        <div className='user-details-pod d-flex align-items-center justify-content-start'>
                          <span className='user-details-name'>
                            Gateway Order ID:{' '}
                          </span>
                          <span className='user-details-value'>
                            {_.get(orderDetails, 'gateway_order_id', '')}
                          </span>
                        </div>
                        {_.get(orderDetails, 'payment.gateway_payment_id') && (
                          <div className='user-details-pod d-flex align-items-center justify-content-start'>
                            <span className='user-details-name'>
                              Gateway Payment ID:{' '}
                            </span>
                            <span className='user-details-value'>
                              {_.get(
                                orderDetails,
                                'payment.gateway_payment_id',
                                ''
                              )}
                            </span>
                          </div>
                        )}
                        <div className='user-details-pod d-flex align-items-center justify-content-start'>
                          <span className='user-details-name'>Amount: </span>
                          <span className='user-details-value'>
                            {`${_.get(orderDetails, 'currency', '')} ${_.get(
                              orderDetails,
                              'amount',
                              ''
                            )}`}
                          </span>
                        </div>
                        <div className='user-details-pod d-flex align-items-center justify-content-start'>
                          <span className='user-details-name'>
                            Purchased On:{' '}
                          </span>
                          <span className='user-details-value'>
                            {_.get(orderDetails, 'created_at_formatted', '')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row chat-link-row'>
                    <div className='col-12'>
                      <div className='request-status'>
                        <h5>Plan Details</h5>
                        <div className='user-details-pod d-flex align-items-center justify-content-start'>
                          <span className='user-details-name'>Category: </span>
                          <span className='user-details-value'>
                            {_.get(orderDetails, 'plan.category', '')}
                          </span>
                        </div>
                        <div className='user-details-pod d-flex align-items-center justify-content-start'>
                          <span className='user-details-name'>Name: </span>
                          <span className='user-details-value'>
                            {_.get(orderDetails, 'plan.name', '')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
          {this.state.loader ? <PageLoader /> : null}
        </React.Fragment>
      )
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default hasPermission(
  requireAuth(connect(mapStateToProps, mapDispatchToProps)(ViewOrderPage))
);

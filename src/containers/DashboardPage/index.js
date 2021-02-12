/* global google */
/* global MarkerClusterer */

import React from 'react';

import get from 'lodash/get';
import { map, orderBy, forEach, isEmpty, filter, concat } from 'lodash';
import moment from 'moment';
import { Table, Pagination, Statistic, Card } from 'antd';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';
import { ROUTES } from '../../common/constants';
import { analytics } from '../../actions/UserActions';
import { getRenderingHeader } from '../../common/helpers';
import mappedElderData from '../../utils/elderexpirymapped';
import requireAuth from '../../hoc/requireAuth';
import hasPermission from '../../hoc/hasPermission';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import DashboardDataManager, { columns, expireColumns } from './dataManager';
import planTableMappedData from '../../utils/elderPlan';
import styles from './dashboard-page.scss';
import SHCList from '../SHC/shc';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      analytics: null,
      markerLocations: {},
      acquisitionData: [],
      showBasicStats: true,
      showLocationMap: false,
      navigationDeployed: true,
      blinkInterval1: undefined,
      blinkInterval2: undefined,
      requestInterval: undefined,
      initialMapLatLng: { lat: 28.6289017, lng: 77.2065322 },
      birthDay: [],
      birthDayLoading: false,
      elderExpirePlan: [],
    };

    this.dataManager = new DashboardDataManager();
    this.dateRange = this.dateRange.bind(this);
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Dashboard';
    this.setState({ birthDayLoading: true });
    setTimeout(
      () =>
        this.dataManager.getBirthDayList().then(res => {
          this.setState({ birthDay: res });
          this.setState({ birthDayLoading: false });
        }),
      1000,
    );
    setTimeout(
      () =>
        this.dataManager.getPlanList().then(res => {
          if (res) {
            this.setState({ elderExpirePlan: planTableMappedData(res) });
          }
        }),
      1200,
    );
  }

  componentWillReceiveProps(newProps) {
    const onGoingEmergencies = get(
      newProps,
      'user.analytics_data.ongoing_emergencies',
      0,
    );
    if (onGoingEmergencies === 0) {
      clearInterval(this.blinkInterval1);
      if (this.blinkInterval2) clearInterval(this.blinkInterval2);
    } else {
      clearInterval(this.blinkInterval1);
      if (this.blinkInterval2) clearInterval(this.blinkInterval2);
      this.fluctuatePriorityCards();
    }
  }

  setAcquisitionData = () => {
    const { total_acquisition_data } = this.state.analytics;
    if (total_acquisition_data && total_acquisition_data.length) {
      const acquisitionDataArr = [];
      for (const acquisition of total_acquisition_data) {
        acquisitionDataArr.push({
          y: acquisition.count,
          name: acquisition.acquisition,
        });
      }

      this.setState(state => ({
        ...state,
        acquisitionData: acquisitionDataArr,
      }));
    }
  };

  getUsersLocationData = () => {
    this._startPageLoader();

    this.dataManager
      .getUsersLocation()
      .then(responseData => {
        if (responseData) {
          this.setState(
            {
              loader: false,
              showLocationMap: true,
              markerLocations: {
                elderCoordinates: responseData.elderCoordinates,
                responderCoordinates: responseData.responderCoordinates,
              },
              markersLegend: responseData.markersLegend,
            },
            () => {
              this.renderGoogleMaps();
            },
          );
        }
      })
      .catch(errorData => {
        this._stopPageLoader();

        console.log('UNABLE TO FETCH USERS LOCATIONS', errorData);
      });
  };

  fluctuatePriorityCards = () => {
    this.blinkInterval1 = setInterval(() => {
      const element = document.getElementById('activeEmergencies');
      const elementParam = document.getElementById('activeEmergenciesParamter');
      const elementCount = document.getElementById('activeEmergenciesCount');
      const elementText = document.getElementById('activeEmergencyText');

      if (!element.hasAttribute('style')) {
        elementParam.style.color = '#FFFFFF';
        elementCount.style.color = '#FFFFFF';
        elementText.style.color = '#FFFFFF';
        element.style.backgroundColor = '#780001';
        element.style.boxShadow = '0px 0px 8px 0px rgba(120, 0, 1, 0.25)';
      } else {
        element.removeAttribute('style');
        elementParam.removeAttribute('style');
        elementText.removeAttribute('style');
        elementCount.removeAttribute('style');
      }
    }, 750);
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  handleShowLocationMap = () => {
    this.getUsersLocationData();
  };

  _startPageLoader = () => {
    this.setState({
      loader: true,
    });
  };

  _stopPageLoader = () => {
    this.setState({
      loader: false,
    });
  };

  renderGoogleMaps = () => {
    const { initialMapLatLng, markerLocations } = this.state;

    const elderMarkersArr = markerLocations.elderCoordinates;
    const responderMarkerArr = markerLocations.responderCoordinates;
    const markersArr = [];

    const map = new google.maps.Map(document.getElementById('mixLocMap'), {
      zoom: 10,
      zoomControl: true,
      mapTypeId: 'terrain',
      disableDefaultUI: true,
      fullscreenControl: true,
      center: initialMapLatLng,
    });

    const infowindow = new google.maps.InfoWindow();

    for (
      let elderMarkerIndex = 0;
      elderMarkerIndex < elderMarkersArr.length;
      elderMarkerIndex++
    ) {
      var currentMarkerLoc = {
        lat: elderMarkersArr[elderMarkerIndex].lat,
        lng: elderMarkersArr[elderMarkerIndex].lng,
      };

      var currentMarkerIcon = {
        url: elderMarkersArr[elderMarkerIndex].marker,
      };

      var currentMarker = new google.maps.Marker({
        map,
        icon: currentMarkerIcon,
        title: elderMarkersArr[elderMarkerIndex].name,
        position: currentMarkerLoc,
      });

      google.maps.event.addListener(
        currentMarker,
        'click',
        (function(currentMarker, elderMarkerIndex) {
          return function() {
            infowindow.setContent(
              `<p>${elderMarkersArr[elderMarkerIndex].name}</p>`,
            );
            infowindow.open(map, currentMarker);
          };
        })(currentMarker, elderMarkerIndex),
      );

      markersArr.push(currentMarker);
    }

    for (
      let responderMarkerIndex = 0;
      responderMarkerIndex < responderMarkerArr.length;
      responderMarkerIndex++
    ) {
      var currentMarkerLoc = {
        lat: responderMarkerArr[responderMarkerIndex].lat,
        lng: responderMarkerArr[responderMarkerIndex].lng,
      };

      var currentMarkerIcon = {
        url: responderMarkerArr[responderMarkerIndex].marker,
      };

      var currentMarker = new google.maps.Marker({
        map,
        icon: currentMarkerIcon,
        title: responderMarkerArr[responderMarkerIndex].name,
        position: currentMarkerLoc,
      });

      markersArr.push(currentMarker);
    }

    const markerCluster = new MarkerClusterer(map, markersArr, {
      maxZoom: 12,
      zoomOnClick: true,
      imagePath: `${config.BASEURLWEB}public/markercluster/m`,
    });
  };

  dateRange(startDate, endDate, steps = 1) {
    const dateArray = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
  }

  getUserName(erm, scrm) {
    if (isEmpty(erm) && isEmpty(scrm)) {
      return 'None Assigned';
    }
    if (!isEmpty(erm[0]) && isEmpty(scrm[0])) {
      return `${erm[0].first_name} (ERM)`;
    }
    if (!isEmpty(scrm[0]) && isEmpty(erm[0])) {
      return `${scrm[0].first_name} (NO)`;
    }
    if (!isEmpty(scrm[0]) && !isEmpty(erm[0])) {
      return `${erm[0].first_name} (ERM), ${scrm[0].first_name} (NO)`;
    }
  }

  getUserServiceType(erm, scrm) {
    if (isEmpty(erm) && isEmpty(scrm)) {
      return 'No Erm and No Nursing Officier Assign';
    }
    if (!isEmpty(erm[0])) {
      return '(ERM)';
    }
    if (!isEmpty(scrm[0])) {
      return '(NO)';
    }
  }

  mappedBirthData = data => {
    const mySortedDate = [];
    const withMappedDate = map(data, item => {
      const myData = {
        new_dob: `${new Date().getFullYear()}-${moment(item.dob).format(
          'MM-DD',
        )}`,
        user_name: this.getUserName(item.erm, item.scrm),
        user_service_type: this.getUserServiceType(item.erm, item.scrm),
        ...item,
      };
      return myData;
    });
    const dateRanges = this.dateRange(
      moment().format('YYYY-MM-DD'),
      moment()
        .add(13, 'days')
        .format('YYYY-MM-DD'),
    );

    for (let i = 0; i < dateRanges.length; i++) {
      forEach(withMappedDate, item => {
        if (item.new_dob === dateRanges[i]) {
          mySortedDate.push(item);
        }
      });
    }

    const userName = get(this.props, 'user.first_name', '');

    const loggedInUserTodayEldersBDay = filter(
      mySortedDate,
      o =>
        o.user_name === userName && o.new_dob === moment().format('YYYY-MM-DD'),
    );
    const loggedInUserNotTodayEldersBDay = filter(
      mySortedDate,
      o =>
        o.user_name === userName && o.new_dob !== moment().format('YYYY-MM-DD'),
    );
    const notLoggedInUserTodayEldersBDay = filter(
      mySortedDate,
      o =>
        o.user_name !== userName && o.new_dob === moment().format('YYYY-MM-DD'),
    );
    const notLoggedInUserNotTodayEldersBDay = filter(
      mySortedDate,
      o =>
        o.user_name !== userName && o.new_dob !== moment().format('YYYY-MM-DD'),
    );
    const elderBDayData = concat(
      loggedInUserTodayEldersBDay,
      notLoggedInUserTodayEldersBDay,
      loggedInUserNotTodayEldersBDay,
      notLoggedInUserNotTodayEldersBDay,
    );

    return elderBDayData;
  };

  render() {
    const {
      markersLegend,
      showBasicStats,
      showLocationMap,
      navigationDeployed,
      acquisitionData,
    } = this.state;

    const analytics = get(this.props, 'user.analytics_data', {});
    const roles = get(this.props, 'user.roles', []);

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? 'dashboard-page sidebar-page sidebar-page--open position-relative'
              : 'dashboard-page sidebar-page sidebar-page--closed position-relative'
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

          <main className="sidebar-page-wrapper">
            <div className="row w-100 justify-content-between">
              <div className="internal-header">
                <div className="internal-header-left">
                  <h2>Welcome to Emoha!</h2>
                </div>
              </div>
              <Link to={ROUTES.EMERGENCIES}>
                <Card
                  bordered
                  hoverable
                  className="dashboard-card dashboard-card--priority"
                  id="activeEmergencies"
                  bodyStyle={{
                    padding: 10,
                  }}
                >
                  <Statistic
                    title="Emergencies | Active Vs Total "
                    value={get(analytics, 'ongoing_emergencies', 0)}
                    suffix={`/ ${get(analytics, 'total_emergencies', 0)}`}
                  />
                </Card>
              </Link>
            </div>
            <div className="dashboard-birthday">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex flex-row align-items-center justify-content-between w-100">
                    <h4>Birthdays Dashboard</h4>{' '}
                    <Link to={ROUTES.BIRTHDAY}> Maximize</Link>
                  </div>
                  <Table
                    columns={columns}
                    bordered
                    size="middle"
                    dataSource={this.mappedBirthData(
                      get(this.state, 'birthDay', []),
                    )}
                    scroll={{ y: 300 }}
                    loading={get(this.state, 'birthDayLoading', false)}
                    pagination={<Pagination />}
                  />
                </div>
              </div>
              <div className="row" style={{ marginTop: 20 }}>
                <div className="col-12">
                  <div className="d-flex flex-row align-items-center justify-content-between w-100">
                    <h4> Elder Expire Plan Dashboard</h4>{' '}
                  </div>
                  <Table
                    columns={expireColumns}
                    bordered
                    size="middle"
                    dataSource={mappedElderData(this.state.elderExpirePlan)}
                    scroll={{ y: 300 }}
                    loading={get(this.state, 'birthDayLoading', false)}
                    pagination={{
                      showSizeChanger: false,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="internal-content">
              {/* {showBasicStats && analytics && (
                <div className='charts-wrapper'>
                  <div className='charts-wrapper-item'>
                    <div className='row'>
                      <div className='col-12 col-sm-6'>
                        <Charts
                          highcharts={HighCharts}
                          options={{
                            chart: { type: 'pie' },
                            credits: {
                              enabled: false,
                            },
                            tooltip: {
                              formatter: function () {
                                return 'Total Count: ' + this.y;
                              },
                            },
                            series: [
                              {
                                data: [
                                  {
                                    y: get(
                                      analytics,
                                      'total_app_downloads.using',
                                      0
                                    ),
                                    name: 'Using',
                                  },
                                  {
                                    y: get(
                                      analytics,
                                      'total_app_downloads.not_using',
                                      0
                                    ),
                                    name: 'Not Using',
                                  },
                                ],
                                name: 'Total Count',
                              },
                            ],
                            title: {
                              text: 'Elder App Users',
                            },
                            plotOptions: {
                              pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                  enabled: true,
                                  format:
                                    '<b>{point.name}</b>: {point.percentage:.1f}%',
                                },
                              },
                            },
                          }}
                        />
                      </div>

                      <div className='col-12 col-sm-6'>
                        <Charts
                          highcharts={HighCharts}
                          options={{
                            chart: { type: 'pie' },
                            credits: {
                              enabled: false,
                            },
                            tooltip: {
                              formatter: function () {
                                return 'Total Count: ' + this.y;
                              },
                            },
                            series: [
                              {
                                data: [
                                  {
                                    y: get(
                                      analytics,
                                      'responder_app_downloads.using',
                                      0
                                    ),
                                    name: 'Using',
                                  },
                                  {
                                    y: get(
                                      analytics,
                                      'responder_app_downloads.not_using',
                                      0
                                    ),
                                    name: 'Not Using',
                                  },
                                ],
                                name: 'Total Count',
                              },
                            ],
                            title: {
                              text: 'Responder App Users',
                            },
                            plotOptions: {
                              pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                  enabled: true,
                                  format:
                                    '<b>{point.name}</b>: {point.percentage:.1f}%',
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='charts-wrapper-item'>
                    <div className='row'>
                      <div className='col-12 col-sm-6'>
                        <Charts
                          highcharts={HighCharts}
                          options={{
                            chart: { type: 'pie' },
                            credits: {
                              enabled: false,
                            },
                            tooltip: {
                              formatter: function () {
                                return 'Total Count: ' + this.y;
                              },
                            },
                            series: [
                              {
                                data: [
                                  {
                                    y: get(
                                      analytics,
                                      'total_reg_with_source[0].count',
                                      0
                                    ),
                                    name: get(
                                      analytics,
                                      'total_reg_with_source[0].source',
                                      'Unnamed'
                                    ),
                                  },
                                  {
                                    y: get(
                                      analytics,
                                      'total_reg_with_source[1].count',
                                      0
                                    ),
                                    name: get(
                                      analytics,
                                      'total_reg_with_source[1].source',
                                      'Unnamed'
                                    ),
                                  },
                                  {
                                    y: get(
                                      analytics,
                                      'total_reg_with_source[2].count',
                                      0
                                    ),
                                    name: get(
                                      analytics,
                                      'total_reg_with_source[2].source',
                                      'Unnamed'
                                    ),
                                  },
                                  {
                                    y: get(
                                      analytics,
                                      'total_reg_with_source[3].count',
                                      0
                                    ),
                                    name: get(
                                      analytics,
                                      'total_reg_with_source[3].source',
                                      'Unnamed'
                                    ),
                                  },
                                ],
                                name: 'Total Count',
                              },
                            ],
                            title: {
                              text: 'Elder Registration Sources',
                            },
                            plotOptions: {
                              pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                  enabled: true,
                                  format:
                                    '<b>{point.name}</b>: {point.percentage:.1f}%',
                                },
                              },
                            },
                          }}
                        />
                      </div>

                      {acquisitionData && acquisitionData.length !== 0 && (
                        <div className='col-12 col-sm-6'>
                          <Charts
                            highcharts={HighCharts}
                            options={{
                              chart: { type: 'pie' },
                              credits: {
                                enabled: false,
                              },
                              tooltip: {
                                formatter: function () {
                                  return 'Total Count: ' + this.y;
                                },
                              },
                              series: [
                                {
                                  data: acquisitionData,
                                  name: 'Total Count',
                                },
                              ],
                              title: {
                                text: 'Elder Acquisition Sources',
                              },
                              plotOptions: {
                                pie: {
                                  allowPointSelect: true,
                                  cursor: 'pointer',
                                  dataLabels: {
                                    enabled: true,
                                    format:
                                      '<b>{point.name}</b>: {point.percentage:.1f}%',
                                  },
                                },
                              },
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )} */}

              {/* {showBasicStats && analytics && (
                <div className="statistics-wrapper">
                  <div className="row">
                    <div className="col-12">
                      <h5>Platform Statistics</h5>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6 col-xl-4">
                      <Link to={ROUTES.EMERGENCIES}>
                        <div
                          className="dashboard-card dashboard-card--priority"
                          id="activeEmergencies"
                        >
                          <span
                            className="dashboard-card-paramter"
                            id="activeEmergenciesParamter"
                          >
                            Emergencies
                          </span>
                          <span
                            className="dashboard-card-count d-block"
                            id="activeEmergenciesCount"
                          >
                            {analytics.ongoing_emergencies
                              ? analytics.ongoing_emergencies
                              : '0'}{' '}
                            |{' '}
                            {analytics.total_emergencies
                              ? analytics.total_emergencies
                              : '0'}
                          </span>
                          <span
                            className="dashboard-card-description"
                            id="activeEmergencyText"
                          >
                            Active vs. Total
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-4">
                      <Link to={ROUTES.CONCIERGE}>
                        <div className="dashboard-card">
                          <span className="dashboard-card-paramter">
                            Concierge
                          </span>
                          <span className="dashboard-card-count d-block">
                            {analytics.ongoing_concierge_request
                              ? analytics.ongoing_concierge_request
                              : '0'}{' '}
                            |{' '}
                            {analytics.total_service_requests
                              ? analytics.total_service_requests
                              : '0'}
                          </span>
                          <span className="dashboard-card-description">
                            Ongoing vs. Total
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-4">
                      <div className="dashboard-card">
                        <span className="dashboard-card-paramter">Users</span>
                        <span className="dashboard-card-count d-block">
                          <Link to={ROUTES.ELDERS}>
                            {analytics.total_elders
                              ? analytics.total_elders
                              : '0'}
                          </Link>{' '}
                          |{' '}
                          <Link to={ROUTES.RESPONDERS}>
                            {analytics.total_responders
                              ? analytics.total_responders
                              : '0'}
                          </Link>
                        </span>
                        <span className="dashboard-card-description">
                          Elders vs. Responders
                        </span>
                      </div>
                    </div>
                    {roles &&
                      roles.length !== 0 &&
                      !roles.includes('ERM') &&
                      !roles.includes('ERM Head') && (
                        <div className="col-12 col-sm-6 col-xl-4">
                          <div className="dashboard-card">
                            <span className="dashboard-card-paramter">
                              ERM Allocation
                            </span>
                            <span className="dashboard-card-count d-block">
                              <Link
                                to={`${
                                ROUTES.ELDERS
                              }?filter=ermAllocated&filterStatus=0`}
                              >
                                {get(analytics, 'elder_allocation.pending', 0)}
                              </Link>{' '}
                              |{' '}
                              <Link
                                to={`${
                                ROUTES.ELDERS
                              }?filter=ermAllocated&filterStatus=1`}
                              >
                                {get(
                                  analytics,
                                  'elder_allocation.allocated',
                                  0,
                                )}
                              </Link>
                            </span>
                            <span className="dashboard-card-description">
                              Pending vs. Completed
                            </span>
                          </div>
                        </div>
                      )}
                    <div className="col-12 col-sm-6 col-xl-4">
                      <div className="dashboard-card">
                        <span className="dashboard-card-paramter">
                          House Mapping
                        </span>
                        <span className="dashboard-card-count d-block">
                          <Link
                            to={`${
                              ROUTES.ELDERS
                            }?filter=houseMapping&filterStatus=0`}
                          >
                            {get(analytics, 'elder_house_mapping.pending', 0)}
                          </Link>{' '}
                          |{' '}
                          <Link
                            to={`${
                              ROUTES.ELDERS
                            }?filter=houseMapping&filterStatus=1`}
                          >
                            {get(analytics, 'elder_house_mapping.mapped', 0)}
                          </Link>
                        </span>
                        <span className="dashboard-card-description">
                          Pending vs. Mapped
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-4">
                      <div className="dashboard-card">
                        <span className="dashboard-card-paramter">
                          Daily Calls
                        </span>
                        <span className="dashboard-card-count d-block">
                          <Link
                            to={`${
                              ROUTES.ELDERS
                            }?filter=callsInitiated&filterStatus=0`}
                          >
                            {get(analytics, 'elder_calls.pending', 0)}
                          </Link>{' '}
                          |{' '}
                          <Link
                            to={`${
                              ROUTES.ELDERS
                            }?filter=callsInitiated&filterStatus=1`}
                          >
                            {get(analytics, 'elder_calls.completed', 0)}
                          </Link>
                        </span>
                        <span className="dashboard-card-description">
                          Pending vs. Completed
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-4">
                      <div className="dashboard-card">
                        <span className="dashboard-card-paramter">
                          Service Initiation
                        </span>
                        <span className="dashboard-card-count d-block">
                          <Link
                            to={`${
                              ROUTES.ELDERS
                            }?filter=serviceInitiation&filterStatus=0`}
                          >
                            {get(
                              analytics,
                              'elder_service_initiation.pending',
                              0,
                            )}
                          </Link>{' '}
                          |{' '}
                          <Link
                            to={`${
                              ROUTES.ELDERS
                            }?filter=serviceInitiation&filterStatus=1`}
                          >
                            {get(
                              analytics,
                              'elder_service_initiation.completed',
                              0,
                            )}
                          </Link>
                        </span>
                        <span className="dashboard-card-description">
                          Pending vs. Completed
                        </span>
                      </div>
                    </div>
                    {roles &&
                      roles.length !== 0 &&
                      (roles.includes('ERM') || roles.includes('ERM Head')) && (
                        <div className="col-12 col-sm-6 col-xl-4">
                          <Link to={ROUTES.ELDERS}>
                            <div className="dashboard-card">
                              <span className="dashboard-card-paramter">
                                Allocated To You
                              </span>
                              <span className="dashboard-card-count d-block">
                                {get(analytics, 'self_allocated_elders', 0)}
                              </span>
                              <span className="dashboard-card-description">
                                Elders
                              </span>
                            </div>
                          </Link>
                        </div>
                      )}
                    <div className="col-12 col-sm-6 col-xl-4">
                      <Link to={ROUTES.STAFF}>
                        <div className="dashboard-card">
                          <span className="dashboard-card-paramter">
                            Team Members
                          </span>
                          <span className="dashboard-card-count d-block">
                            {get(analytics, 'total_team_members', 0)}
                          </span>
                          <span className="dashboard-card-description">
                            Total
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )} */}

              <SHCList maximizeLink />
              {showBasicStats && (
                <div className="location-mapper">
                  {!showLocationMap ? (
                    <div className="row">
                      <div className="col-12">
                        <h5>Location Map</h5>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => this.handleShowLocationMap()}
                        >
                          <FontAwesomeIcon icon={faMapMarkedAlt} /> Show Map
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-12 col-sm-10">
                        <h5>Location Map</h5>
                        <div className="dashboard-heatmap" id="mixLocMap" />
                      </div>
                      <div className="col-12 col-sm-2">
                        <h5>Legend</h5>

                        <div className="dashboard-legend">
                          {markersLegend &&
                            markersLegend.length !== 0 &&
                            markersLegend.map((item, index) => (
                              <div
                                className="dashboard-legend-item d-flex align-items-center justify-content-start"
                                key={index}
                              >
                                <img
                                  src={item.marker}
                                  alt={item.tag}
                                  className="dashboard-legend-image"
                                />
                                <span className="dashboard-legend-text d-inline-block">
                                  {item.tag}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
        {this.state.loader ? <PageLoader /> : null}
      </React.Fragment>
    );
  }

  componentWillUnmount = async () => {
    await clearInterval(this.requestInterval);
    await clearInterval(this.blinkInterval1);
    await clearInterval(this.blinkInterval2);
  };
}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  analytics,
};

export default hasPermission(
  requireAuth(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(DashboardPage),
  ),
);

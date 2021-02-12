/*global google*/
/*global MarkerClusterer */

import React from "react";
import { Button, Form } from "react-bootstrap";
import get from "lodash/get";
import { map, forEach, isEmpty, filter, concat } from "lodash";
import { Link } from "react-router-dom";
import { ROUTES } from "../../common/constants";
import SideNavigation from "../../components/SideNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { getRenderingHeader } from "../../common/helpers";

import moment from "moment";
import { Table } from "antd";
import { connect } from "react-redux";

import requireAuth from "../../hoc/requireAuth";
import hasPermission from "../../hoc/hasPermission";

import DashboardDataManager, { columns } from "./dataManager";


class BirthDayPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      birthDay: [],
      birthDayLoading: false,
      navigationDeployed: true,
    };

    this.dataManager = new DashboardDataManager();
    this.dateRange = this.dateRange.bind(this);
  }

  componentDidMount() {
    document.title = "Emoha Admin | Dashboard";
    this.setState({ birthDayLoading: true });
    setTimeout(
      () => this.dataManager.getBirthDayList().then(res => {
        this.setState({ birthDay: res });
        this.setState({ birthDayLoading: false });
      }),
      1000
    )
  }


  dateRange(startDate, endDate, steps = 1) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
  };

  getUserName(erm, scrm) {
    if (isEmpty(erm) && isEmpty(scrm)) {
      return 'No Assigned'
    }
    if (!isEmpty(erm[0]) && isEmpty(scrm[0])) {
      return `${erm[0].first_name} (ERM)`;
    }
    if (!isEmpty(scrm[0])&& isEmpty(erm[0])) {
      return `${scrm[0].first_name} (NO)`;
    }
    if (!isEmpty(scrm[0])&& !isEmpty(erm[0])) {
      return `${erm[0].first_name} (ERM), ${scrm[0].first_name} (NO)`;
    }
  }

  getUserServiceType(erm, scrm) {
    if (isEmpty(erm) && isEmpty(scrm)) {
      return 'None Assigned'
    }
    if (!isEmpty(erm[0])) {
      return '(ERM)';
    }
    if (!isEmpty(scrm[0])) {
      return '(NO)';
    }
  }

  mappedBirthData = (data) => {
    let mySortedDate = [];
    const withMappedDate = map(data, item => {
      const myData = {
        new_dob: `${new Date().getFullYear()}-${moment(item.dob).format('MM-DD')}`,
        user_name: this.getUserName(item.erm, item.scrm),
        user_service_type: this.getUserServiceType(item.erm, item.scrm),
        ...item,
      }
      return myData;
    });
    const dateRanges = this.dateRange(moment().format('YYYY-MM-DD'), moment().add(13, 'days').format('YYYY-MM-DD'));

    for (let i = 0; i < dateRanges.length; i++) {
      forEach(withMappedDate, item => {
        if (item.new_dob === dateRanges[i]) {
          mySortedDate.push(item)
        }
      })
    }

    const userName = get(this.props, 'user.first_name', '');

    const loggedInUserTodayEldersBDay = filter(mySortedDate, o => o.user_name === userName && o.new_dob === moment().format('YYYY-MM-DD'));
    const loggedInUserNotTodayEldersBDay = filter(mySortedDate, o => o.user_name === userName && o.new_dob !== moment().format('YYYY-MM-DD'));
    const notLoggedInUserTodayEldersBDay = filter(mySortedDate, o => o.user_name !== userName && o.new_dob === moment().format('YYYY-MM-DD'));
    const notLoggedInUserNotTodayEldersBDay = filter(mySortedDate, o => o.user_name !== userName && o.new_dob !== moment().format('YYYY-MM-DD'));


    const elderBDayData = concat(loggedInUserTodayEldersBDay, notLoggedInUserTodayEldersBDay, loggedInUserNotTodayEldersBDay, notLoggedInUserNotTodayEldersBDay,);

    return elderBDayData;
  }


  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  render() {
    const { navigationDeployed } = this.state;

    return (
      <div>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? "addelders-page sidebar-page sidebar-page--open position-relative"
              : "addelders-page sidebar-page sidebar-page--closed position-relative"
          }
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
            <div className="dashboard-birthday">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex flex-row align-items-center justify-content-between w-100"><h4>Birthdays Dashboard</h4> <Link to={ROUTES.DASHBOARD}>Go Back</Link></div>
                  <Table
                    columns={columns}
                    bordered
                    size="middle"
                    dataSource={this.mappedBirthData(get(this.state, 'birthDay', []))}
                    scroll={{ y: 550 }}
                    loading={get(this.state, 'birthDayLoading', false)}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {};

export default hasPermission(
  requireAuth(connect(mapStateToProps, mapDispatchToProps)(BirthDayPage))
);

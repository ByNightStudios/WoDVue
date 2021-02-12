import React from "react";
import * as _ from "lodash";
import requireAuth from "../../hoc/requireAuth";

import { connect } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { getRenderingHeader } from "../../common/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { notification, DatePicker } from "antd";

import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";
import moment from "moment";

import styles from "./report-generation.scss";
import hasPermission from "../../hoc/hasPermission";
import ReportGenerator from "../../components/ReportGenerator";
import PlanReport from '../../containers/PlanReport'

class ReportGeneration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationDeployed: true,
      loader: false,
      start_date: null,
      end_date: null,
    };
  }

  componentDidMount() {
    document.title = "Emoha Admin | Responder Reports";
  }

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  onStartChange = (value) => {
    this.onChange("startValue", value);
  };

  onEndChange = (value) => {
    this.onChange("endValue", value);
  };

  setStateValues = (e, item) => {
    let value = "";
    if (e !== null) {
      if (item === "start_date") {
        value = moment(e._d).format("YYYY-MM-DD 00:00:00");
      }
      if (item === "end_date") {
        value = moment(e._d).format("YYYY-MM-DD 23:59:59");
      }
    } else {
      value = null;
    }
    this.setState({
      [`${item}`]: value,
    });
  };

  openNotification = (message, description, status = false) => {
    let style = { color: "green" };

    if (!status)
      style = {
        color: "red",
      };

    const args = {
      message,
      description,
      duration: 3,
      style,
    };

    notification.open(args);
  };

  capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  render() {
    const { navigationDeployed } = this.state;
    const { type } = this.props.match.params;
    console.log(type);
    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? "reports-page sidebar-page sidebar-page--open position-relative"
              : "reports-page sidebar-page sidebar-page--closed position-relative"
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
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001"  />
            </Button>
          )}
          <ReportGenerator {...this.props} />
          <main className="sidebar-page-wrapper position-relative">
            <div className="internal-header">
              <div className="internal-header-left">
                <h2>{this.capitalize(type)} Report</h2>
              </div>
            </div>
            <div className="internal-content">
              <div className="row">
                <div className="col-12 col-sm-8">
                  <h4 className="reports-page-subtitle">Generate a Report</h4>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-8">
                  <p className="reports-page-description">
                    Click the button below to begin generating the comprehensive
                    report. Once the report is generated, click on the Download
                    button to download the file.
                  </p>
                </div>
              </div>
              {type == "notes" ? (
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="elderDateOfBirth">
                      <Form.Label>Start Date</Form.Label>
                      <DatePicker
                        value={
                          this.state.start_date
                            ? moment(
                                this.state.start_date,
                                "YYYY-MM-DD HH:mm A"
                              )
                            : null
                        }
                        onChange={(e) => this.setStateValues(e, "start_date")}
                        disabledDate={(value) => value.isAfter(moment())}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="elderDateOfBirth">
                      <Form.Label>End Date</Form.Label>
                      <DatePicker
                        value={
                          this.state.end_date
                            ? moment(this.state.end_date, "YYYY-MM-DD HH:mm A")
                            : null
                        }
                        onChange={(e) => this.setStateValues(e, "end_date")}
                        disabledDate={(value) => value.isAfter(moment())}
                      />
                    </Form.Group>
                  </div>
                </div>
              ) : null}
              <ReportGenerator
                {...this.props}
                start_date={this.state.start_date}
                end_date={this.state.end_date}
              />
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

const mapDispatchToProps = {};

export default hasPermission(
  requireAuth(connect(mapStateToProps, mapDispatchToProps)(ReportGeneration))
);

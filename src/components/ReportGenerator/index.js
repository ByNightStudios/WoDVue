import React from "react";
import * as _ from "lodash";
import { Button, Form } from "react-bootstrap";
import ReportGeneratorDataManager from "./dataManager";
import { connect } from "react-redux";
import PageLoader from "../../components/PageLoader";
import { notification, DatePicker } from "antd";
import moment from "moment";

class ReportGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fileName: "",
      fileUrl: "",
      gotReport: false,
      start_date: null,
      end_date: null,
    };
    this.reportDataManager = new ReportGeneratorDataManager();
    this.reports = {};
  }

  setLoader = (value) => {
    this.setState({
      loader: value,
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

  componentDidUpdate(prevProps, prevState) {
    const { start_date, end_date } = this.props;
    if (prevProps.match.params.type != this.props.match.params.type) {
      this.setLoader(true);
      this.setState({
        fileName: "",
        fileUrl: "",
        start_date,
        end_date,
        gotReport: false,
      });
      this.setLoader(false);
    }
  }

  generateReport = (type) => {
    let payload = {
      report_type: type,
    };
    if (type === "notes") {
      payload["start_date"] = this.props.start_date;
      payload["end_date"] = this.props.end_date;
    }
    if (
      type === "notes" &&
      this.props.start_date == null &&
      this.props.end_date == null
    ) {
      this.openNotification("Error", "Please select Start and end dates");
      return;
    }
    this.setLoader(true);
    this.reportDataManager
      .generateReport(payload)
      .then((result) => {
        const { data } = result;
        const { fileName, fileUrl } = data;
        this.setState({
          fileName,
          fileUrl,
          gotReport: true,
        });
        this.setLoader(false);
        this.openNotification("Success", "Report Generated.", 1);
      })
      .catch((error) => {
        this.setLoader(false);
        this.openNotification("Error", `${error.response.data.message}`);
      });
  };

  Downloaded = () => {
    this.setState({
      fileName: "",
      fileUrl: "",
      start_date: null,
      end_date: null,
      gotReport: false,
    });
  };

  componentDidMount() {}

  render() {
    const { type } = this.props.match.params;
    const { gotReport, fileUrl } = this.state;
    return (
      <div>
        {!gotReport ? (
          <div className="row">
            <div className="col-12 col-sm-8">
              <Button
                className="btn btn-primary"
                onClick={() => this.generateReport(type)}
              >
                Generate Report
              </Button>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12 col-sm-8">
              <a
                href={fileUrl}
                target="_new"
                className="btn btn-link"
                onClick={this.Downloaded}
              >
                Download Generated Report
              </a>
            </div>
          </div>
        )}
        {this.state.loader ? <PageLoader /> : null}
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ReportGenerator);

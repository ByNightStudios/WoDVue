import React from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import requireAuth from '../../hoc/requireAuth';

import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { getRenderingHeader } from '../../common/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { notification, DatePicker, Radio } from 'antd';
import { generateNewReport } from '../../actions/ReportActions';
import { transformStateToPayload } from './Parser';

import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';

import styles from './reports-page.scss';
import hasPermission from '../../hoc/hasPermission';

class ReportsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      loader: false,
      startValue: null,
      endValue: null,
      endOpen: false,
      reportFormat: null,
    };
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Reports';
  }

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  disabledStartDate = (startValue) => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  validateFormFields = () => {
    let isFormValid = true;

    const { startValue, endValue, reportFormat } = this.state;

    if (!startValue || !endValue || !reportFormat) {
      isFormValid = false;
    }

    return isFormValid;
  };

  validateDateRange = () => {
    let isFormValid = true;

    const { startValue, endValue } = this.state;

    const rangeDifference = endValue.diff(startValue, 'days');

    if (rangeDifference > 90) {
      isFormValid = false;
    }

    return isFormValid;
  };

  clearFormFields = () => {
    this.setState({
      startValue: null,
      endValue: null,
      endOpen: false,
      reportFormat: null,
    });
  };

  handleFormSubmission = () => {
    this.setState({ loader: true });

    const checkFormValid = this.validateFormFields();

    if (checkFormValid) {
      const checkDateRangeValid = this.validateDateRange();

      if (checkDateRangeValid) {
        const dataPayload = transformStateToPayload(this.state);

        this.props
          .generateNewReport(dataPayload)
          .then((responseData) => {
            this.setState({ loader: false });

            this.clearFormFields();

            const reportURI = _.get(responseData, 'reportURI', null);

            reportURI
              ? window.open(responseData.reportURI)
              : this.openNotification(
                  'Error',
                  "Couldn't generate a report for the selected range. No data was available."
                );
          })
          .catch((errorData) => {
            this.setState({ loader: false });
            this.openNotification('Error', errorData.message);
          });
      } else {
        this.setState({ loader: false });
        this.openNotification(
          'Error',
          'Cannot generate a report for more than 3 months.'
        );
      }
    } else {
      this.setState({ loader: false });
      this.openNotification(
        'Error',
        'All fields are required to generate a report!'
      );
    }
  };

  openNotification = (message, description, status = false) => {
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

  render() {
    const { navigationDeployed, startValue, endValue, endOpen } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? 'reports-page sidebar-page sidebar-page--open position-relative'
              : 'reports-page sidebar-page sidebar-page--closed position-relative'
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
                <h2>Reports</h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-12 col-sm-8'>
                  <h4 className='reports-page-subtitle'>Generate a Report</h4>
                </div>
              </div>
              <div className='row'>
                <div className='col-12 col-sm-8'>
                  <p className='reports-page-description'>
                    Select the options about how you wish to look up reports?
                  </p>
                  <Form>
                    <div className='reports-page-range'>
                      <Form.Group controlId='reportStartDate'>
                        <Form.Label>Start Date</Form.Label>
                        <DatePicker
                          // disabledDate={this.disabledStartDate}
                          format='DD-MM-YYYY'
                          value={startValue}
                          placeholder='Start Date'
                          onChange={this.onStartChange}
                          onOpenChange={this.handleStartOpenChange}
                          disabledDate={(d) => !d || d.isAfter(moment())}
                        />
                      </Form.Group>
                      <Form.Group controlId='reportStartDate'>
                        <Form.Label>End Date</Form.Label>
                        <DatePicker
                          // disabledDate={this.disabledEndDate}
                          format='DD-MM-YYYY'
                          value={endValue}
                          placeholder='End Date'
                          onChange={this.onEndChange}
                          open={endOpen}
                          onOpenChange={this.handleEndOpenChange}
                          disabledDate={(d) => !d || d.isAfter(moment())}
                        />
                      </Form.Group>
                    </div>
                    <div className='reports-page-type'>
                      <Form.Group controlId='reportStartDate'>
                        <Form.Label>Report Format</Form.Label>
                        <div className='radio-control'>
                          <Radio.Group
                            value={this.state.reportFormat}
                            onChange={(event) =>
                              this.onChange('reportFormat', event.target.value)
                            }
                          >
                            <Radio value={'COMPREHENSIVE'}>
                              Comprehensive Report
                            </Radio>
                            <Radio value={'QUICK'}>Quick Report</Radio>
                          </Radio.Group>
                        </div>
                      </Form.Group>
                    </div>
                    <div className='reports-page-definition'>
                      <h6>Types of Reports</h6>
                      <ul>
                        <li>
                          <b>Comprehensive</b>: This type of report is
                          essentially a complete database dump containing all
                          the columns necessary.
                        </li>
                        <li>
                          <b>Quick</b>: This type of report is an overview
                          report which makes quick statistics accessible to
                          analyze.
                        </li>
                      </ul>
                    </div>
                    <Button
                      className='btn btn-primary'
                      onClick={() => this.handleFormSubmission()}
                    >
                      Generate Report
                    </Button>
                  </Form>
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

const mapDispatchToProps = {
  generateNewReport,
};

export default hasPermission(
  requireAuth(connect(mapStateToProps, mapDispatchToProps)(ReportsPage))
);

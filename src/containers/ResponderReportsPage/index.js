import React from 'react';
import * as _ from 'lodash';
import requireAuth from '../../hoc/requireAuth';

import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getRenderingHeader } from '../../common/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd';
import { generateResponderReport } from '../../actions/ReportActions';

import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';

import styles from './responder-reports-page.scss';
import hasPermission from '../../hoc/hasPermission';

class ResponderReportsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      loader: false,
      reportReady: false,
      reportLink: '#',
    };
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Responder Reports';
  }

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  onStartChange = (value) => {
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
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

  generateResponderReport = () => {
    this.setState({ loader: true });

    this.props
      .generateResponderReport()
      .then((responseData) => {
        this.setState({ loader: false });

        const reportURI = _.get(responseData, 'reportURI', null);

        if (reportURI) {
          this.setState({ reportReady: true, reportLink: reportURI });
        } else {
          this.setState({ reportReady: false, reportLink: '#' });
          this.openNotification(
            'Error',
            "Couldn't generate a report. No data was available."
          );
        }
      })
      .catch((errorData) => {
        this.setState({ loader: false });
        this.openNotification('Error', errorData.message);
      });
  };

  render() {
    const { navigationDeployed, reportReady, reportLink } = this.state;

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
                <h2>Responder Report</h2>
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
                    Click the button below to begin generating the comprehensive
                    report for Responders / Volunteers in the system. Once the
                    report is generated, click on the Download button to
                    download the file.
                  </p>
                </div>
              </div>
              {!reportReady ? (
                <div className='row'>
                  <div className='col-12 col-sm-8'>
                    <Button
                      className='btn btn-primary'
                      onClick={() => this.generateResponderReport()}
                    >
                      Generate Report
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='row'>
                  <div className='col-12 col-sm-8'>
                    <a href={reportLink} target='_new' className='btn btn-link'>
                      Download Generated Report
                    </a>
                  </div>
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
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  generateResponderReport,
};

export default hasPermission(
  requireAuth(
    connect(mapStateToProps, mapDispatchToProps)(ResponderReportsPage)
  )
);

/**
 *
 * PlanReport
 *
 */

import React, { memo, useState } from 'react';
import { Button, Card, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectPlanReport from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import SideNavigation from '../../components/SideNavigation';
import { getRenderingHeader } from '../../common/helpers';
import { defaultAction } from './actions';
export function PlanReport(props) {
  useInjectReducer({ key: 'planReport', reducer });
  useInjectSaga({ key: 'planReport', saga });
  const [navigationDeployed, setNavigationDeployed] = useState(true);

  const handleNavigationToggle = value => {
    setNavigationDeployed(!navigationDeployed);
  };

  return (
    <div>
      <Helmet>
        <title>PlanReport</title>
        <meta name="description" content="Description of PlanReport" />
      </Helmet>
      {getRenderingHeader(props.user)}

      <div
        className={
          navigationDeployed
            ? 'reports-page sidebar-page sidebar-page--open position-relative'
            : 'reports-page sidebar-page sidebar-page--closed position-relative'
        }
      >
        {navigationDeployed ? (
          <SideNavigation handleClose={handleNavigationToggle} />
        ) : (
            <Button
              type="button"
              className="btn btn-trigger"
              onClick={handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001" />
            </Button>
          )}

        <main className="sidebar-page-wrapper position-relative">
          <div className="internal-header">
            <div className="internal-header-left">
              <h2>{<FormattedMessage {...messages.header} />}</h2>
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
            <Button type="primary" onClick={props.handleGenerateReport} loading={props.planReport.loading}> Generate Report</Button>
          </div>
        </main>
      </div>
    </div>
  );
}

PlanReport.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleGenerateReport: PropTypes.func,
  planReport: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  planReport: makeSelectPlanReport(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleGenerateReport: () => dispatch(defaultAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PlanReport);

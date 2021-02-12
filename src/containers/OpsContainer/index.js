/**
 *
 * OpsContainer
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { fetchInitialisedPlan, fetchLoading, makeSelectOperationDetails } from './selectors';
import reducer from './reducer';
import saga from './saga';

import SalesInfo from '../../components/OpsTabComponents/SalesInfo';
import OpsDetails from '../../components/OpsTabComponents/OpsDetails';
import TermsConditions from '../../components/OpsTabComponents/TermsConditions';
import NokOutReach from '../../components/OpsTabComponents/NokOutReach';
import SocialAspects from '../../components/OpsTabComponents/SocialAspects';
import EmergencyMilestones from '../../components/OpsTabComponents/EmergencyMilestones';
import Simulation from '../../components/OpsTabComponents/Simulation';
import HealthProfile from '../../components/OpsTabComponents/HealthProfile';
import CghsDetails from '../../components/OpsTabComponents/CghsDetails';
import {
  checkIsErmOrErmSuperVisor
} from '../../utils/checkElderEditPermission';
import { getPlansRequest, updateOpsDetailsRequest, getOperationDetails, updateOperationTabDetails, updateTcCollapseDetails, updateNokCollapseDetails, updateSocialAspectsDetails, updateEmergencyMileStones, updateSimulation, updateCGHS } from './actions';
export function OpsContainer(props) {
  useInjectReducer({ key: 'opsContainer', reducer });
  useInjectSaga({ key: 'opsContainer', saga });

  const {
    currentElderIdentifier,
    getPlansRequest,
    user,
    elderData,
    initialisedPlan,
    loading,
    updateOpsDetailsRequest,
    handleGetOperationDetails,
    operationDetails,
    handleUpdateOperationTabDetails,
    handleUpdateTcCollapseDetails,
    handleUpdateNokCollapseDetails,
    handleUpdateSocialAspectsDetails,
    handleUpdateEmergencyMileStones,
    handleUpdateSimulation,
    handleUpdateCGHS,
  } = props;

  const { operation_detail: operationTabDetails, sales_information: salesInformationDetails, tc_detail: tcDetails, nok_outreach: nokOutReactDetails, social_aspects: socialAspectsDetails, emergency_milestone: emergencyMileStoneDetails, simulation_prevention_magagement: simulationDetails, health_profile: healthProfileDetails, cghs_detail: cghsDetails, elder_relationship: elderRelationShipDetails } = operationDetails;

  const isNotErmOrErmSupervisor = checkIsErmOrErmSuperVisor(user, elderData);

  useEffect(() => {
    getPlansRequest(currentElderIdentifier);
    handleGetOperationDetails(currentElderIdentifier);
  }, []);

  return (
    <Collapse
      bordered
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      defaultActiveKey={['1',]}
    >
      <Collapse.Panel
        header='Sales Information'
        key="1"
        className="site-collapse-custom-panel"
        disabled={false}
      >
        <SalesInfo isNotErmOrErmSupervisor={isNotErmOrErmSupervisor} salesInformationDetails={salesInformationDetails} />
      </Collapse.Panel>

      <Collapse.Panel
        header='Operation Details'
        key="2"
        className="site-collapse-custom-panel"
      >
        <OpsDetails
          isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
          initialisedPlan={initialisedPlan}
          loading={loading}
          updateOpsDetailsRequest={updateOpsDetailsRequest}
          initialValues={operationTabDetails}
          handleUpdateOperationTabDetails={handleUpdateOperationTabDetails}
          currentElderIdentifier={currentElderIdentifier}
        />
      </Collapse.Panel>

      <Collapse.Panel
        header='Terms & Conditions'
        key="3"
        className="site-collapse-custom-panel"
        disabled={false}
      >
        <TermsConditions isNotErmOrErmSupervisor={isNotErmOrErmSupervisor} tcDetails={tcDetails} currentElderIdentifier={currentElderIdentifier} handleUpdateTcCollapseDetails={handleUpdateTcCollapseDetails} />
      </Collapse.Panel>

      <Collapse.Panel
        header='NOK Outreach'
        key="4"
        className="site-collapse-custom-panel"
        disabled={false}
      >
        <NokOutReach nokOutReactDetails={nokOutReactDetails} isNotErmOrErmSupervisor={isNotErmOrErmSupervisor} handleUpdateNokCollapseDetails={handleUpdateNokCollapseDetails} currentElderIdentifier={currentElderIdentifier} />
      </Collapse.Panel>

      <Collapse.Panel
        header='Social Aspects'
        key="5"
        className="site-collapse-custom-panel"
        disabled={false}
      >
        <SocialAspects isNotErmOrErmSupervisor={isNotErmOrErmSupervisor} handleUpdateSocialAspectsDetails={handleUpdateSocialAspectsDetails} currentElderIdentifier={currentElderIdentifier} socialAspectsDetails={socialAspectsDetails} />
      </Collapse.Panel>

      <Collapse.Panel
        header='Emergency Milestones'
        key="6"
        className="site-collapse-custom-panel"
        disabled={false}
      >
        <EmergencyMilestones isNotErmOrErmSupervisor={isNotErmOrErmSupervisor} emergencyMileStoneDetails={emergencyMileStoneDetails} currentElderIdentifier={currentElderIdentifier} handleUpdateEmergencyMileStones={handleUpdateEmergencyMileStones} />
      </Collapse.Panel>

      <Collapse.Panel
        header='Simulation (Prevention Management)'
        key="7"
        className="site-collapse-custom-panel"
        disabled={false}
      >
        <Simulation isNotErmOrErmSupervisor={isNotErmOrErmSupervisor} handleUpdateSimulation={handleUpdateSimulation} currentElderIdentifier={currentElderIdentifier} simulationDetails={simulationDetails} />
      </Collapse.Panel>

      <Collapse.Panel
        header='Health Profile'
        key="8"
        className="site-collapse-custom-panel"
        disabled={false}
      >
        <HealthProfile isNotErmOrErmSupervisor={isNotErmOrErmSupervisor} healthProfileDetails={healthProfileDetails} />
      </Collapse.Panel>

      <Collapse.Panel
        header='CGHS Details'
        key="9"
        className="site-collapse-custom-panel"
        disabled={false}
      >
        <CghsDetails isNotErmOrErmSupervisor={isNotErmOrErmSupervisor} handleUpdateCGHS={handleUpdateCGHS} cghsDetails={cghsDetails} currentElderIdentifier={currentElderIdentifier} elderRelationShipDetails={elderRelationShipDetails} />
      </Collapse.Panel>
    </Collapse>
  );
}

OpsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleGetOperationDetails: PropTypes.func,
  operationDetails: PropTypes.object,
  handleUpdateOperationTabDetails: PropTypes.func,
  handleUpdateNokCollapseDetails: PropTypes.func,
  handleUpdateSocialAspectsDetails: PropTypes.func,
  handleUpdateEmergencyMileStones: PropTypes.func,
  handleUpdateSimulation: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  initialisedPlan: fetchInitialisedPlan(),
  loading: fetchLoading(),
  operationDetails: makeSelectOperationDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getPlansRequest: currentElderIdentifier => dispatch(getPlansRequest(currentElderIdentifier)),
    updateOpsDetailsRequest: (
      id,
      payload
    ) => dispatch(updateOpsDetailsRequest({
      id,
      payload
    })),
    handleGetOperationDetails: (params) => dispatch(getOperationDetails(params)),
    handleUpdateOperationTabDetails: (params) => dispatch(updateOperationTabDetails(params)),
    handleUpdateTcCollapseDetails: (params) => dispatch(updateTcCollapseDetails(params)),
    handleUpdateNokCollapseDetails: (params) => dispatch(updateNokCollapseDetails(params)),
    handleUpdateSocialAspectsDetails: (params) => dispatch(updateSocialAspectsDetails(params)),
    handleUpdateEmergencyMileStones: params => dispatch(updateEmergencyMileStones(params)),
    handleUpdateSimulation: params => dispatch(updateSimulation(params)),
    handleUpdateCGHS: params => dispatch(updateCGHS(params)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
)(OpsContainer);

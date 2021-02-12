/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/no-cycle */
/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import communityReducer from './communityReducer';
import elderReducer from './elderReducer';
import notificationReducer from './notificationReducer';
import userReducer from '../reducers/userReducer';
import demoReducer from '../../src/containers/DemoApiSaga/reducer';
import eldersReducer from '../../src/containers/Elders/reducer';
import AssignErmElder from '../../src/containers/AssignErmElder/reducer';
import myEldersReducer from '../../src/containers/MyElders/reducer';
import dataManagerUnAssignedElderReducer from '../../src/containers/DataManagerUnAssignedElder/reducer';
import dataManagerUnAssignedElderPlanPageReducer from '../../src/containers/DataManagerUnAssignedElderPlanPage/reducer';
import opsContainerReducer from '../../src/containers/OpsContainer/reducer';
import socialTabReducer from '../../src/containers/SocialTab/reducer';
import AntFromLoginPageReducer from '../../src/containers/AntFromLoginPage/reducer'
import PlanReportReducer from '../../src/containers/PlanReport/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */

export default combineReducers({
  user: userReducer,
  community: communityReducer,
  elder: elderReducer,
  notification: notificationReducer,
  demoApiSaga: demoReducer,
  elders: eldersReducer,
  assignErmElder: AssignErmElder,
  myElders: myEldersReducer,
  dataManagerUnAssignedElder: dataManagerUnAssignedElderReducer,
  dataManagerUnAssignedElderPlanPage: dataManagerUnAssignedElderPlanPageReducer,
  opsContainerReducer,
  antFromLoginPage: AntFromLoginPageReducer,
  socialTabReducer,
  planReport: PlanReportReducer,
});

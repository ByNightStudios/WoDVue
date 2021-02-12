/*
 *
 * OpsContainer actions
 *
 */

import {
  GET_PLANS_REQUEST,
  GET_PLANS_SUCCESS,
  GET_PLANS_FAILURE,
  GET_INITIATED_PLAN_REQUEST,
  GET_INITIATED_PLAN_SUCCESS,
  GET_INITIATED_PLAN_FAILURE,
  UPDATE_OPS_DETAILS_REQUEST,
  UPDATE_OPS_DETAILS_SUCCESS,
  UPDATE_OPS_DETAILS_FAILURE,
  GET_OPERATION_DETAILS,
  GET_OPERATION_DETAILS_SUCCESS,
  GET_OPERATION_DETAILS_FAIL,
  UPDATE_OPERATION_COLLAPSE_DETAILS,
  UPDATE_TC_COLLAPSE_DETAILS,
  UPDATE_NOK_OUTREACHED_COLLAPSE_DETAILS,
  UPDATE_SOCIAL_ASPECTS_COLLAPSE_DETAILS,
  UPDATE_EMERGENCIES_MILESTONES_COLLAPSE_DETAILS,
  UPDATE_SIMULATION_COLLAPSE_DETAILS,
  UPDATE_CGHS_COLLAPSE_DETAILS,
} from './constants';

// For get plans.
export function getPlansRequest(payload) {
  return {
    type: GET_PLANS_REQUEST,
    payload,
  };
}

export function getPlansSuccess(payload) {
  return {
    type: GET_PLANS_SUCCESS,
    payload,
  };
}

export function getPlansFailure() {
  return {
    type: GET_PLANS_FAILURE,
  };
}

// For get initiated plan.
export function getInitiatedPlanRequest(payload) {
  return {
    type: GET_INITIATED_PLAN_REQUEST,
    payload,
  };
}

export function getInitiatedPlanSuccess(payload) {
  return {
    type: GET_INITIATED_PLAN_SUCCESS,
    payload,
  };
}

export function getInitiatedPlanFailure() {
  return {
    type: GET_INITIATED_PLAN_FAILURE,
  };
}

// For update the OPS details.
export function updateOpsDetailsRequest(payload) {
  return {
    type: UPDATE_OPS_DETAILS_REQUEST,
    payload,
  };
}

export function updateOpsDetailsSuccess(payload) {
  return {
    type: UPDATE_OPS_DETAILS_SUCCESS,
    payload,
  };
}

export function updateOpsDetailsFailure() {
  return {
    type: UPDATE_OPS_DETAILS_FAILURE,
  };
}

export function getOperationDetails(params) {
  return {
    type: GET_OPERATION_DETAILS,
    params,
  };
}

export function getOperationDetailsSuccess(payload) {
  return {
    type: GET_OPERATION_DETAILS_SUCCESS,
    payload,
  };
}

export function getOperationDetailsFailure(error) {
  return {
    type: GET_OPERATION_DETAILS_FAIL,
    error,
  };
}

export function updateOperationTabDetails(params) {
  return {
    type: UPDATE_OPERATION_COLLAPSE_DETAILS,
    params,
  };
}

export function updateEmergencyMileStones(params) {
  return {
    type: UPDATE_EMERGENCIES_MILESTONES_COLLAPSE_DETAILS,
    params,
  }
}

export function updateSimulation(params) {
  return {
    type: UPDATE_SIMULATION_COLLAPSE_DETAILS,
    params,
  }
}

export function updateCGHS(params) {
  return {
    type: UPDATE_CGHS_COLLAPSE_DETAILS,
    params,
  }
}

export function updateTcCollapseDetails(params) {
  return {
    type: UPDATE_TC_COLLAPSE_DETAILS,
    params,
  };
}

export function updateNokCollapseDetails(params) {
  return {
    type: UPDATE_NOK_OUTREACHED_COLLAPSE_DETAILS,
    params,
  };
}

export function updateSocialAspectsDetails(params) {
  return {
    type: UPDATE_SOCIAL_ASPECTS_COLLAPSE_DETAILS,
    params,
  };
}

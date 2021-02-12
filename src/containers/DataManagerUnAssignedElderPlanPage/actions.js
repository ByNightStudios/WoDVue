/*
 *
 * DataManagerUnAssignedElderPlanPage actions
 *
 */

import {
  DEFAULT_ACTION,
  ELDER_DETAILS,
  ELDER_DETAILS_FAIL,
  ELDER_DETAILS_SUCCESS,
  PLAN_DETAILS,
  PLAN_DETAILS_SUCCESS,
  PLAN_DETAILS_ERROR,
  ADD_ELDER_PLAN,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function elderDetails(params) {
  return {
    type: ELDER_DETAILS,
    params,
  };
}

export function elderDetailsSuccess(payload) {
  return {
    type: ELDER_DETAILS_SUCCESS,
    payload,
  };
}

export function elderDetailsError(error) {
  return {
    type: ELDER_DETAILS_FAIL,
    error,
  };
}

export function planDetails() {
  return {
    type: PLAN_DETAILS,
  };
}

export function planDetailsSuccess(payload) {
  return {
    type: PLAN_DETAILS_SUCCESS,
    payload,
  };
}

export function planDetailsError(error) {
  return {
    type: PLAN_DETAILS_ERROR,
    error,
  };
}

export function addElderPlan(payload){
  return {
    type: ADD_ELDER_PLAN,
    payload,
  };
}

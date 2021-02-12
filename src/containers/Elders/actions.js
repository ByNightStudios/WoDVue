/*
 *
 * Elders actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_LISTING_ACTION,
  GET_LISTING_ACTION_SUCCESS,
  GET_LISTING_ACTION_FAIL,
  DELETE_ERM_MAPPING,
  QUERY_DATA,
  ERM_DATA_ERROR,
  ERM_DATA,
  ERM_DATA_SUCCESS,

  EMERGENCY_ACTION,
  ALERT_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getListing(params) {
  return {
    type: GET_LISTING_ACTION,
    params,
  };
}

export function getListingSuccess(payload) {
  return {
    type: GET_LISTING_ACTION_SUCCESS,
    payload,
  };
}

export function getListingFailure(error) {
  return {
    type: GET_LISTING_ACTION_FAIL,
    error,
  };
}

export function deleteErmMapping(payload) {
  return {
    type: DELETE_ERM_MAPPING,
    payload,
  };
}

export function getQueryData(payload) {
  return {
    type: QUERY_DATA,
    payload,
  };
}


export function ermData(){
  return {
    type: ERM_DATA,
  }
}

export function ermDataSuccess(payload){
  return {
    type: ERM_DATA_SUCCESS,
    payload,
  }
}

export function ermDataFail(error){
  return {
    type: ERM_DATA_ERROR,
    error,
  }
}

export function emergencyAction(payload) {
  return {
    type: EMERGENCY_ACTION,
    payload
  }
};

export function alertAction(payload) {
  return {
    type: ALERT_ACTION,
    payload
  }
};

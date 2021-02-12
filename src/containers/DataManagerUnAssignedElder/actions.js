/*
 *
 * DataManagerUnAssignedElder actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ELDER_LIST,
  GET_ELDER_LIST_SUCCESS,
  GET_ELDER_LIST_ERROR,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getElderList(params) {
  return {
    type: GET_ELDER_LIST,
    params,
  };
}

export function getElderListSuccess(payload) {
  return {
    type: GET_ELDER_LIST_SUCCESS,
    payload,
  };
}

export function getElderListError(error) {
  return {
    type: GET_ELDER_LIST_ERROR,
    error,
  };
}

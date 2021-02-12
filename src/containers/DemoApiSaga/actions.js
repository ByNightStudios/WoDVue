/*
 *
 * DemoApiSaga actions
 *
 */

import {
  DEFAULT_ACTION,
  DEMO_ACTION,
  DEMO_ACTION_SUCCESS,
  DEMO_ACTION_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function demoAction(params) {
  return {
    type: DEMO_ACTION,
    params,
  };
}

export function demoActionSuccess(payload) {
  return {
    type: DEMO_ACTION_SUCCESS,
    payload,
  };
}

export function demoActionFail(error) {
  return {
    type: DEMO_ACTION_FAIL,
    error,
  };
}

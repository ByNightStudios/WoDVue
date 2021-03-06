/*
 *
 * QuickStart actions
 *
 */

import {
  DEFAULT_ACTION,
  DEFAULT_ACTION_SUCCESS,
  DEFAULT_ACTION_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function defaultActionSuccess(payload) {
  return {
    type: DEFAULT_ACTION_SUCCESS,
    payload,
  };
}

export function defaultActionFail(error) {
  return {
    type: DEFAULT_ACTION_FAIL,
    error,
  };
}

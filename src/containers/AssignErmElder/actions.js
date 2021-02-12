/*
 *
 * AssignErmElder actions
 *
 */

import { DEFAULT_ACTION, SET_ERM } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function setErm(payload) {
  return {
    type: SET_ERM,
    payload,
  };
}

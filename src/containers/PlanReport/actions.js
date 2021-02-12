/*
 *
 * PlanReport actions
 *
 */

import { DEFAULT_ACTION, DEFAULT_ACTION_ERROR, DEFAULT_ACTION_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function reportError(error){
  return {
    type: DEFAULT_ACTION_ERROR,
    error
  }
}

export function reportSuccess(){
  return {
    type: DEFAULT_ACTION_SUCCESS,
  }
}

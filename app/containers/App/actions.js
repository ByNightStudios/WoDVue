/*
 *
 * App actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_DATA,
  DATA_SUCCESS,
  DATA_ERROR,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const getData = () => ({
  type: GET_DATA,
});

export const getDataSuccess = payload => ({
  type: DATA_SUCCESS,
  payload,
});

export const dataError = error => ({
  type: DATA_ERROR,
  error,
});

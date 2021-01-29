/*
 *
 * Disciplines actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_DISCIPLINES,
  DISCIPLINES_DATA_FAIL,
  DISCIPLINES_DATA_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const getDisciplines = () => ({
  type: GET_DISCIPLINES,
});

export const disciplinesSuccess = payload => ({
  type: DISCIPLINES_DATA_SUCCESS,
  payload,
});

export const disciplinesError = error => ({
  type: DISCIPLINES_DATA_FAIL,
  error,
});

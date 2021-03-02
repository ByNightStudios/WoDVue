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
  DISCIPLINES_DATA,
  DISCIPLINES_DATA_SUCCESS,
  CLANS_DATA_SUCCESS,
  FLAWS_DATA_SUCCESS,
  MERITS_DATA_SUCCESS,
  ATTRIBUTE_DATA_SUCCESS,
  BACKGROUND_DATA_SUCCESS,
  SKILLS_DATA_SUCCESS,
  TECHNIQUES_DATA_SUCCESS,
  RITUALS_DATA_SUCCESS,
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

export const DataError = error => ({
  type: DATA_ERROR,
  error,
});

export const disciplineData = payload => ({
  type: DISCIPLINES_DATA,
  payload,
});

export const disciplineDataSuccess = payload => ({
  type: DISCIPLINES_DATA_SUCCESS,
  payload,
});

export const clanDataSuccess = payload => ({
  type: CLANS_DATA_SUCCESS,
  payload,
});

export const flawsDataSuccess = payload => ({
  type: FLAWS_DATA_SUCCESS,
  payload,
});

export const meritsDataSuccess = payload => ({
  type: MERITS_DATA_SUCCESS,
  payload,
});

export const attributeDataSuccess = payload => ({
  type: ATTRIBUTE_DATA_SUCCESS,
  payload,
});

export const backgroundDataSuccess = payload => ({
  type: BACKGROUND_DATA_SUCCESS,
  payload,
});

export const skillDataSuccess = payload => ({
  type: SKILLS_DATA_SUCCESS,
  payload,
});

export const techniquesDataSuccess = payload => ({
  type: TECHNIQUES_DATA_SUCCESS,
  payload,
});

export const ritualDataSuccess = payload => ({
  type: RITUALS_DATA_SUCCESS,
  payload,
});

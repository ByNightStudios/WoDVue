/*
 *
 * SocialTab actions
 *
 */

import {
  GET_SOCIAL_DATA_START,
  GET_SOCIAL_DATA_SUCCESS,
  GET_SOCIAL_DATA_FAILURE,

  POST_ELDER_PERSONA_START,
  POST_ELDER_PERSONA_SUCCESS,
  POST_ELDER_PERSONA_FAILURE,

  POST_EDU_QUAL_START,
  POST_EDU_QUAL_SUCCESS,
  POST_EDU_QUAL_FAILURE,

  POST_EMPLOYMENT_START,
  POST_EMPLOYMENT_SUCCESS,
  POST_EMPLOYMENT_FAILURE,

  POST_LOCATION_START,
  POST_LOCATION_SUCCESS,
  POST_LOCATION_FAILURE,

  POST_PREFERENCES_START,
  POST_PREFERENCES_SUCCESS,
  POST_PREFERENCES_FAILURE,
} from './constants';

/* Get Social Data Start */
export function getSocialDataStart(payload) {
  return {
    type: GET_SOCIAL_DATA_START,
    payload
  };
};

export function getSocialDataSuccess(payload) {
  return {
    type: GET_SOCIAL_DATA_SUCCESS,
    payload
  };
};

export function getSocialDataFailure() {
  return {
    type: GET_SOCIAL_DATA_FAILURE
  };
};
/* Get Social Data End */

/* Post Elder Persona Start */
export function postElderPersonaStart(payload) {
  return {
    type: POST_ELDER_PERSONA_START,
    payload
  };
};

export function postElderPersonaSuccess(payload) {
  return {
    type: POST_ELDER_PERSONA_SUCCESS,
    payload
  };
};

export function postElderPersonaFailure() {
  return {
    type: POST_ELDER_PERSONA_FAILURE
  };
};
/* Post Elder Persona End */

/* Post Educational Qualification Start */
export function postEduQualStart(payload) {
  return {
    type: POST_EDU_QUAL_START,
    payload
  };
};

export function postEduQualSuccess(payload) {
  return {
    type: POST_EDU_QUAL_SUCCESS,
    payload
  };
};

export function postEduQualFailure() {
  return {
    type: POST_EDU_QUAL_FAILURE
  };
};
/* Post Educational Qualification End */

/* Post Employment Start */
export function postEmploymentStart(payload) {
  return {
    type: POST_EMPLOYMENT_START,
    payload
  };
};

export function postEmploymentSuccess(payload) {
  return {
    type: POST_EMPLOYMENT_SUCCESS,
    payload
  };
};

export function postEmploymentFailure() {
  return {
    type: POST_EMPLOYMENT_FAILURE
  };
};
/* Post Employment End */

/* Post Location Start */
export function postLocationStart(payload) {
  return {
    type: POST_LOCATION_START,
    payload
  };
};

export function postLocationSuccess(payload) {
  return {
    type: POST_LOCATION_SUCCESS,
    payload
  };
};

export function postLocationFailure() {
  return {
    type: POST_LOCATION_FAILURE
  };
};
/* Post Location End */

/* Post Preferences Start */
export function postPreferencesStart(payload) {
  return {
    type: POST_PREFERENCES_START,
    payload
  };
};

export function postPreferencesSuccess(payload) {
  return {
    type: POST_PREFERENCES_SUCCESS,
    payload
  };
};

export function postPreferencesFailure() {
  return {
    type: POST_PREFERENCES_FAILURE
  };
};
/* Post Preferences End */

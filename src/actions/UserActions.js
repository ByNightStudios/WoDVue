import { createTrue } from 'typescript';
import {
  UPDATE_USER_STATUS_URL,
  UPDATE_USER_BRIEFING_STATUS_URL,
  UPDATE_USER_NOK_STATUS_URL,
  ANALYTICS,
  USER_MEDICAL_RECORD,
  ZOHOSYNC,
  UPDATE_WELCOME_PACK_STATUS_URL,
  UPDATE_PRIMARY_ELDER_STATUS_URL,
  GET_ANALYTCS,
} from '../common/backendConstants';

export const updateUserStatus = (user_id, is_active) => (
  dispatch,
  getState,
  { api },
) => {
  const url = UPDATE_USER_STATUS_URL.replace(':user_uuid', user_id);
  return api
    .put(url, {
      is_active,
    })
    .then(response => response)
    .catch(error => {
      throw error.response.data;
    });
};
export const updateElderBriefingStatus = (
  user_id,
  is_active_edlder_briefing,
) => (dispatch, getState, { api }) => {
  const url = UPDATE_USER_BRIEFING_STATUS_URL.replace(':user_uuid', user_id);
  return api
    .put(url, {
      elder_briefing: is_active_edlder_briefing,
    })
    .then(response => response)
    .catch(error => {
      throw error.response.data;
    });
};
export const updateElderNokStatus = (user_id, is_active_edlder_nok) => (
  dispatch,
  getState,
  { api },
) => {
  const url = UPDATE_USER_NOK_STATUS_URL.replace(':user_uuid', user_id);
  return api
    .put(url, {
      nok_briefing: is_active_edlder_nok,
    })
    .then(response => response)
    .catch(error => {
      throw error.response.data;
    });
};

export const updateWelcomePackStatus = (user_id, is_active_welcome_pack) => (
  dispatch,
  getState,
  { api },
) => {
  const url = UPDATE_WELCOME_PACK_STATUS_URL.replace(':user_uuid', user_id);
  return api
    .put(url, {
      welcome_pack: is_active_welcome_pack,
    })
    .then(response => response)
    .catch(error => {
      throw error.response.data;
    });
};

export const updatePrimaryElderStatus = payload => (
  dispatch,
  getState,
  { api },
) => {
  const url = UPDATE_PRIMARY_ELDER_STATUS_URL.replace(
    ':user_uuid',
    payload.user_id,
  );
  return api
    .put(url, {
      id: payload.user_id,
      is_real_elder: true,
    })
    .then(response => response)
    .catch(error => {
      throw error.response.data;
    });
};

export const getUserMedicalData = user_id => (dispatch, getState, { api }) => {
  const url = USER_MEDICAL_RECORD.replace(':user_uuid', user_id);
  return api
    .get(url)
    .then(response => response)
    .catch(error => {
      throw error.response.data;
    });
};

export const analytics = () => (dispatch, getState, { api }) =>
  api
    .get(ANALYTICS)
    .then(response => {
      dispatch({
        type: GET_ANALYTCS,
        payload: response,
      });
      return response;
    })
    .catch(error => {
      throw error;
    });

export const zohoSync = () => (dispatch, getState, { api }) =>
  api
    .get(ZOHOSYNC)
    .then(response => response)
    .catch(error => {
      throw error;
    });

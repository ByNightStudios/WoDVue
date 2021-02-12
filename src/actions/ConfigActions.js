import {
  STATES_URL,
  COUNTRY_CODES_URL,
  RESPONDER_CONFIG_URL
} from '../common/backendConstants';

export const getStatesList = () => (dispatch, getState, { api }) => {
  return api
    .get(STATES_URL)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const getCountryCodesList = (include = '') => (
  dispatch,
  getState,
  { api }
) => {
  let url = COUNTRY_CODES_URL.concat(',').concat(include);
  return api
    .get(url)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const getResponderConfig = (include = '') => (
  dispatch,
  getState,
  { api }
) => {
  let url = RESPONDER_CONFIG_URL.concat(',').concat(include);
  return api
    .get(url)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error.response.data;
    });
};

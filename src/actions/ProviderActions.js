import {
  PROVIDER_LIST_URL,
  ADD_NEW_PROVIDER_URL,
  UPDATE_PROVIDER_URL,
  PROVIDER_LIST_TYPE_URL
} from '../common/backendConstants';

export const providerList = (page = 1, query = '') => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .get(`${PROVIDER_LIST_URL}?page=${page - 1}&search=${query}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error;
    });
};

export const providerTypeList = (query = '') => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .get(`${PROVIDER_LIST_TYPE_URL}&query=${query}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error;
    });
};

export const updateProvider = (provider_id, details) => (
  dispatch,
  getState,
  { api }
) => {
  let url = UPDATE_PROVIDER_URL.replace(':provider_id', provider_id);
  return api
    .put(url, details)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const addProvider = details => (dispatch, getState, { api }) => {
  return api
    .post(ADD_NEW_PROVIDER_URL, details)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error.response.data;
    });
};

import {
  CONSUMER_LIST_URL,
  UPDATE_ELDER_ADDRESS_URL,
  ADD_NEW_ELDER_ADDRESS_URL,
} from '../common/backendConstants';

export const consumerList = (page = 1, query = '') => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .get(`${CONSUMER_LIST_URL}&page=${page}&query=${query}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const addConsumer = (admin_id, payload) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .post(`/admin/${admin_id}/users`, {
      user_type: 3,
      source: 'Admin',
      ...payload,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateConsumer = (
  admin_id,
  consumer_id,
  {
    first_name,
    last_name,
    mobile_number,
    gender,
    dob,
    blood_group,
    emergency_contact_name,
    emergency_contact_number,
    country_code,
    emergency_country_code,
    formatted_mobile_number,
    formatted_emergency_contact_number,
  }
) => (dispatch, getState, { api }) => {
  return api
    .put(`/admin/${admin_id}/users/${consumer_id}`, {
      user_type: 3,
      first_name,
      last_name,
      mobile_number,
      gender,
      dob,
      blood_group,
      emergency_contact_name,
      emergency_contact_number,
      country_code,
      emergency_country_code,
      formatted_mobile_number,
      formatted_emergency_contact_number,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateConsumerAddress = (
  admin_id,
  consumer_id,
  address_uuid,
  {
    address_line_1,
    address_line_2,
    city,
    state,
    country,
    geo_latitude,
    geo_longitude,
  }
) => (dispatch, getState, { api }) => {
  let url = UPDATE_ELDER_ADDRESS_URL.replace(':admin_uuid', admin_id);
  url = url.replace(':consumer_uuid', consumer_id);
  url = url.replace(':address_uuid', address_uuid);
  return api
    .put(url, {
      address_line_1,
      address_line_2,
      city,
      state,
      geo_latitude,
      geo_longitude,
      country,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const addNewConsumerAddress = (admin_id, consumer_id, details) => (
  dispatch,
  getState,
  { api }
) => {
  let url = ADD_NEW_ELDER_ADDRESS_URL.replace(':admin_uuid', admin_id);
  url = url.replace(':consumer_uuid', consumer_id);
  return api
    .post(url, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

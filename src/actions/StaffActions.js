import { STAFFLISTURL } from '../common/backendConstants';

export const staffList = (page = 1, query = '') => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .get(`${STAFFLISTURL}&page=${page}&query=${query}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const updateStaff = (admin_id, consumer_id, details) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .put(`/admin/${admin_id}/users/admin/${consumer_id}`, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const addStaff = (admin_id, details) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .post(`/admin/${admin_id}/users/admin`, {
      user_type: 1,
      first_name: details.first_name,
      last_name: details.last_name,
      mobile_number: details.mobile_number,
      email: details.email,
      password: details.password,
      country_code: details.country_code,
      role_id: details.role_id,
      languages: details.languages,
      other_language: details.other_language,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

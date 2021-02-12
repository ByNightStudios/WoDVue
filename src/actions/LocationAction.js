import {
  GET_STATES,
  GET_COUNTRIES,
  GET_CITIES
} from "../common/backendConstants";

export const getCountries = () => (dispatch, getState, { api }) => {
  return api
    .get(GET_COUNTRIES)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const getStates = (country) => (dispatch, getState, { api }) => {
  return api
    .get(GET_STATES.replace(':country',country))
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const getCities = (state) => (dispatch, getState, { api }) => {
    return api
      .get(GET_CITIES.replace(':state',state))
      .then(response => {
        return response;
      })
      .catch(error => {
        throw error.response.data;
      });
  };
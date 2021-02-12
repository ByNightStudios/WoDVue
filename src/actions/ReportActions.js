import {
  GENERATE_REPORT_URL,
  GENERATE_RESPONDER_REPORT_URL
} from '../common/backendConstants';

export const generateNewReport = dataPayload => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .post(GENERATE_REPORT_URL, dataPayload)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const generateResponderReport = () => (dispatch, getState, { api }) => {
  return api
    .get(GENERATE_RESPONDER_REPORT_URL)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error.response.data;
    });
};

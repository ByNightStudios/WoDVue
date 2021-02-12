import {
  ADMINLOGIN,
  ADMINLOGINURL,
  ADMINPERMISSION,
  ADMINPROFILE,
} from '../common/backendConstants';

export const adminLogin = ({ email, password }) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .post(ADMINLOGINURL, {
      email,
      password,
    })
    .then((response) => {
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.access_token}`;

      dispatch({
        type: ADMINLOGIN,
        payload: { user: response },
      });
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateAdminPermissions = (dataPayload) => (
  dispatch,
  getState,
  { api }
) => {
  dispatch({
    type: ADMINPERMISSION,
    payload: dataPayload,
  });
};

export const updateAdminProfile = (dataPayload) => (
  dispatch,
  getState,
  { api }
) => {
  dispatch({
    type: ADMINPROFILE,
    payload: dataPayload,
  });
};

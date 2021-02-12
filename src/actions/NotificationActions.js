import {
  ADDNOTIFICATION,
  READNOTIFICATIONS,
  FETCHNOTIFICATION,
  RESETNOTIFICATIONS,
} from '../common/backendConstants';

export const fetchNotifications = (payload) => (dispatch) => {
  dispatch({
    type: FETCHNOTIFICATION,
    payload,
  });
};

export const addNotification = (payload) => (dispatch) => {
  dispatch({
    type: ADDNOTIFICATION,
    payload,
  });
};

export const readNotifications = () => (dispatch) => {
  dispatch({
    type: READNOTIFICATIONS,
    payload: [],
  });
};

export const resetNotifications = () => (dispatch) => {
  dispatch({
    type: RESETNOTIFICATIONS,
    payload: [],
  });
};

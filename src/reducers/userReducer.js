import get from 'lodash/get';
import {
  ADMINLOGIN,
  ADMINPERMISSION,
  ADMINPROFILE,
  GET_ANALYTCS,
} from '../common/backendConstants';
import { axiosInstance } from '../store/store';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADMINLOGIN:
      return {
        ...state,
        user: action.payload.user.data,
        is_logged_in: true,
      };

    case ADMINPERMISSION:
      return {
        ...state,
        user: { ...state.user, ...get(action, 'payload', {}) },
      };

    case ADMINPROFILE: {
      return {
        ...state,
        user: {
          ...state.user,

          ...get(action, 'payload', {}),
        },
      };
    }

    case GET_ANALYTCS:
      return {
        ...state,
        user: {
          ...state.user,
          analytics_data: { ...get(action, 'payload.data', {}) },
        },
      };

    case 'persist/REHYDRATE':
      // Check if Payload Exists
      if (action.payload) {
        // Check if Payload Contains User Key
        if (action.payload.user) {
          // Check if User Key Has Own Property Value
          if (action.payload.user.hasOwnProperty('user')) {
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${
              action.payload.user.user.access_token
            }`;
          }
        }
      }
      return state;

    default:
      return state;
  }
}

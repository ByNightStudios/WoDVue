/*
 *
 * Elders reducer
 *
 */
import produce from 'immer';
import get from 'lodash';

import {
  GET_LISTING_ACTION,
  GET_LISTING_ACTION_SUCCESS,
  GET_LISTING_ACTION_FAIL,
  ERM_DATA,
  ERM_DATA_SUCCESS,
  ERM_DATA_ERROR,
} from './constants';

export const initialState = {
  data: {},
  loading: false,
  error: null,
  erm: {
    data: [],
    loading: false,
    error: null,
  }
};

/* eslint-disable default-case, no-param-reassign */
const eldersReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_LISTING_ACTION:
        draft.loading = true;
        break;
      case GET_LISTING_ACTION_SUCCESS:
        const data = action.payload.data;

        draft.loading = false;
        draft.data = data ? { ...data } : { ...state.data };
        break;
      case GET_LISTING_ACTION_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      case ERM_DATA:
        draft.erm.loading = true;
        break;
      case ERM_DATA_SUCCESS:
        draft.erm.loading = false;
        draft.erm.data = action.payload;
        break;
      case ERM_DATA_ERROR:
        draft.erm.loading = false;
        draft.erm.error = action.error;
        break;
    }
  });

export default eldersReducer;

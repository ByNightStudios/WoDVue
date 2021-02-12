/*
 *
 * Elders reducer
 *
 */
import produce from 'immer';
import {
  GET_LISTING_ACTION,
  GET_LISTING_ACTION_SUCCESS,
  GET_LISTING_ACTION_FAIL,
  ERM_DATA,
  ERM_DATA_SUCCESS,
  ERM_DATA_ERROR,
} from './constants';

export const initialState = {
  data: [],
  loading: false,
  error: null,
  ermData: {
    data: [],
    loading: false,
  }
};

/* eslint-disable default-case, no-param-reassign */
const myEldersReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_LISTING_ACTION:
        draft.loading = true;
        break;
      case GET_LISTING_ACTION_SUCCESS:
        const { payload } = action;

        draft.loading = false;
        draft.data = payload ? { ...payload } : { ...state.data };
        break;
      case GET_LISTING_ACTION_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      case ERM_DATA:
        draft.ermData.loading = true;
        break;
      case ERM_DATA_SUCCESS:
        draft.ermData.loading = false;
        draft.ermData.data = action.payload;
        break;
      case ERM_DATA_ERROR:
        draft.ermData.loading = false;
        draft.ermData.error = action.error;
        break;
    }
  });

export default myEldersReducer;

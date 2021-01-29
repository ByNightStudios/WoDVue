/*
 *
 * Disciplines reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  GET_DISCIPLINES,
  DISCIPLINES_DATA_SUCCESS,
  DISCIPLINES_DATA_FAIL,
} from './constants';

export const initialState = {
  loading: false,
  data: [],
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const disciplinesReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_DISCIPLINES:
        draft.loading = true;
        break;
      case DISCIPLINES_DATA_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        break;
      case DISCIPLINES_DATA_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default disciplinesReducer;

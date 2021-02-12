/*
 *
 * DataManagerUnAssignedElder reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  GET_ELDER_LIST,
  GET_ELDER_LIST_ERROR,
  GET_ELDER_LIST_SUCCESS,
} from './constants';

export const initialState = {
  error: false,
  data: [],
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
const dataManagerUnAssignedElderReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_ELDER_LIST:
        draft.loading = true;
        draft.error = false;
        break;
      case GET_ELDER_LIST_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        break;
      case GET_ELDER_LIST_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default dataManagerUnAssignedElderReducer;

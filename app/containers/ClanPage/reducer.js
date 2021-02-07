/*
 *
 * ClanPage reducer
 *
 */
import produce from 'immer';
import {
  GET_DROP_DOWN_ITEMS,
  DROP_DOWN_ITEMS_ERROR,
  DROP_DOWN_ITEMS_SUCCESS,
  DISCIPLINES_DATA_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  data: [],
  error: false,
  tech: {},
};

/* eslint-disable default-case, no-param-reassign */
const clanPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_DROP_DOWN_ITEMS:
        draft.loading = true;
        break;
      case DROP_DOWN_ITEMS_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        break;
      case DROP_DOWN_ITEMS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
      case DISCIPLINES_DATA_SUCCESS:
        draft.tech = action.payload;
        break;
    }
  });

export default clanPageReducer;

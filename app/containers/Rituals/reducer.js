/*
 *
 * ClanPage reducer
 *
 */
import produce from 'immer';
import { concat } from 'lodash';
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
  skip: 0,
  limit: 100,
  hasMore: true,
};

/* eslint-disable default-case, no-param-reassign */
const clanPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_DROP_DOWN_ITEMS:
        draft.loading = true;
        break;
      case DROP_DOWN_ITEMS_SUCCESS:
        if (action.payload.length < 100) {
          draft.hasMore = false;
          draft.loading = false;
        }
        draft.data = concat(state.data, action.payload);
        draft.skip += draft.limit;
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

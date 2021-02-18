/*
 *
 * App reducer
 *
 */
import produce from 'immer';
import { concat } from 'lodash';
import { act } from 'react-testing-library';
import {
  DEFAULT_ACTION,
  DISCIPLINES_DATA_SUCCESS,
  CLANS_DATA_SUCCESS,
  FLAWS_DATA_SUCCESS,
  MERITS_DATA_SUCCESS,
  ATTRIBUTE_DATA_SUCCESS,
} from './constants';

export const initialState = {
  disciplines: {
    loading: false,
    data: [],
    error: false,
    skip: 0,
    limit: 100,
    hasMore: true,
  },
  clans: {
    loading: false,
    data: [],
    error: false,
    skip: 0,
    limit: 100,
    hasMore: true,
  },
  flaws: {
    data: [],
  },
  merits: {
    data: [],
  },
  attributes: {
    data: [],
  },
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case DISCIPLINES_DATA_SUCCESS:
        if (action.payload.length < 100) {
          draft.disciplines.hasMore = false;
          draft.disciplines.loading = false;
        }
        draft.disciplines.data = concat(state.disciplines.data, action.payload);
        draft.disciplines.skip += draft.disciplines.limit;
        break;
      case CLANS_DATA_SUCCESS:
        if (action.payload.length < 100) {
          draft.clans.hasMore = false;
          draft.clans.loading = false;
        }
        draft.clans.data = concat(state.clans.data, action.payload);
        draft.clans.skip += draft.clans.limit;
        break;
      case FLAWS_DATA_SUCCESS:
        draft.flaws.data = action.payload;
        break;
      case MERITS_DATA_SUCCESS:
        draft.merits.data = action.payload;
        break;
      case ATTRIBUTE_DATA_SUCCESS:
        draft.attributes.data = action.payload;
        break;
    }
  });

export default appReducer;

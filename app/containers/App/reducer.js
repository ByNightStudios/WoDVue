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
  BACKGROUND_DATA_SUCCESS,
  SKILLS_DATA_SUCCESS,
  TECHNIQUES_DATA_SUCCESS,
  RITUALS_DATA_SUCCESS,
  DATA_SUCCESS,
} from './constants';

export const initialState = {
  appData: {
    loading: false,
    data: [],
    error: false,
    skip: 0,
    limit: 100,
    hasMore: true,
  },
  disciplines: {
    data: [],
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
  backgrounds: {
    data: [],
  },
  skills: {
    data: [],
  },
  techniques: {
    data: [],
  },
  rituals: {
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
      case DATA_SUCCESS:
        if (action.payload.length < 100) {
          draft.appData.hasMore = false;
          draft.appData.loading = false;
        }
        draft.appData.data = concat(state.appData.data, action.payload);
        draft.appData.skip += draft.appData.limit;
        break;
      case CLANS_DATA_SUCCESS:
        draft.clans.data = action.payload;
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
      case BACKGROUND_DATA_SUCCESS:
        draft.backgrounds.data = action.payload;
        break;
      case SKILLS_DATA_SUCCESS:
        draft.skills.data = action.payload;
        break;
      case TECHNIQUES_DATA_SUCCESS:
        draft.techniques.data = action.payload;
        break;
      case RITUALS_DATA_SUCCESS:
        draft.rituals.data = action.payload;
        break;
    }
  });

export default appReducer;

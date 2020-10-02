/*
 *
 * App reducer
 *
 */
import produce from 'immer';
import { concat } from 'lodash';
import { GET_DATA, DATA_SUCCESS, DATA_ERROR } from 'containers/App/constants';

export const initialState = {
  contentful: {
    loading: false,
    data: [],
    error: false,
    hasMore: true,
    limit: 100,
    skip: 0,
  },
};

/* eslint-disable default-case, no-param-reassign */
const homePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_DATA:
        draft.contentful.loading = true;
        break;
      case DATA_SUCCESS:
        if (action.payload.length < 100) {
          draft.contentful.hasMore = false;
          draft.contentful.loading = false;
        }
        draft.contentful.data = concat(state.contentful.data, action.payload);
        draft.contentful.skip += draft.contentful.limit;
        break;
      case DATA_ERROR:
        draft.contentful.error = action.error;
        break;
    }
  });

export default homePageReducer;

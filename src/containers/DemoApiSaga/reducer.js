/*
 *
 * DemoApiSaga reducer
 *
 */
import produce from 'immer';
import {
  DEMO_ACTION_SUCCESS,
  DEMO_ACTION_FAIL,
  DEMO_ACTION,
} from './constants';

export const initialState = {
  demo: {},
  loading: false,
  error: null,
};

/* eslint-disable default-case, no-param-reassign */
const demoApiSagaReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEMO_ACTION:
        draft.loading = true;
        break;
      case DEMO_ACTION_SUCCESS:
        draft.loading = false;
        draft.demo = action.payload;
        break;
      case DEMO_ACTION_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default demoApiSagaReducer;

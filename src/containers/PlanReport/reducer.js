/*
 *
 * PlanReport reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, DEFAULT_ACTION_SUCCESS, DEFAULT_ACTION_ERROR } from './constants';

export const initialState = {
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
const planReportReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        draft.loading = true;
        break;

      case DEFAULT_ACTION_SUCCESS:
        draft.loading = false;
        break;

      case DEFAULT_ACTION_ERROR:
        draft.loading = false;
        break;
    }
  });

export default planReportReducer;

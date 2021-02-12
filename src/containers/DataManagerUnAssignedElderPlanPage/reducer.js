/*
 *
 * DataManagerUnAssignedElderPlanPage reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  PLAN_DETAILS,
  PLAN_DETAILS_SUCCESS,
  PLAN_DETAILS_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  data: [],
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const dataManagerUnAssignedElderPlanPageReducer = (
  state = initialState,
  action,
) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case PLAN_DETAILS:
        draft.loading = false;
        break;
      case PLAN_DETAILS_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        break;
      case PLAN_DETAILS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default dataManagerUnAssignedElderPlanPageReducer;

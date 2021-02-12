/*
 *
 * OpsContainer reducer
 *
 */
import produce from 'immer';
import {
  GET_PLANS_REQUEST,
  GET_PLANS_SUCCESS,
  GET_PLANS_FAILURE,

  GET_INITIATED_PLAN_SUCCESS,
  GET_INITIATED_PLAN_FAILURE,

  UPDATE_OPS_DETAILS_REQUEST,
  UPDATE_OPS_DETAILS_SUCCESS,
  UPDATE_OPS_DETAILS_FAILURE,

  GET_OPERATION_DETAILS,
  GET_OPERATION_DETAILS_SUCCESS,
  GET_OPERATION_DETAILS_FAIL,
} from './constants';

export const initialState = {
  plans: null,
  initialisedPlan: null,
  loading: false,
  isUpdating: false,
  operations: {
    loading: false,
    data: {},
    error: false,
  }
};

/* eslint-disable default-case, no-param-reassign */
const opsContainerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_PLANS_REQUEST:
        draft.loading = true;
        break;

      case GET_PLANS_SUCCESS:
        draft.plans = action.payload;
        break;

      case GET_PLANS_FAILURE:
        draft.loading = false;
        break;

      case GET_INITIATED_PLAN_SUCCESS:
      case UPDATE_OPS_DETAILS_SUCCESS:
        draft.loading = false;
        draft.isUpdating = false;
        draft.initialisedPlan = action.payload;
        break;

      case GET_INITIATED_PLAN_FAILURE:
        draft.loading = false;
        break;

      case UPDATE_OPS_DETAILS_REQUEST:
        draft.isUpdating = true;
        break;

      case UPDATE_OPS_DETAILS_FAILURE:
        draft.isUpdating = false;
        break;

      case GET_OPERATION_DETAILS:
        draft.operations.loading = true;
        break;

      case GET_OPERATION_DETAILS_SUCCESS:
        draft.operations.loading = false;
        draft.operations.data = action.payload;
        break;

      case GET_OPERATION_DETAILS_FAIL:
        draft.operations.loading = false;
        draft.operations.error = action.error;
        break;
    }
  });

export default opsContainerReducer;

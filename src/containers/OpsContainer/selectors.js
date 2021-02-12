import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the opsContainer state domain
 */

const selectOpsContainerDomain = state =>
  state.opsContainerReducer || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OpsContainer
 */

const makeSelectOpsContainer = () =>
  createSelector(
    selectOpsContainerDomain,
    substate => substate,
  );

const fetchInitialisedPlan = () =>
  createSelector(
    selectOpsContainerDomain,
    substate => substate.initialisedPlan,
  );

const fetchLoading = () =>
  createSelector(
    selectOpsContainerDomain,
    substate => {
      return {
        isLoading: substate.loading,
        isUpdating: substate.isUpdating,
      };
    },
  );

  const makeSelectOperationDetails = () =>
  createSelector(
    selectOpsContainerDomain,
    substate => substate.operations.data,
  );

export default makeSelectOpsContainer;
export { selectOpsContainerDomain, fetchInitialisedPlan, fetchLoading, makeSelectOperationDetails };

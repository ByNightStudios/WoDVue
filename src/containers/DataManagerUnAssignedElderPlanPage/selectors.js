import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dataManagerUnAssignedElderPlanPage state domain
 */

const selectDataManagerUnAssignedElderPlanPageDomain = state => state.dataManagerUnAssignedElderPlanPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DataManagerUnAssignedElderPlanPage
 */

const makeSelectDataManagerUnAssignedElderPlanPage = () =>
  createSelector(selectDataManagerUnAssignedElderPlanPageDomain, substate => substate);

export default makeSelectDataManagerUnAssignedElderPlanPage;
export { selectDataManagerUnAssignedElderPlanPageDomain };

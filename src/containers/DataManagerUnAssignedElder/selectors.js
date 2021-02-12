import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dataManagerUnAssignedElder state domain
 */

const selectDataManagerUnAssignedElderDomain = state => state.dataManagerUnAssignedElder || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DataManagerUnAssignedElder
 */

const makeSelectDataManagerUnAssignedElder = () =>
  createSelector(selectDataManagerUnAssignedElderDomain, substate => substate);

export default makeSelectDataManagerUnAssignedElder;
export { selectDataManagerUnAssignedElderDomain };

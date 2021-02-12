import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the assignErmElder state domain
 */

const selectAssignErmElderDomain = state => state.assignErmElder || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AssignErmElder
 */

const makeSelectAssignErmElder = () =>
  createSelector(selectAssignErmElderDomain, substate => substate);

export default makeSelectAssignErmElder;
export { selectAssignErmElderDomain };

import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the myElders state domain
 */

const selectMyEldersDomain = state => state.myElders || initialState;
const user = state => state.user.user;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MyElders
 */

const makeSelectMyElders = () =>
  createSelector(
    selectMyEldersDomain,
    substate => substate,
  );

const userInfo = () =>
  createSelector(
    user,
    substate => substate,
  );

export default makeSelectMyElders;
export { selectMyEldersDomain, userInfo };

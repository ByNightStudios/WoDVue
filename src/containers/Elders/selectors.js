import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the elders state domain
 */

const selectEldersDomain = state => state.elders || initialState;
const user = state => state.user.user;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Elders
 */

const makeSelectElders = () =>
  createSelector(
    selectEldersDomain,
    substate => substate,
  );

const userInfo = () =>
  createSelector(
    user,
    substate => substate,
  );

export default makeSelectElders;
export { selectEldersDomain, userInfo };

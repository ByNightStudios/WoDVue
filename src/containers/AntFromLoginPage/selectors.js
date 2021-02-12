import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the antFromLoginPage state domain
 */

const selectAntFromLoginPageDomain = state => state.antFromLoginPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AntFromLoginPage
 */

const makeSelectAntFromLoginPage = () =>
  createSelector(selectAntFromLoginPageDomain, substate => substate);

export default makeSelectAntFromLoginPage;
export { selectAntFromLoginPageDomain };

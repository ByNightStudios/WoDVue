import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the woVueHomePage state domain
 */

const selectWoVueHomePageDomain = state => state.woVueHomePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by WoVueHomePage
 */

const makeSelectWoVueHomePage = () =>
  createSelector(
    selectWoVueHomePageDomain,
    substate => substate,
  );

export default makeSelectWoVueHomePage;
export { selectWoVueHomePageDomain };

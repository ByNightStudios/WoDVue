import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the quickStart state domain
 */

const selectQuickStartDomain = state => state.quickStart || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by QuickStart
 */

const makeSelectQuickStart = () =>
  createSelector(
    selectQuickStartDomain,
    substate => substate,
  );

export default makeSelectQuickStart;
export { selectQuickStartDomain };

import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the flaw state domain
 */

const selectFlawDomain = state => state.flaw || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Flaw
 */

const makeSelectFlaw = () =>
  createSelector(
    selectFlawDomain,
    substate => substate,
  );

export default makeSelectFlaw;
export { selectFlawDomain };

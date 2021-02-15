import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the merits state domain
 */

const selectMeritsDomain = state => state.merits || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Merits
 */

const makeSelectMerits = () =>
  createSelector(
    selectMeritsDomain,
    substate => substate,
  );

export default makeSelectMerits;
export { selectMeritsDomain };

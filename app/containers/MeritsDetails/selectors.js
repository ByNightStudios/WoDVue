import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clanPage state domain
 */

const selectClanPageDomain = state => state.disciplines || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ClanPage
 */

const makeSelectClanPage = () =>
  createSelector(
    selectClanPageDomain,
    substate => substate,
  );

export default makeSelectClanPage;
export { selectClanPageDomain, makeSelectClanPage };

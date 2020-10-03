import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the monster state domain
 */

const selectMonsterDomain = state => state.monster || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Monster
 */

const makeSelectMonster = () =>
  createSelector(
    selectMonsterDomain,
    substate => substate,
  );

export default makeSelectMonster;
export { selectMonsterDomain };

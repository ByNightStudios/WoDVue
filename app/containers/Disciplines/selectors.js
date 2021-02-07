import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the disciplines state domain
 */

const selectDisciplinesDomain = state => state.disciplines || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Disciplines
 */

const makeSelectDisciplines = () =>
  createSelector(
    selectDisciplinesDomain,
    substate => substate,
  );

export default makeSelectDisciplines;
export { selectDisciplinesDomain, makeSelectDisciplines };

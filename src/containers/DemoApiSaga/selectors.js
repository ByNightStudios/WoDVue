import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the demoApiSaga state domain
 */

const selectDemoApiSagaDomain = state => state.demoApiSaga || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DemoApiSaga
 */

const makeSelectDemoApiSaga = () =>
  createSelector(
    selectDemoApiSagaDomain,
    substate => substate,
  );

export default makeSelectDemoApiSaga;
export { selectDemoApiSagaDomain };

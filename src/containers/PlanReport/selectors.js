import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the planReport state domain
 */

const selectPlanReportDomain = state => state.planReport || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PlanReport
 */

const makeSelectPlanReport = () =>
  createSelector(selectPlanReportDomain, substate => substate);

export default makeSelectPlanReport;
export { selectPlanReportDomain };

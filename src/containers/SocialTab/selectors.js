import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the socialTab state domain
 */

const selectSocialTabDomain = state => state.socialTabReducer || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SocialTab
 */

const makeSelectSocialTab = () =>
  createSelector(selectSocialTabDomain, substate => substate);

export default makeSelectSocialTab;
export { selectSocialTabDomain };

/*
 *
 * Monster actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_DROP_DOWN_ITEMS,
  DROP_DOWN_ITEMS_ERROR,
  DROP_DOWN_ITEMS_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const getDropDownItems = params => ({
  type: GET_DROP_DOWN_ITEMS,
  params,
});

export const dropDownItemsSuccess = payload => ({
  type: DROP_DOWN_ITEMS_SUCCESS,
  payload,
});

export const dropDownItemsError = error => ({
  type: DROP_DOWN_ITEMS_ERROR,
  error,
});

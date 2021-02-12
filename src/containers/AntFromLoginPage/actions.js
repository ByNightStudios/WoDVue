/*
 *
 * AntFromLoginPage actions
 *
 */

import { FORMVALUE,FROMVALUE_ASYNC_ERROR } from './constants';

export function FormValueSubmit(data) {
  return {
    type: FORMVALUE,
    data,
  };
}

export function FormValueSubmitError(error) {
  return {
    type: FROMVALUE_ASYNC_ERROR,
    error,
  };
}

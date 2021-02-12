/*
 *
 * AntFromLoginPage reducer
 *
 */
import produce from 'immer';
import {FROMVALUE_ASYNC_ERROR,FORMVALUE } from './constants';


export const initialState = {
  error:null,
  loading:false,
  success:false
};

/* eslint-disable default-case, no-param-reassign */
const antFromLoginPageReducer = (state = initialState, action) =>
  produce(state,  draft  => {
    switch (action.type) {
      case FORMVALUE:
        draft.error = null;
        draft.loading=true;
        break;
      case FROMVALUE_ASYNC_ERROR:
        draft.error=action.error;
        draft.loading=false;
        break;
    }
   
  });

export default antFromLoginPageReducer;

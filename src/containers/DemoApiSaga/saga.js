import { call, put, takeLatest } from 'redux-saga/effects';
import { DEMO_ACTION } from './constants';
import request from '../../utils/request';
import { demoActionSuccess, demoActionFail } from './actions';

// Individual exports for testing

function* apiCall() {
  try {
    const options = {
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      method: 'get',
    };
    const response = yield call(request, options);
    yield put(demoActionSuccess(response.data));
  } catch (e) {
    yield put(demoActionFail(e));
  }
}
export default function* demoApiSagaSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(DEMO_ACTION, apiCall);
}

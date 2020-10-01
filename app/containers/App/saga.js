import { take, call, put, takeLatest } from 'redux-saga/effects';
import apiContentful from '../../utils/contentfulUtils/api/contentful/contentful';
import { GET_DATA } from './constants';
import { getDataSuccess, DataError } from './actions';

function* getData() {
  try {
    console.log(apiContentful)
    // const response = yield call(apiContentful);
    // console.log(response);
  } catch (e) {
    console.log(e)
    yield put(DataError(e));
  }
}

// Individual exports for testing
export default function* appSaga() {
  yield takeLatest(GET_DATA, getData);
  // See example in containers/HomePage/saga.js
}

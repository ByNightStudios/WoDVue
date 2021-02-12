import { call, put, takeLatest } from 'redux-saga/effects';
import { GET_ELDER_LIST } from './constants';

import * as APIs from '../../common/backendConstants';
import request from '../../utils/request';
import { getElderListSuccess, getElderListError } from './actions';
// Individual exports for testing

function* getElderData({ params }) {
  try {
    let url = `${APIs.GET_UN_ASSIGNED_ELDERS_MANAGER_LIST}`;
    if (params) {
      url = `${url}?query=${params}`;
    }
    const options = {
      url,
      method: 'post',
    };
    const response = yield call(request, options);
    yield put(getElderListSuccess(response.data.data));
  } catch (e) {
    yield put(getElderListError(e));
  }
}

export default function* dataManagerUnAssignedElderSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ELDER_LIST, getElderData);
}

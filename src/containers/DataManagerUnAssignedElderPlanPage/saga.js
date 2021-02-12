import { call, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import history from '../../utils/history';
import { ELDER_DETAILS, PLAN_DETAILS, ADD_ELDER_PLAN } from './constants';
import {
  elderDetailsSuccess,
  elderDetailsError,
  planDetailsSuccess,
  planDetailsError,
} from './actions';

import * as APIs from '../../common/backendConstants';
import request from '../../utils/request';

function* getElderDetails(params) {
  try {
    const url = APIs.GET_ELDER_PLANS.replace(':elderIdentifier', params.params);
    const options = {
      url,
      method: 'get',
    };
    const response = yield call(request, options);
    yield put(elderDetailsSuccess(response));
  } catch (e) {
    yield put(elderDetailsError(e));
  }
}

function* getPlanDetails() {
  try {
    const url = APIs.PLANS_URL;
    const options = {
      url,
      method: 'get',
    };
    const response = yield call(request, options);
    yield put(planDetailsSuccess(response.data.data));
  } catch (e) {
    yield put(planDetailsError(e));
  }
}

function* assignElderPlan({ payload }) {
  try {
    const url = APIs.ADD_ELDER_PLANS;
    const options = {
      url,
      method: 'post',
      data: payload,
    };
    yield call(request, options);
    message.success(
      'Plan was successfully declared for this elder. Please assign erm to the elder',
      1,
      () => {
        history.push('/elders-page');
        window.location.reload();
      },
    );
  } catch (e) {
    console.log(e);
  }
}
// Individual exports for testing
export default function* dataManagerUnAssignedElderPlanPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(ELDER_DETAILS, getElderDetails);
  yield takeLatest(PLAN_DETAILS, getPlanDetails);
  yield takeLatest(ADD_ELDER_PLAN, assignElderPlan);
}

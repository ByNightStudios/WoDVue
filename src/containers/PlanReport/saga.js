import { call, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import { saveAs } from 'file-saver';
import request from 'utils/request';
import { DEFAULT_ACTION } from './constants';
import { reportSuccess, reportError } from './actions';

function* generatePlan() {
  const options = {
    url: 'admin/reports/plan-report',
    method: 'get'
  }
  try {
    const response = yield call(request, options);
    if (response.data) {
      saveAs(response.data.data,`PlanReport-${new Date()}.csv`);
      yield put(reportSuccess());
      message.success('Report Generated');
    }
  } catch (e) {
    yield put(reportError(e))
  }
}
// Individual exports for testing
export default function* planReportSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(DEFAULT_ACTION, generatePlan);
}

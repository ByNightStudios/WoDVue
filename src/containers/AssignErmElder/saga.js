import { call, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import request from '../../utils/request';
import { SET_ERM } from './constants';

function* setData({ payload }) {
  try {
    const url = `admin/elder-assignment-by-data-manager`;

    const options = {
      url,
      method: 'post',
      data: payload,
    };

    yield call(request, options);
    message.success('Erm has been assigned');
  } catch (e) {
    message.error(e.message);
  }
}
// Individual exports for testing
export default function* assignErmElderSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(SET_ERM, setData);
}

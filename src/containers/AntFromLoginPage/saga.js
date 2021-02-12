import { call, put, takeEvery } from 'redux-saga/effects';
import {ADMINLOGIN} from '../../common/backendConstants';
import {FormValueSubmitError} from './actions'
import { FORMVALUE} from './constants';
import request from '../../utils/request';
import axios from 'axios'
import { axiosInstance } from '../../store/store';

function* formApi(payload) {
  const email = payload.data.user.Email
  const password = payload.data.password

  try {
    const options = {
      url: 'admin/login',
      method: 'post',
      data: {
        email,
        password,
      }
    };
    const response = yield call(request, options);
    if(response.data){
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.data.access_token}`;
      yield put({
        type: ADMINLOGIN,
        payload: { user: response.data },
      });
    }
  }
   catch (err) {
     console.log(err);
    yield put(FormValueSubmitError('Invalid Credentials!'));
  }
}
export default function* antFromLoginPageSaga() {
  yield takeEvery(FORMVALUE, formApi);
}


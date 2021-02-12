import { call, put, takeLatest } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import { message } from 'antd';
import { EMERGENCY_ACTION, ALERT_ACTION, GET_LISTING_ACTION, ERM_DATA } from './constants';
import request from 'utils/request';
import history from 'utils/history';
import { getListingSuccess, getListingFailure, ermDataSuccess, ermDataFail } from './actions';

import * as APIs from '../../common/backendConstants';

function* getEldersListing({ params }) {
  const { page, erm: ermData, query } = params;
  try {
    let url = `${APIs.VIEW_MY_ELDERS}?page=${page}`;

    if (query) {
      url = `${url}&query=${query}`;
    }

    const options = {
      url,
      method: 'post',
    };

    if(!isEmpty(ermData)){
      options.data = {
        erm_id: ermData,
      };
    }

    const response = yield call(request, options);
    yield put(getListingSuccess(response.data.data));
  } catch (e) {
    yield put(getListingFailure(e));
  }
}

function* generateEmergency({ payload }) {
  const options = {
    url: APIs.CREATE_EMERGENCY_REQUEST_URL,
    data: payload,
    method: 'post',
  };

  try {
    const response = yield call(request, options);
    if (response) {
      message.success('Emergency was successfully declared for this elder.', 3, () => {
        history.push('/emergencies');
        window.location.reload();
      });
    }
  } catch (e) {
    message.error(e.message);
  }
}

function* generateAlert({ payload }) {
  const options = {
    url: APIs.CREATE_EMERGENCY_REQUEST_URL,
    data: payload,
    method: 'post',
  };

  try {
    const response = yield call(request, options);
    if (response && payload.is_alarm) {
      message.success('Emergency(False Alarm) was successfully declared for this elder.');
    }
  } catch (e) {
    message.error(e.message);
  }
}

function* getERMList(){
  const options = {
    url: 'admin/list/roles',
    data: {
      role: 'erm'
    },
    method: 'post',
  };
  try {
    const response  =  yield call(request, options);
    yield put(ermDataSuccess(response.data.data));
  } catch(e){
    yield put(ermDataFail(e));
  }
}

export default function* myEldersSaga() {
  yield takeLatest(GET_LISTING_ACTION, getEldersListing);
  yield takeLatest(EMERGENCY_ACTION, generateEmergency);
  yield takeLatest(ALERT_ACTION, generateAlert);
  yield takeLatest(ERM_DATA, getERMList);
}

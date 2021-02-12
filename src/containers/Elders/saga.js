import { call, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import { isNull, filter,concat, isEmpty } from 'lodash';
import { GET_LISTING_ACTION, DELETE_ERM_MAPPING, ERM_DATA, EMERGENCY_ACTION, ALERT_ACTION } from './constants';
import request from '../../utils/request';
import { getListingSuccess, getListingFailure, ermDataFail, ermDataSuccess } from './actions';
import history from 'utils/history';
import * as APIs from '../../common/backendConstants';

function* getEldersListing(params) {
  const {
    params: { plan_name: planName, plan_status: planStatus, page, query, erm: ermData, role },
  } = params;
  try {
    const url = `${APIs.GET_ELDERS_MANAGER_LIST}?page=${page}`;

    const options = {
      url,
      method: 'post',
      data: {
        login_role: role,
      }
    };

    if (planName || planName) {
      options.data = {
        plan_name: planName,
        plan_status: planStatus,
        erm_id: ermData,
        login_role: role,
      };
    }

    if(!isEmpty(ermData)){
      options.data = {
        erm_id: ermData,
        plan_name: planName,
        plan_status: planStatus,
        login_role: role,
      };
    }

    if (!isNull(query)) {
      options.url = `${
        APIs.GET_ELDERS_MANAGER_LIST
      }?page=${page}&query=${query}`;
    }

    const response = yield call(request, options);
    const responseNoErmAssign = filter(response.data.data.elders, o => isNull(o.adminData));
    const responseErmAssign = filter(response.data.data.elders, o => !isNull(o.adminData));
    response.data.data.elders = concat(responseNoErmAssign, responseErmAssign);
    yield put(getListingSuccess(response.data));
  } catch (e) {
    yield put(getListingFailure(e));
  }
}

function* deleteData({ payload }) {
  const options = {
    url: 'admin/elder-assignment',
    data: payload,
    method: 'put',
  };
  try {
    const response = yield call(request, options);
    if (response) {
      message.success('ERM has been removed');
    }
  } catch (e) {
    yield call(message.error('something went wrong'));
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

export default function* eldersSaga() {
  yield takeLatest(GET_LISTING_ACTION, getEldersListing);
  yield takeLatest(DELETE_ERM_MAPPING, deleteData);
  yield takeLatest(ERM_DATA, getERMList);
  yield takeLatest(EMERGENCY_ACTION, generateEmergency);
  yield takeLatest(ALERT_ACTION, generateAlert);
}

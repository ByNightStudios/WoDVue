import { isArray } from 'lodash';
import { message } from 'antd';
import {
  GET_SOCIAL_DATA_START,
  POST_ELDER_PERSONA_START,
  POST_EDU_QUAL_START,
  POST_EMPLOYMENT_START,
  POST_LOCATION_START,
  POST_PREFERENCES_START,
} from './constants';
import request from '../../utils/request';
import {
  call,
  put,
  takeLatest
} from 'redux-saga/effects';

import {
  getSocialDataSuccess,
  getSocialDataFailure,

  postElderPersonaSuccess,
  postElderPersonaFailure,

  postEduQualSuccess,
  postEduQualFailure,

  postEmploymentSuccess,
  postEmploymentFailure,

  postLocationSuccess,
  postLocationFailure,

  postPreferencesSuccess,
  postPreferencesFailure
} from './actions';

function* getSocialData({
  payload
}) {
  try {
    const options = {
      url: `admin/social-elder-persona/${payload}`,
      method: 'get'
    };

    const response = yield call(request, options);

    yield put(getSocialDataSuccess(response.data.data));
  } catch (err) {
    yield put(getSocialDataFailure());
  }
};

function* updateElderPersona({
  payload
}) {
  try {
    const options = {
      url: `admin/social-elder-persona`,
      data: { ...payload },
      method: 'post'
    };

    let response = yield call(request, options);

    response = isArray(response?.data?.data) ? response?.data?.data?.[0] : null;

    yield put(postElderPersonaSuccess(response));

    message.success('Details updated successfully.');
  } catch (err) {
    yield put(postElderPersonaFailure());
  }
};

function* updateEducationsQualification({
  payload
}) {
  try {
    const options = {
      url: 'admin/social-education-qualification',
      method: 'post',
      data: payload?.values,
    };
    const response = yield call(request, options);

    yield put(postEduQualSuccess(response.data.data));

    payload?.setModalVisibility?.();

    message.success('Details updated successfully.');
  } catch (err) {
    yield put(postEduQualFailure());
  }
};

function* updateEmployments({
  payload
}) {
  try {
    const options = {
      url: 'admin/social-employment-organisation',
      method: 'post',
      data: payload?.values,
    };
    const response = yield call(request, options);

    yield put(postEmploymentSuccess(response.data.data));

    payload?.setModalVisibility?.();

    message.success('Details updated successfully.');
  } catch (err) {
    yield put(postEmploymentFailure());
  }
};

function* updateLocation({
  payload
}) {
  try {
    const options = {
      url: 'admin/social-elder-location-information',
      method: 'post',
      data: payload,
    };

    let response = yield call(request, options);

    response = isArray(response?.data?.data) ? response?.data?.data?.[0] : null;

    yield put(postLocationSuccess(response));

    message.success('Details updated successfully.');
  } catch (err) {
    yield put(postLocationFailure());
  }
};

function* updatePreferences({
  payload
}) {
  try {
    const options = {
      url: 'admin/social-elder-preference',
      method: 'post',
      data: payload,
    };

    let response = yield call(request, options);

    response = isArray(response?.data?.data) ? response?.data?.data?.[0] : null;

    yield put(postPreferencesSuccess(response));

    message.success('Details updated successfully.');
  } catch (err) {
    yield put(postPreferencesFailure());
  }
};

export default function* socialTabSaga() {
  yield takeLatest(GET_SOCIAL_DATA_START, getSocialData);
  yield takeLatest(POST_ELDER_PERSONA_START, updateElderPersona);
  yield takeLatest(POST_EDU_QUAL_START, updateEducationsQualification);
  yield takeLatest(POST_EMPLOYMENT_START, updateEmployments);
  yield takeLatest(POST_LOCATION_START, updateLocation);
  yield takeLatest(POST_PREFERENCES_START, updatePreferences);
}

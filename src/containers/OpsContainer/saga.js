import { takeLatest, call, put } from 'redux-saga/effects';
import { get, isNull } from 'lodash';
import { message } from 'antd';
import {
  GET_PLANS_REQUEST,
  GET_INITIATED_PLAN_REQUEST,
  UPDATE_OPS_DETAILS_REQUEST,
  GET_OPERATION_DETAILS,
  UPDATE_OPERATION_COLLAPSE_DETAILS,
  UPDATE_TC_COLLAPSE_DETAILS,
  UPDATE_NOK_OUTREACHED_COLLAPSE_DETAILS,
  UPDATE_SOCIAL_ASPECTS_COLLAPSE_DETAILS,
  UPDATE_EMERGENCIES_MILESTONES_COLLAPSE_DETAILS,
  UPDATE_SIMULATION_COLLAPSE_DETAILS,
  UPDATE_CGHS_COLLAPSE_DETAILS,
} from './constants';
import {
  getPlansSuccess,
  getPlansFailure,

  getInitiatedPlanRequest,
  getInitiatedPlanSuccess,
  getInitiatedPlanFailure,

  updateOpsDetailsSuccess,
  updateOpsDetailsFailure,

  getOperationDetailsSuccess,
  getOperationDetailsFailure,
} from './actions';
import request from '../../utils/request';

function* getPlans({ payload }) {
  const options = {
    url: `admin/elder-plans/${payload}`,
    method: 'get',
  };

  try {
    const response = yield call(request, options);
    if (response) {
      yield put(getPlansSuccess(get(response, 'data.data', null)));
      yield put(getInitiatedPlanRequest(get(response, 'data.data.activePlan.id', null)));
    }
  } catch (e) {
    yield put(getPlansFailure());
  }
};

function* getInitiatedPlan({ payload }) {
  if (!isNull(payload)) {
    const options = {
      url: `admin/user-plans/${payload}`,
      method: 'get',
    };

    try {
      const response = yield call(request, options);
      if (response) {
        yield put(getInitiatedPlanSuccess(get(response, 'data.data', null)));
      }
    } catch (e) {
      yield put(getInitiatedPlanFailure());
    }
  } else {
    message.info('Active plan not found!');
    yield put(getInitiatedPlanFailure());
  }
};

function* updateOpsDetails({ payload }) {
  const options = {
    url: `admin/user-plans/${payload.id}`,
    data: { ...payload.payload },
    method: 'put',
  };

  try {
    const response = yield call(request, options);
    if (response) {
      yield put(updateOpsDetailsSuccess(get(response, 'data.data', null)));
    }
  } catch (e) {
    yield put(updateOpsDetailsFailure());
  }
};

function* operationsDetails({ params }) {
  const options = {
    url: `admin/operations-details/${params}`,
    method: 'get',
  }
  try {
    const response = yield call(request, options);
    if (response.data) {
      yield put(getOperationDetailsSuccess(get(response, 'data.data', null)))
    }
  } catch (e) {
    yield put(getOperationDetailsFailure(e));
  }
}

function* updateOperationTabDetails({ params }) {
  try {
    const options = {
      url: `admin/operation/operation-detail`,
      method: 'put',
      data: { ...params },
    }
    yield call(request, options);
    message.success('Details has been updated');
  } catch (e) {
    yield put(getOperationDetailsFailure(e));
  }
}

function* handleTcCollapseDetails({ params }) {
  try {
    const options = {
      url: `admin/operation/tc-detail`,
      method: 'put',
      data: { ...params },
    }
    yield call(request, options);
    message.success('Details has been updated');
  } catch (e) {
    yield put(getOperationDetailsFailure(e));
  }
}


function* handleNokOutreachedCollapseDetails({ params }) {
  try {
    const options = {
      url: `admin/operation/nok-outreach-detail`,
      method: 'put',
      data: { ...params },
    }
    yield call(request, options);
    message.success('Details has been updated');
  } catch (e) {
    yield put(getOperationDetailsFailure(e));
  }
}

function* handleSocialAspectsDetails({ params }) {
  try {
    const options = {
      url: `admin/operation/social-detail`,
      method: 'put',
      data: { ...params },
    }
    yield call(request, options);
    message.success('Details has been updated');
  } catch (e) {
    yield put(getOperationDetailsFailure(e));
  }
}

function* handleEmergencyMileStonesDetails({ params }) {
  try {
    const options = {
      url: `admin/operation/emergency-milestone`,
      method: 'put',
      data: { ...params },
    }
    yield call(request, options);
    message.success('Details has been updated');
  } catch (e) {
    yield put(getOperationDetailsFailure(e));
  }
}

function* handleSimulationDetails({ params }) {
  try {
    const options = {
      url: `admin/operation/prevention-magagement`,
      method: 'put',
      data: { ...params },
    }
    yield call(request, options);
    message.success('Details has been updated');
  } catch (e) {
    yield put(getOperationDetailsFailure(e));
  }
}

function* handleUpdateCGHSDetails({ params }) {
  try {
    const options = {
      url: `admin/operation/elder-relationship`,
      method: 'put',
      data: { ...params },
    }
    yield call(request, options);
    message.success('Details has been updated');
  } catch (e) {
    yield put(getOperationDetailsFailure(e));
  }
}

// Individual exports for testing
export default function* opsContainerSaga() {
  yield takeLatest(GET_PLANS_REQUEST, getPlans);
  yield takeLatest(GET_INITIATED_PLAN_REQUEST, getInitiatedPlan);
  yield takeLatest(UPDATE_OPS_DETAILS_REQUEST, updateOpsDetails);
  yield takeLatest(GET_OPERATION_DETAILS, operationsDetails);
  yield takeLatest(UPDATE_OPERATION_COLLAPSE_DETAILS, updateOperationTabDetails);
  yield takeLatest(UPDATE_TC_COLLAPSE_DETAILS, handleTcCollapseDetails);
  yield takeLatest(UPDATE_NOK_OUTREACHED_COLLAPSE_DETAILS, handleNokOutreachedCollapseDetails);
  yield takeLatest(UPDATE_SOCIAL_ASPECTS_COLLAPSE_DETAILS, handleSocialAspectsDetails);
  yield takeLatest(UPDATE_EMERGENCIES_MILESTONES_COLLAPSE_DETAILS, handleEmergencyMileStonesDetails);
  yield takeLatest(UPDATE_SIMULATION_COLLAPSE_DETAILS, handleSimulationDetails);
  yield takeLatest(UPDATE_CGHS_COLLAPSE_DETAILS, handleUpdateCGHSDetails);
}

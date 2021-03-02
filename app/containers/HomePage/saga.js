import { call, put, select, takeLatest } from 'redux-saga/effects';
import { GET_DATA } from 'containers/App/constants';
import { getDataSuccess, DataError } from 'containers/App/actions';

import makeSelectHomePage from './selectors';

import apiContentful from '../../utils/contentfulUtils/api/contentful/contentful';

function* getData() {
  const homePage = yield select(makeSelectHomePage());
  const {
    contentful: { skip, limit },
  } = homePage;
  try {
    const response = yield call(apiContentful, {
      skip,
      limit,
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    yield put(getDataSuccess(contentfulData));
  } catch (e) {
    yield put(DataError(e));
  }
}

// Individual exports for testing
export default function* homePageSaga() {
  // See example in containers/HomePage/saga.js
  // yield takeLatest(GET_DATA, getData);
}

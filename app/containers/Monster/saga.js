import { call, put, debounce } from 'redux-saga/effects';
import { GET_DROP_DOWN_ITEMS } from './constants';
import { dropDownItemsError, dropDownItemsSuccess } from './actions';
import apiContentful from '../../utils/contentfulUtils/api/contentful/contentful';

function* getItemsData({ params }) {
  const queryParams = params;
  try {
    const response = yield call(apiContentful, {
      query: queryParams,
      skip: 0,
      limit: 100,
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    yield put(dropDownItemsSuccess(contentfulData));
  } catch (e) {
    yield put(dropDownItemsError(e));
  }
}

// Individual exports for testing
export default function* monsterSaga() {
  // See example in containers/HomePage/saga.js
  yield debounce(2000, GET_DROP_DOWN_ITEMS, getItemsData);
}

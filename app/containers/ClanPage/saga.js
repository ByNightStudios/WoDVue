/* eslint-disable func-names */
import { call, put, debounce, takeLatest } from 'redux-saga/effects';
import { orderBy } from 'lodash';
import { GET_DROP_DOWN_ITEMS, GET_DISCIPLINES } from './constants';
import {
  dropDownItemsError,
  dropDownItemsSuccess,
  disciplinesSuccess,
} from './actions';
import apiContentful from '../../utils/contentfulUtils/api/contentful/contentful';

function getItems(item) {
  if (item.title) {
    return item.title;
  }
  if (item.merit) {
    return item.merit;
  }
  if (item.flaw) {
    return item.flaw;
  }

  if (item.technique) {
    return item.technique;
  }
  return item.attribute;
}

function* getItemsData({ params }) {
  const queryParams = params;
  try {
    const response = yield call(apiContentful, {
      query: queryParams,
      select: 'fields,sys.id',
      parents: queryParams === 'discipline' ? true : '',
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const orderByData = orderBy(
      contentfulData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(dropDownItemsSuccess(orderByData));
  } catch (e) {
    yield put(dropDownItemsError(e));
  }
}

function* getDisciplinesData() {
  try {
    const response = yield call(apiContentful, {
      query: 'discipline',
      select: 'fields,sys.id',
      parents: true,
    });
    const response1 = yield call(apiContentful, {
      query: 'techniques',
      select: 'fields,sys.id',
      parents: '',
    });
    const response2 = yield call(apiContentful, {
      query: 'discipline',
      select: 'fields,sys.id',
    });
    const contentfulData1 = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const contentfulData2 = yield Promise.resolve(
      response1.getParentEntriesAsync,
    );
    const contentfulData3 = yield Promise.resolve(
      response2.getParentEntriesAsync,
    );
    const orderByData1 = orderBy(
      contentfulData1,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    const orderByData2 = orderBy(
      contentfulData2,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    const orderByData3 = orderBy(
      contentfulData3,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(disciplinesSuccess({ orderByData1, orderByData2, orderByData3 }));
  } catch (e) {
    yield put(dropDownItemsError());
  }
}

// Individual exports for testing
export default function* monsterSaga() {
  // See example in containers/HomePage/saga.js
  yield debounce(300, GET_DROP_DOWN_ITEMS, getItemsData);
  yield takeLatest(GET_DISCIPLINES, getDisciplinesData);
}

import { call, put, debounce, takeLatest, select } from 'redux-saga/effects';
import { orderBy } from 'lodash';
import { GET_DATA } from './constants';
import { makeSelectApp } from './selectors';
import {
  disciplineDataSuccess,
  clanDataSuccess,
  flawsDataSuccess,
  meritsDataSuccess,
  attributeDataSuccess,
  backgroundDataSuccess,
  skillDataSuccess,
  techniquesDataSuccess,
} from './actions';
import apiContentful from '../../utils/contentfulUtils/api/contentful/contentful';
// Individual exports for testing

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

function* handleGetAppData() {
  const appState = yield select(makeSelectApp());
  const {
    disciplines: { skip, limit },
  } = appState;
  try {
    const response = yield call(apiContentful, {
      query: 'discipline',
      select: 'fields,sys.id',
      parents: false,
      skip,
      limit,
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const orderByData = orderBy(
      contentfulData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(disciplineDataSuccess(orderByData));
  } catch (e) {
    console.log(e);
  }

  try {
    const response = yield call(apiContentful, {
      query: 'clans',
      select: 'fields,sys.id',
      parents: '',
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const orderByData = orderBy(
      contentfulData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(clanDataSuccess(orderByData));
  } catch (e) {
    // yield put(dropDownItemsError(e));
  }

  try {
    const response = yield call(apiContentful, {
      query: 'flaws',
      select: 'fields,sys.id',
      parents: '',
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const orderByData = orderBy(
      contentfulData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(flawsDataSuccess(orderByData));
  } catch (e) {
    // yield put(dropDownItemsError(e));
  }

  try {
    const response = yield call(apiContentful, {
      query: 'merits',
      select: 'fields,sys.id',
      parents: '',
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const orderByData = orderBy(
      contentfulData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(meritsDataSuccess(orderByData));
  } catch (e) {
    // yield put(dropDownItemsError(e));
  }

  try {
    const response = yield call(apiContentful, {
      query: 'attributes',
      select: 'fields,sys.id',
      parents: '',
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const orderByData = orderBy(
      contentfulData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(attributeDataSuccess(orderByData));
  } catch (e) {
    // yield put(dropDownItemsError(e));
  }

  try {
    const response = yield call(apiContentful, {
      query: 'backgrounds',
      select: 'fields,sys.id',
      parents: '',
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const orderByData = orderBy(
      contentfulData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(backgroundDataSuccess(orderByData));
  } catch (e) {
    // yield put(dropDownItemsError(e));
  }

  try {
    const response = yield call(apiContentful, {
      query: 'skills',
      select: 'fields,sys.id',
      parents: '',
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const orderByData = orderBy(
      contentfulData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(skillDataSuccess(orderByData));
  } catch (e) {
    // yield put(dropDownItemsError(e));
  }

  try {
    const response = yield call(apiContentful, {
      query: 'techniques',
      select: 'fields,sys.id',
      parents: '',
    });
    const contentfulData = yield Promise.resolve(
      response.getParentEntriesAsync,
    );
    const orderByData = orderBy(
      contentfulData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(techniquesDataSuccess(orderByData));
  } catch (e) {
    // yield put(dropDownItemsError(e));
  }
}
export default function* appSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, handleGetAppData);
}

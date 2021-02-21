import { call, put, debounce, takeLatest, select } from 'redux-saga/effects';
import { orderBy, isEmpty } from 'lodash';
import localforage from 'localforage';
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

localforage.setDriver(localforage.LOCALSTORAGE);

const loadState = (stateData, cb) => {
  try {
    localforage.getItem(`${stateData}`, (err, state) => {
      if (err) return cb(err);
      return cb(JSON.parse(state));
    });
  } catch (err) {
    return cb(null, {});
  }
};

const saveState = (name, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localforage.setItem(`${name}`, serializedState);
  } catch (err) {
    // err while saving state
  }
};

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
    attributes: { data: arributesData },
    backgrounds: { data: backgroundsData },
    clans: { data: clansData },
    disciplines: { data: DisciplinesData },
    flaws: { data: flawsData },
    merits: { data: meritsData },
    skills: { data: skillsData },
    techniques: { data: techniquesData },
  } = appState;

  const {
    disciplines: { skip, limit },
  } = appState;

  if (isEmpty(DisciplinesData)) {
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
      saveState('discipline', orderByData);
      yield put(disciplineDataSuccess(orderByData));
    } catch (e) {
      console.log(e);
    }
  }

  if (isEmpty(clansData)) {
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
      saveState('clans', orderByData);
      yield put(clanDataSuccess(orderByData));
    } catch (e) {
      // yield put(dropDownItemsError(e));
    }
  }

  if (isEmpty(flawsData)) {
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
      saveState('flaws', orderByData);
      yield put(flawsDataSuccess(orderByData));
    } catch (e) {
      // yield put(dropDownItemsError(e));
    }
  }

  if (isEmpty(meritsData)) {
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
      saveState('merits', orderByData);
      yield put(meritsDataSuccess(orderByData));
    } catch (e) {
      // yield put(dropDownItemsError(e));
    }
  }

  if (isEmpty(arributesData)) {
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
      saveState('attributes', orderByData);
      yield put(attributeDataSuccess(orderByData));
    } catch (e) {
      // yield put(dropDownItemsError(e));
    }
  }
  if (isEmpty(backgroundsData)) {
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
      saveState('backgrounds', orderByData);
      yield put(backgroundDataSuccess(orderByData));
    } catch (e) {
      // yield put(dropDownItemsError(e));
    }
  }

  if (isEmpty(skillsData)) {
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
      saveState('skills', orderByData);
      yield put(skillDataSuccess(orderByData));
    } catch (e) {
      // yield put(dropDownItemsError(e));
    }
  }

  if (isEmpty(techniquesData)) {
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
      saveState('techniques', orderByData);
      yield put(techniquesDataSuccess(orderByData));
    } catch (e) {
      // yield put(dropDownItemsError(e));
    }
  }
}
export default function* appSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, handleGetAppData);
}

import { call, put, debounce, takeLatest, select } from 'redux-saga/effects';
import { orderBy, isEmpty, filter, sortBy, uniqBy } from 'lodash';
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
  ritualDataSuccess,
  getDataSuccess,
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
    appData: { skip, limit, hasMore, data },
    attributes: { data: arributesData },
    backgrounds: { data: backgroundsData },
    clans: { data: clansData },
    disciplines: { data: DisciplinesData },
    flaws: { data: flawsData },
    merits: { data: meritsData },
    skills: { data: skillsData },
    techniques: { data: techniquesData },
  } = appState;

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
    console.log(e);
  }

  if (skip === 1200) {
    const disciplineAppData = sortBy(
      filter(data, o => o.title),
      'title',
    );

    const orderByData1 = orderBy(
      disciplineAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(disciplineDataSuccess(uniqBy(orderByData1, 'title')));
    const clanAppData = filter(data, o => o.inClanMerits);
    const orderByData2 = orderBy(
      clanAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    saveState('clans', orderByData2);
    yield put(clanDataSuccess(orderByData2));

    const flawsAppData = sortBy(filter(data, o => o.flaw), 'flaw');

    const orderByData3 = orderBy(
      flawsAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(flawsDataSuccess(orderByData3));

    const meritAppData = sortBy(filter(data, o => o.merit), 'merit');

    const meritByData4 = orderBy(
      meritAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(meritsDataSuccess(meritByData4));
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

    if (isEmpty(arributesData)) {
      try {
        const response1 = yield call(apiContentful, {
          query: 'attributes',
          select: 'fields,sys.id',
          parents: '',
        });
        const contentfulData1 = yield Promise.resolve(
          response1.getParentEntriesAsync,
        );
        const orderByData6 = orderBy(
          contentfulData1,
          [item => getItems(item).toLowerCase()],
          ['asc'],
        );
        saveState('attributes', orderByData6);
        yield put(attributeDataSuccess(orderByData6));
      } catch (e) {
        // yield put(dropDownItemsError(e));
      }
    }

    if (isEmpty(backgroundsData)) {
      try {
        const response7 = yield call(apiContentful, {
          query: 'backgrounds',
          select: 'fields,sys.id',
          parents: '',
        });
        const contentfulData7 = yield Promise.resolve(
          response7.getParentEntriesAsync,
        );
        const orderByData7 = orderBy(
          contentfulData7,
          [item => getItems(item).toLowerCase()],
          ['asc'],
        );
        saveState('backgrounds', orderByData7);
        yield put(backgroundDataSuccess(orderByData7));
      } catch (e) {
        // yield put(dropDownItemsError(e));
      }
    }

    if (isEmpty(skillsData)) {
      try {
        const response77 = yield call(apiContentful, {
          query: 'skills',
          select: 'fields,sys.id',
          parents: '',
        });
        const contentfulData77 = yield Promise.resolve(
          response77.getParentEntriesAsync,
        );
        const orderByData77 = orderBy(
          contentfulData77,
          [item => getItems(item).toLowerCase()],
          ['asc'],
        );
        saveState('skills', orderByData77);
        yield put(skillDataSuccess(orderByData77));
      } catch (e) {
        // yield put(dropDownItemsError(e));
      }
    }

    if (isEmpty(techniquesData)) {
      try {
        const response777 = yield call(apiContentful, {
          query: 'techniques',
          select: 'fields,sys.id',
          parents: '',
        });
        const contentfulData777 = yield Promise.resolve(
          response777.getParentEntriesAsync,
        );
        const orderByData777 = orderBy(
          contentfulData777,
          [item => getItems(item).toLowerCase()],
          ['asc'],
        );
        saveState('techniques', orderByData777);
        yield put(techniquesDataSuccess(orderByData777));
      } catch (e) {
        // yield put(dropDownItemsError(e));
      }
    }

    try {
      const response111 = yield call(apiContentful, {
        query: 'rituals',
        select: 'fields,sys.id',
        parents: '',
      });
      const contentfulData111 = yield Promise.resolve(
        response111.getParentEntriesAsync,
      );
      const orderByData111 = orderBy(
        contentfulData111,
        [item => getItems(item).toLowerCase()],
        ['asc'],
      );
      saveState('rituals', orderByData111);
      yield put(ritualDataSuccess(orderByData111));
    } catch (e) {
      // yield put(dropDownItemsError(e));
    }

  }

}
export default function* appSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, handleGetAppData);
}

import { put, takeLatest, select, call } from 'redux-saga/effects';
import { orderBy, filter, sortBy, concat } from 'lodash';
import localforage, { clear } from 'localforage';
import extractEntryDataFromResponse from 'utils/parsingText';

import mockAppData from 'mockData/app.json';
import disciplineDataMock from 'mockData/disciplineData.json';
import skillMock from 'mockData/skill.json';
import attributeMock from 'mockData/attribute.json';
import backgroundMock from 'mockData/background.json';
import ritualsMock from 'mockData/ritual.json';
import techniqueMock from 'mockData/technique.json';
import apiContentful from '../../utils/contentfulUtils/api/contentful/contentful';
import { GET_DATA, DISCIPLINES_DATA } from './constants';
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

// const apiContentManager = new APIContentful();
// Individual exports for testing

localforage.config({
  driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
  name: 'NightStudio',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'NightStudio', // Should be alphanumeric, with underscores.
  description:
    'The official licensed publisher of new Mind`s Eye Theatre products for World of Darkness. Like us for product news and more. Night is rising.',
});

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
  clear();

  try {
    const response1 = yield call(apiContentful, {
      skip,
      limit,
    });
    const contentfulData1 = yield Promise.resolve(
      response1.getParentEntriesAsync,
    );
    const orderByData6 = orderBy(
      contentfulData1,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(disciplineDataSuccess(orderByData6));
  } catch (e) {
    // yield put(dropDownItemsError(e));
  }

  try {
    // }
    const contentfulData = extractEntryDataFromResponse(mockAppData);

    const RitualsDataMock1 = filter(contentfulData, 'thaumaturgy');
    const RitualsDataMock2 = filter(contentfulData, 'necromancy');
    const RitualsDataMock3 = filter(contentfulData, 'abyssal');

    yield put(getDataSuccess(contentfulData));
    const clanAppData = filter(contentfulData, o => o.inClanMerits);
    const orderByData2 = orderBy(
      clanAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );

    yield put(clanDataSuccess(orderByData2));

    const flawsAppData = sortBy(
      filter(contentfulData, o => o.flawType),
      'flaw',
    );
    const orderByData3 = orderBy(
      flawsAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(flawsDataSuccess(orderByData3));
    const meritAppData = sortBy(filter(contentfulData, o => o.merit), 'merit');
    const meritByData4 = orderBy(
      meritAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(meritsDataSuccess(meritByData4));

    const contentfulData77 = extractEntryDataFromResponse(skillMock);
    const orderByData77 = orderBy(
      contentfulData77,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    saveState('data', orderByData77);
    yield put(skillDataSuccess(orderByData77));

    const contentfulData1 = extractEntryDataFromResponse(attributeMock);
    const orderByData6 = orderBy(
      contentfulData1,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    saveState('attributes', orderByData6);
    yield put(attributeDataSuccess(orderByData6));

    const contentfulData7 = extractEntryDataFromResponse(backgroundMock);
    const orderByData7 = orderBy(
      contentfulData7,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    saveState('backgrounds', orderByData7);
    yield put(backgroundDataSuccess(orderByData7));
    const contentfulData777 = extractEntryDataFromResponse(ritualsMock);
    const orderByData777 = orderBy(
      contentfulData777,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    saveState('techniques', orderByData777);
    yield put(techniquesDataSuccess(orderByData777));

    const contentfulData7771 = concat(
      RitualsDataMock1,
      filter(RitualsDataMock2, o => !o.power),
      RitualsDataMock3,
    );
    const orderByData7771 = orderBy(
      contentfulData7771,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    saveState('rituals', orderByData7771);
    yield put(ritualDataSuccess(orderByData7771));
  } catch (e) {
    //
  }
  if (skip > 1200) {
    // if (isEmpty(arributesData)) {
    //   try {
    //     const response1 = yield call(apiContentful, {
    //       query: 'attributes',
    //       select: 'fields,sys.id',
    //       parents: '',
    //     });
    //     const contentfulData1 = yield Promise.resolve(
    //       response1.getParentEntriesAsync,
    //     );
    //     const orderByData6 = orderBy(
    //       contentfulData1,
    //       [item => getItems(item).toLowerCase()],
    //       ['asc'],
    //     );
    //     saveState('attributes', orderByData6);
    //     yield put(attributeDataSuccess(orderByData6));
    //   } catch (e) {
    //     // yield put(dropDownItemsError(e));
    //   }
    // }
    // if (isEmpty(backgroundsData)) {
    //   try {
    //     const response7 = yield call(apiContentful, {
    //       query: 'backgrounds',
    //       select: 'fields,sys.id',
    //       parents: '',
    //     });
    //     const contentfulData7 = yield Promise.resolve(
    //       response7.getParentEntriesAsync,
    //     );
    //     const orderByData7 = orderBy(
    //       contentfulData7,
    //       [item => getItems(item).toLowerCase()],
    //       ['asc'],
    //     );
    //     saveState('backgrounds', orderByData7);
    //     yield put(backgroundDataSuccess(orderByData7));
    //   } catch (e) {
    //     // yield put(dropDownItemsError(e));
    //   }
    // }
    // if (isEmpty(skillsData)) {
    //   try {
    //     const response77 = yield call(apiContentful, {
    //       query: 'skills',
    //       select: 'fields,sys.id',
    //       parents: '',
    //     });
    //     const contentfulData77 = yield Promise.resolve(
    //       response77.getParentEntriesAsync,
    //     );
    //     const orderByData77 = orderBy(
    //       contentfulData77,
    //       [item => getItems(item).toLowerCase()],
    //       ['asc'],
    //     );
    //     saveState('skills', orderByData77);
    //     yield put(skillDataSuccess(orderByData77));
    //   } catch (e) {
    //     // yield put(dropDownItemsError(e));
    //   }
    // }
    // if (isEmpty(techniquesData)) {
    //   try {
    //     const response777 = yield call(apiContentful, {
    //       query: 'techniques',
    //       select: 'fields,sys.id',
    //       parents: '',
    //     });
    //     const contentfulData777 = yield Promise.resolve(
    //       response777.getParentEntriesAsync,
    //     );
    //     const orderByData777 = orderBy(
    //       contentfulData777,
    //       [item => getItems(item).toLowerCase()],
    //       ['asc'],
    //     );
    //     saveState('techniques', orderByData777);
    //     yield put(techniquesDataSuccess(orderByData777));
    //   } catch (e) {
    //     // yield put(dropDownItemsError(e));
    //   }
    // }
  }
}

function* handleDisciplineData() {
  const appState = yield select(makeSelectApp());

  const {
    appData: { skip, limit },
    disciplines: { data: DisciplinesData },
  } = appState;
  try {
    // const response10 = yield call(apiContentful, {
    //   query: 'discipline',
    //   select: 'fields,sys.id',
    //   parents: '',
    //   skip,
    //   limit,
    // });
    const contentfulData = extractEntryDataFromResponse(mockAppData);
    const disciplineDataMock2 = filter(contentfulData, o => o.power);

    const orderByData6 = orderBy(
      disciplineDataMock2,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(disciplineDataSuccess(orderByData6));
  } catch (e) {
    //
  }
}
export default function* appSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, handleGetAppData);
  yield takeLatest(DISCIPLINES_DATA, handleDisciplineData);
}

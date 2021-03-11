import { put, takeLatest } from 'redux-saga/effects';
import { orderBy, filter, sortBy, concat } from 'lodash';
import localforage, { clear } from 'localforage';
import extractEntryDataFromResponse from 'utils/parsingText';

import mockAppData from 'mockData/app.json';
import skillMock from 'mockData/skill.json';
import attributeMock from 'mockData/attribute.json';
import backgroundMock from 'mockData/background.json';
import ritualsMock from 'mockData/ritual.json';
import techniqueMock from 'mockData/technique.json';
import clanMock from 'mockData/clan.json';
import flawMock from 'mockData/flaw.json';

// import apiScriptJson from 'scripts/api.json';

import { GET_DATA, DISCIPLINES_DATA } from './constants';
// import { makeSelectApp } from './selectors';
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
  clear('NightStudio');
  try {
    const contentfulData = extractEntryDataFromResponse(mockAppData);

    const RitualsDataMock1 = filter(contentfulData, 'thaumaturgy');
    const RitualsDataMock2 = filter(contentfulData, 'necromancy');
    const RitualsDataMock3 = filter(contentfulData, 'abyssal');

    yield put(getDataSuccess(contentfulData));

    const clanAppData = extractEntryDataFromResponse(clanMock);
    const orderByData2 = orderBy(
      clanAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );

    yield put(clanDataSuccess(orderByData2));

    const flawsAppData = extractEntryDataFromResponse(flawMock);
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

    const contentfulData7771 = extractEntryDataFromResponse(techniqueMock);
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
}

function* handleDisciplineData() {
  try {
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

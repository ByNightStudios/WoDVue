import { put, takeLatest, call } from 'redux-saga/effects';
import { orderBy, filter, concat } from 'lodash';
import extractEntryDataFromResponse from 'utils/parsingText';

import clanMock from 'scripts/clans.json';
import skillMock from 'scripts/skills.json';
import attributeMock from 'scripts/attributes.json';
import backgroundMock from 'scripts/backgrounds.json';

import ritualsMock_1 from 'scripts/rituals_0.json';
import ritualsMock_2 from 'scripts/rituals_100.json';
import ritualsMock_3 from 'scripts/rituals_200.json';

import techniqueMock_1 from 'scripts/techniques_0.json';
import techniqueMock_2 from 'scripts/techniques_100.json';
import techniqueMock_3 from 'scripts/techniques_200.json';

import flaws_1 from 'scripts/flaws_0.json';
import flaws_2 from 'scripts/flaws_100.json';
import flaws_3 from 'scripts/flaws_200.json';

import merits_1 from 'scripts/merits_0.json';
import merits_2 from 'scripts/merits_100.json';
import merits_3 from 'scripts/merits_200.json';
import merits_4 from 'scripts/merits_300.json';
import merits_5 from 'scripts/merits_400.json';

import discipline_1 from 'scripts/discipline_0.json';
import discipline_2 from 'scripts/discipline_100.json';
import discipline_3 from 'scripts/discipline_200.json';
import discipline_4 from 'scripts/discipline_300.json';
import discipline_5 from 'scripts/discipline_400.json';


// import apiContentful from '../../utils/contentfulUtils/api/contentful/contentful';

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
  // const response111 = yield call(apiContentful, {
  //   query: 'rituals',
  //   select: 'fields,sys.id',
  //   parents: '',
  // });

  try {
    const clanAppData = extractEntryDataFromResponse(clanMock);
    const orderByData2 = orderBy(
      clanAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );

    yield put(clanDataSuccess(orderByData2));


    const contentful_flaws_1 = extractEntryDataFromResponse(flaws_1);
    const contentful_flaws_2 = extractEntryDataFromResponse(flaws_2);
    const contentful_flaws_3 = extractEntryDataFromResponse(flaws_2);

    const orderByData3 = orderBy(
      concat(contentful_flaws_1, contentful_flaws_2, contentful_flaws_3),
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(flawsDataSuccess(orderByData3));

    const contentful_merits_1 = extractEntryDataFromResponse(merits_1);
    const contentful_merits_2= extractEntryDataFromResponse(merits_2);
    const contentful_merits_3 = extractEntryDataFromResponse(merits_3);
    const contentful_merits_4 = extractEntryDataFromResponse(merits_4);
    const contentful_merits_5 = extractEntryDataFromResponse(merits_5);

    const meritByData4 = orderBy(concat(contentful_merits_1,contentful_merits_2,contentful_merits_3,contentful_merits_4, contentful_merits_5), 'merit', ['asc']);

    yield put(meritsDataSuccess(meritByData4));

    const contentfulData77 = extractEntryDataFromResponse(skillMock);
    const orderByData77 = orderBy(
      contentfulData77,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    // saveState('data', orderByData77);
    yield put(skillDataSuccess(orderByData77));

    const contentfulData1 = extractEntryDataFromResponse(attributeMock);
    const orderByData6 = orderBy(
      contentfulData1,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    // saveState('attributes', orderByData6);
    yield put(attributeDataSuccess(orderByData6));

    const contentfulData7 = extractEntryDataFromResponse(backgroundMock);
    const orderByData7 = orderBy(
      contentfulData7,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    // saveState('backgrounds', orderByData7);
    yield put(backgroundDataSuccess(orderByData7));

    const contentful_techniqueMock_1 = extractEntryDataFromResponse(techniqueMock_1);
    const contentful_techniqueMock_2 = extractEntryDataFromResponse(techniqueMock_2);
    const contentful_techniqueMock_3 = extractEntryDataFromResponse(techniqueMock_3);

    const orderByData777 = orderBy(
      concat(contentful_techniqueMock_1, contentful_techniqueMock_2, contentful_techniqueMock_3),
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    // saveState('techniques', orderByData777);
    yield put(techniquesDataSuccess(orderByData777));

    const contentful_RitualsMock_1 = extractEntryDataFromResponse(ritualsMock_1);
    const contentful_RitualsMock_2 = extractEntryDataFromResponse(ritualsMock_2);
    const contentful_RitualsMock_3 = extractEntryDataFromResponse(ritualsMock_3);

    const orderByData7771 = orderBy(
      concat(contentful_RitualsMock_1, contentful_RitualsMock_2, contentful_RitualsMock_3),
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    // saveState('rituals', orderByData7771);
    yield put(ritualDataSuccess(orderByData7771));
  } catch (e) {
    console.log(e)
    //
  }
}

function* handleDisciplineData() {

  const contentful_discipline_1 = extractEntryDataFromResponse(discipline_1);
  const contentful_discipline_2 = extractEntryDataFromResponse(discipline_2);
  const contentful_discipline_3 = extractEntryDataFromResponse(discipline_3);
  const contentful_discipline_4 = extractEntryDataFromResponse(discipline_4);
  const contentful_discipline_5 = extractEntryDataFromResponse(discipline_5);

  try {
    const orderByData6 = orderBy(
      concat(contentful_discipline_1,contentful_discipline_2,contentful_discipline_3,contentful_discipline_4,contentful_discipline_5),
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(disciplineDataSuccess(orderByData6));
  } catch (e) {
    console.log(e);
    //
  }
}
export default function* appSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, handleGetAppData);
  yield takeLatest(DISCIPLINES_DATA, handleDisciplineData);
}

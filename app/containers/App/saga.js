import {
  call,
  put,
  debounce,
  takeLatest,
  select,
  delay,
  take,
} from 'redux-saga/effects';
import {
  orderBy,
  isEmpty,
  filter,
  sortBy,
  uniqBy,
  get,
  last,
  size,
  isEqual,
} from 'lodash';
import moment from 'moment';
import localforage from 'localforage';
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
import apiContentful from '../../utils/contentfulUtils/api/contentful/contentful';

// Individual exports for testing

const dummyConfig = {
  // Force WebSQL; same as using setDriver()
  name: 'myApp',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'WoDo', // Should be alphanumeric, with underscores.
};

localforage.config(dummyConfig);

const clear = async (config = dummyConfig) => {
  localforage.clear(config);
};

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
    appData: { skip, limit, hasMore, data: contentfulDataApi },
    attributes: { data: arributesData },
    backgrounds: { data: backgroundsData },
    clans: { data: clansData },
    disciplines: { data: DisciplinesData },
    flaws: { data: flawsData },
    merits: { data: meritsData },
    skills: { data: skillsData },
    techniques: { data: techniquesData },
  } = appState;

  let updateOnceInADay = 0;

  const parsedDataResponse = yield call(
    [localforage, localforage.getItem],
    'contentfulData',
  );

  const lastSycnAt = yield call([localforage, localforage.getItem], 'sync-at');

  const parsedData = JSON.parse(parsedDataResponse);

  const parsedDataSize = size(parsedData);
  const lastItem = get(last(parsedData), 'total_item');

  const checkSavedDataExpiryAt = parsedDataSize > 1290;

  if (lastSycnAt) {
    const lastSavedData = JSON.parse(lastSycnAt);
    const currentTime = JSON.parse(JSON.stringify(moment()));
    updateOnceInADay = moment(currentTime).diff(lastSavedData, 'days');
  }
  if (updateOnceInADay > 0) {
    clear();
  }

  if (!checkSavedDataExpiryAt && updateOnceInADay === 0) {
    try {
      const response = yield call(apiContentful, {
        skip,
        limit,
      });
      const contentfulData = yield Promise.resolve(
        response.getParentEntriesAsync,
      );
      localforage.setItem('sync-at', JSON.stringify(moment()));
      saveState('contentfulData', contentfulDataApi);
      yield put(getDataSuccess(contentfulData));
    } catch (e) {
      // ToDo:
    }
  }

  if (checkSavedDataExpiryAt) {
    const clanAppData = filter(parsedData, o => o.inClanMerits);
    const orderByData2 = orderBy(
      clanAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(clanDataSuccess(orderByData2));
    const flawsAppData = sortBy(filter(parsedData, o => o.flaw), 'flaw');
    const orderByData3 = orderBy(
      flawsAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(flawsDataSuccess(orderByData3));
    const meritAppData = sortBy(filter(parsedData, o => o.merit), 'merit');
    const meritByData4 = orderBy(
      meritAppData,
      [item => getItems(item).toLowerCase()],
      ['asc'],
    );
    yield put(meritsDataSuccess(meritByData4));
    console.log(arributesData);
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

// function* handleDisciplineDataApiCall() {
//   const appState = yield select(makeSelectApp());

//   const {
//     appData: { skip, limit },
//   } = appState;
//   try {
//     const response10 = yield call(apiContentful, {
//       query: 'discipline',
//       select: 'fields,sys.id',
//       parents: '',
//       skip,
//       limit,
//     });
//     const contentfulData1 = yield Promise.resolve(
//       response10.getParentEntriesAsync,
//     );
//   } catch (e) {
//     console.log(e);
//   }
// }

// const response = localforage.getItem('disciplines');
// console.log(response);
// const body = yield call([response, response.json]);
// const myCustomFnc = data1 => data1;

// const localDisciplineData = yield call([
//   localforage.getItem('disciplines'),
//   myCustomFnc,
// ]);

// console.log(localDisciplineData);

//   localforage.getItem('disciplines', function* handleDisciplineDataApiCall(
//     value,
//   ) {
//     // if err is non-null, we got an error. otherwise, value is the value
//     const parsedData = JSON.parse(value);
//     const parsedDataSize = size(parsedData);
//     const totalItems = get(last(parsedData), 'total_items');
//     const checkSavedDataExpiryAt = isEqual(parsedDataSize, totalItems);
//     if (!checkSavedDataExpiryAt) {
//       try {
// //     const response10 = yield call(apiContentful, {
// //       query: 'discipline',
// //       select: 'fields,sys.id',
// //       parents: '',
// //       skip,
// //       limit,
// //     });
// //     const contentfulData1 = yield Promise.resolve(
// //       response10.getParentEntriesAsync,
// //     );
// //   } catch (e) {
// //     console.log(e);
// //   }
//     }
//   });

// if (!checkSavedDataExpiryAt) {
//   try {
//     const response10 = yield call(apiContentful, {
//       query: 'discipline',
//       select: 'fields,sys.id',
//       parents: '',
//       skip,
//       limit,
//     });
//     const contentfulData1 = yield Promise.resolve(
//       response10.getParentEntriesAsync,
//     );

//     const orderByData6 = orderBy(
//       contentfulData1,
//       [item => getItems(item).toLowerCase()],
//       ['asc'],
//     );
//     saveState('disciplines', orderByData6);
//     yield put(disciplineDataSuccess(orderByData6));
//   } catch (e) {
//     //
//   }
// }
//

function* handleDisciplineData() {
  const appState = yield select(makeSelectApp());
  let updateOnceInADay = 0;
  const {
    appData: { skip, limit },
    disciplines: { data: disciplineData },
  } = appState;

  const parsedDataResponse = yield call(
    [localforage, localforage.getItem],
    'disciplines',
  );

  const lastSycnAt = yield call([localforage, localforage.getItem], 'sync-at');
  const parsedData = JSON.parse(parsedDataResponse);

  const parsedDataSize = size(parsedData);
  const lastItem = get(last(parsedDataSize), 'total_item');
  const checkSavedDataExpiryAt = parsedDataSize < 390;
  console.log(skip, limit);
  if (lastSycnAt) {
    const lastSavedData = JSON.parse(lastSycnAt);
    const currentTime = JSON.parse(JSON.stringify(moment()));
    updateOnceInADay = moment(currentTime).diff(lastSavedData, 'days');
  }

  if (updateOnceInADay > 0) {
    clear();
  }

  console.log(skip, limit, checkSavedDataExpiryAt, parsedData);
  if (!checkSavedDataExpiryAt && updateOnceInADay === 0) {
    try {
      const response10 = yield call(apiContentful, {
        query: 'discipline',
        select: 'fields,sys.id',
        parents: '',
        skip,
        limit,
      });
      const contentfulData1 = yield Promise.resolve(
        response10.getParentEntriesAsync,
      );

      const orderByData6 = orderBy(
        contentfulData1,
        [item => getItems(item).toLowerCase()],
        ['asc'],
      );
      saveState('disciplines', disciplineData);
      localforage.setItem('sync-at', JSON.stringify(moment()));
      yield put(disciplineDataSuccess(orderByData6));
    } catch (e) {
      console.log(e);
    }
  }
}

export default function* appSaga() {
  yield takeLatest(GET_DATA, handleGetAppData);
  yield takeLatest(DISCIPLINES_DATA, handleDisciplineData);
}

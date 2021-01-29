import { call, put, select, takeLatest } from 'redux-saga/effects';
import { orderBy } from 'lodash';
import apiContentful from '../../utils/contentfulUtils/api/contentful/contentful';
import { GET_DISCIPLINES } from './constants';
import { makeSelectDisciplines } from './selectors';
import { disciplinesError, disciplinesSuccess } from './actions';

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

function* getDisciplinesData() {
  const disciplineState = yield select(makeSelectDisciplines());
  const { skip, limit } = disciplineState;
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

    yield put(disciplinesSuccess(orderByData));
  } catch (e) {
    yield put(disciplinesError(e));
  }
}
// Individual exports for testing
export default function* disciplinesSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DISCIPLINES, getDisciplinesData);
}

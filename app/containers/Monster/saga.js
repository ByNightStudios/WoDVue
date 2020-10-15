/* eslint-disable func-names */
import { call, put, debounce } from 'redux-saga/effects';
import { orderBy } from 'lodash';
import { GET_DROP_DOWN_ITEMS } from './constants';
import { dropDownItemsError, dropDownItemsSuccess } from './actions';
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

// Individual exports for testing
export default function* monsterSaga() {
  // See example in containers/HomePage/saga.js
  yield debounce(2000, GET_DROP_DOWN_ITEMS, getItemsData);
}

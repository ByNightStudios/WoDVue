import { put, takeLatest, call } from 'redux-saga/effects';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { DEFAULT_ACTION } from './constants';
import { defaultActionSuccess, defaultActionFail } from './actions';
const contentful = require('contentful');

function* getContentPage() {
  try {
    const client = contentful.createClient({
      space: 'yicuw1hpxsdg',
      accessToken: 'rIeZdr6VyNARtIfAETRuivhCs4gaQNF8NWdYyTstgjo',
    });

    const response = client.getEntry('2dTZzlq6zZDtWxn3gycudK').then(entry => {
      const myObject = {
        title: entry.fields.title,
        quote: documentToHtmlString(entry.fields.quote),
        description: documentToHtmlString(entry.fields.description),
        system: documentToHtmlString(entry.fields.system),
        sourceBook: entry.fields.sourceBook[0].fields,
      };
      return myObject;
    });
    const responseJson = yield response;
    yield put(defaultActionSuccess(responseJson));
  } catch (e) {
    yield put(defaultActionFail(e));
    // yield put(dropDownItemsError(e));
  }
}
// Individual exports for testing
export default function* quickStartSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(DEFAULT_ACTION, getContentPage);
}

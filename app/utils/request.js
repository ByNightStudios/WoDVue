/* eslint-disable no-undef */
/* eslint-disable camelcase */
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import localforage from 'localforage';
// eslint-disable-next-line no-unused-vars
import { isEmpty, isEqual, get, intersectionWith, map } from 'lodash';
import { message } from 'antd';
import helpers from './contentfulUtils/helpers/helpers';

const cache = setupCache({
  maxAge: 1 * 30 * 1000,
  store: localforage,
});

const getClanArt = (item, data) => {
  if (item.clanArt) {
    const mediaData = {
      ...item,
      clanArt:
        item.clanArt[0].sys.id === data[0].sys.id
          ? data[0].fields.file.url
          : '',
    };
    return mediaData;
  }
  if (item.clanSymbol) {
    const mediaData = {
      ...item,
      clanSymbol:
        item.clanSymbol[0].sys.id === data[0].sys.id
          ? data[0].fields.file.url
          : '',
    };
    return mediaData;
  }
  return item;
};

const getFieldValue = (field, fieldName, assestData) => {
  const type = helpers.typeOf(field);
  switch (type) {
    case 'number':
    case 'string':
      return getTrimmedValue(field);
    case 'array':
      return getArrayValue(field, fieldName, assestData);
    case 'object':
      return getObjectValue(field, fieldName, assestData);
    case 'boolean':
      return getBooleanValue(field);
    default:
      return null;
  }
};

const getObjectValue = (field, fieldName, assestData) => {
  if (fieldName === 'sourceBook') {
    return intersectionWith(get(assestData, 'Entry', []), [field], (a, b) =>
      isEqual(a.sys.id, b.sys.id),
    );
  }
  if (field.sys) {
    return intersectionWith(get(assestData, 'Asset', []), [field], (a, b) =>
      isEqual(a.sys.id, b.sys.id),
    );
  }
  if (!isEmpty(field.content)) {
    const contentAry = field.content
      .map(c => c.content)
      .flat()
      .map(c => c.value);
    return contentAry;
  }
};

const getBooleanValue = field => field;

const getArrayValue = (field, fieldName, assestData) => {
  let inClanDiscipline = [];
  if (
    fieldName === 'inClanDisciplines' ||
    fieldName === 'inClanMerits' ||
    fieldName === 'flaws'
  ) {
    map(field, item => {
      if (item.sys) {
        const commonData = intersectionWith(
          get(assestData, 'Entry', []),
          field,
          (a, b) => {
            if (isEqual(a.sys.id, b.sys.id)) {
              return a.fields;
            }
          },
        );
        inClanDiscipline = commonData;
      }
    });
    return isEmpty(inClanDiscipline) ? field : inClanDiscipline;
  }

  return field;
};

const getTrimmedValue = field => {
  if (!isNaN(field)) {
    return field;
  }
  return field ? field.trim() : null;
};

const extractData = (entryData, assestData) => {
  const keys = Object.keys(entryData);
  const data = keys.reduce((entry, k) => {
    entry[k] = getFieldValue(entryData[k], k, assestData);
    entry[`${k}_html`] = getEntryData(entryData[k], assestData);
    return entry;
  }, {});
  return data;
};

const getEntryData = object => object;

const extractEntryDataFromResponse = resContentful => {
  const { items, includes } = resContentful.data;

  const itemObjects = items.map(i => ({
    ...i.fields,
    id: i.sys.id,
  }));
  const unsortedEntries = itemObjects.map(i => extractData(i, includes));

  const getUnsortedEntriesWithMedia = unsortedEntries.map(itemData =>
    getClanArt(itemData, get(includes, 'Asset', [])),
  );

  return getUnsortedEntriesWithMedia;
};

export const axiosInstance = axios.create({
  baseURL:
    'https://cdn.contentful.com/spaces/yicuw1hpxsdg/environments/master/entries',
  responseType: 'json',
  adapter: cache.adapter,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer rIeZdr6VyNARtIfAETRuivhCs4gaQNF8NWdYyTstgjo`,
  },
});

/* eslint no-param-reassign:0 */
axiosInstance.interceptors.request.use(config => config);

axiosInstance.interceptors.response.use(
  response => response,
  err => {
    message.error('Something went wrong');
    return Promise.reject(err);
  },
);

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(options) {
  return axiosInstance(options);
}

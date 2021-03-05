import { isEmpty, isEqual, get, intersectionWith, map } from 'lodash';
import helpers from './contentfulUtils/helpers/helpers';

const getEntryData = (object, assestData) => object;

const getBooleanValue = field => field;

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

const addInitialVals = (entries, initialVals) =>
  entries.map(e => ({
    ...e,
    ...initialVals,
  }));

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

const getTrimmedValue = field => {
  if (!isNaN(field)) {
    return field;
  }
  return field ? field.trim() : null;
};

const extractFieldValue = fieldObj => {
  if (
    fieldObj &&
    fieldObj.content &&
    fieldObj.content[0] &&
    fieldObj.content[0].content &&
    fieldObj.content[0].content[0] &&
    fieldObj.content[0].content[0].value
  ) {
    return fieldObj.content[0].content[0].value.trim();
  }
  return null;
};

const extractData = (entryData, assestData, total) => {
  const keys = Object.keys(entryData);
  const data = keys.reduce((entry, k) => {
    entry[k] = getFieldValue(entryData[k], k, assestData);
    entry[`${k}_html`] = getEntryData(entryData[k], assestData);
    entry.total_items = total;
    return entry;
  }, {});
  return data;
};

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

const extractEntryDataFromResponse = (
  resContentful,
  initialVals = null,
  sortField = null,
) => {
  if (!isEmpty(resContentful)) {
    const { items, includes, total } = resContentful;

    const itemObjects = map(items, i => ({
      ...i.fields,
      id: i.sys.id,
    }));
    const unsortedEntries = itemObjects.map(i =>
      extractData(i, includes, total),
    );
    const getUnsortedEntriesWithMedia = unsortedEntries.map(itemData =>
      getClanArt(itemData, get(includes, 'Asset', [])),
    );

    return getUnsortedEntriesWithMedia;
  }
  return false;
}

export default extractEntryDataFromResponse;
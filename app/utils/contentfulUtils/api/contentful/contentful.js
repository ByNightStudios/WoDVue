/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-self-assign */
/* eslint-disable indent */

import axios from 'axios';
import helpers from '../../helpers/helpers';

let http = null;
let skipData = null;
let limitData = null;
let queryData = 'any';
let selectData = '';

class APIContentful {
  constructor({ url }) {
    http = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer rIeZdr6VyNARtIfAETRuivhCs4gaQNF8NWdYyTstgjo`,
      },
    });

    axios.interceptors.request.use(
      config => {
        // spinning start to show
        console.log('this is a loading');
        return config;
      },
      error => Promise.reject(error),
    );

    axios.interceptors.response.use(
      response => {
        // spinning hide
        console.log('this is my response');

        return response;
      },
      error => Promise.reject(error),
    );

    this.spaceId = 'yicuw1hpxsdg';
    this.environmentId = `master`;
    this.resourceBase = `/spaces/${this.spaceId}/environments/${
      this.environmentId
    }`;

    // this is an array of objects, each object has some necessary
    // info about a contentType
    this.contentTypeInfo = this.buildContentTypeInfo();
    this.getContentByTypeAsync = this.getContentByTypeAsync();
    this.getParentEntriesAsync = this.getParentEntriesAsync();
  }

  getResource(resource) {
    return `${this.resourceBase}\\${resource}`;
  }

  buildContentTypeInfo() {
    const contentTypeInfoStr =
      'Disciplines|discipline|power|title|level|,Clans & Bloodlines|clans||title|,Skills|skills||title|,Backgrounds|backgrounds||title|,Merits|merits||merit|,Flaws|flaws||flaw,Techniques|techniques||technique,Attributes|attributes||attribute';
    return contentTypeInfoStr.split(',').map(ciStr => {
      const [
        contentType,
        contentTypeId,
        parentKeyField,
        sortParent,
        sortChild,
      ] = ciStr.split('|');
      return {
        contentType,
        contentTypeId, // content type id we use when querying contentful
        parentKeyField, // the field we look for when getting child entries
        sortParent, // field we sort parent entries by
        sortChild, // field we sort child entries by
      };
    });
  }

  getContentTypeId(contentType) {
    console.log(contentType);
    const idx = this.contentTypeInfo.findIndex(
      cti => cti.contentType === contentType,
    );
    return idx > -1 ? this.contentTypeInfo[idx].contentTypeId : null;
  }

  getContentByTypeAsync(contentType, skip, limit) {
    const contentTypeInfo = this.getContentTypeInfoByField(
      'contentTypeId',
      contentType,
    );
    if (!contentTypeInfo) {
      // throw new Error(
      //   `Error : getContentByType : getContentTypeInfo is null for contentType ${contentType}`,
      // );
      return null;
    }
    const {
      contentTypeId,
      parentKeyField,
      sortParent,
      sortChild,
    } = contentTypeInfo;

    const parentEntries = this.getParentEntriesAsync(
      contentTypeId,
      sortParent,
      parentKeyField !== '',
      skip,
      limit,
    );
    let allEntryData = parentEntries;
    if (parentKeyField !== '') {
      allEntryData = this.loadChildEntriesAsync(
        parentEntries,
        contentTypeId,
        parentKeyField,
        sortChild,
      );
    }
    return allEntryData;
  }

  async getParentEntriesAsync(
    contentTypeId = 'clans',
    sortParent,
    hasChildren,
  ) {
    const queryGetParentEntries = {
      content_type: contentTypeId,
      select: 'fields,sys.id',
    };
    if (hasChildren) {
      queryGetParentEntries['fields.parent'] = true;
    }
    const resourceEntries = this.getResource('entries');
    const resParentEntries = await this.queryContentfulAsync(
      resourceEntries,
      queryGetParentEntries,
    );
    const entryData = this.extractEntryDataFromResponse(
      resParentEntries,
      hasChildren ? { expand: false, contentTypeId } : { contentTypeId },
      sortParent,
    );
    return entryData;
  }

  async loadChildEntriesAsync(
    parentEntries,
    contentTypeId,
    parentKeyField,
    sortChild,
  ) {
    const promises = parentEntries.map(pe =>
      this.getChildEntriesForParentAsync(
        contentTypeId,
        parentKeyField,
        pe[parentKeyField],
        pe.id,
        sortChild,
      ),
    );
    const allChildEntries = await Promise.all(promises);
    parentEntries.forEach(pe => {
      const childrenIdx = allChildEntries.findIndex(
        ce => ce.length > 0 && ce[0][parentKeyField] === pe[parentKeyField],
      );
      pe.children = childrenIdx === -1 ? [] : allChildEntries[childrenIdx];
    });

    return parentEntries;
  }

  async getChildEntriesForParentAsync(
    contentTypeId,
    parentKeyField,
    parentFieldValue,
    parentId,
    sortChild,
  ) {
    const keyField = `fields.${parentKeyField}`;
    const query = {
      content_type: contentTypeId,
      'fields.parent': false,
    };
    query[keyField] = parentFieldValue;
    const resource = this.getResource('entries');
    const resChildEntries = await this.queryContentfulAsync(resource, query);
    const childEntries = this.extractEntryDataFromResponse(
      resChildEntries,
      { contentTypeId: 'clans', parentId },
      sortChild,
    );
    return childEntries;
  }

  extractData(entryData) {
    const keys = Object.keys(entryData);
    const data = keys.reduce((entry, k) => {
      entry[k] = this.getFieldValue(entryData[k]);
      return entry;
    }, {});
    return data;
  }

  getFieldValue(field) {
    const type = helpers.typeOf(field);
    switch (type) {
      case 'number':
      case 'string':
        return this.getTrimmedValue(field);
      case 'array':
        return this.getArrayValue(field);
      case 'object':
        return this.getObjectValue(field);
      default:
        return null;
    }
  }

  getObjectValue(field) {
    const contentAry = field.content
      .map(c => c.content)
      .flat()
      .map(c => c.value);
    return contentAry;
  }

  getArrayValue(field) {
    return field;
  }

  addInitialVals(entries, initialVals) {
    return entries.map(e => ({
      ...e,
      ...initialVals,
    }));
  }

  extractEntryDataFromResponse(
    resContentful,
    initialVals = null,
    sortField = null,
  ) {
    const { items } = resContentful.data;
    const itemObjects = items.map(i => ({
      ...i.fields,
      id: i.sys.id,
    }));
    let unsortedEntries = itemObjects.map(i => this.extractData(i));
    if (initialVals) {
      unsortedEntries = this.addInitialVals(unsortedEntries, initialVals);
    }
    if (sortField) {
      const sorted = this.getSortedEntries(unsortedEntries, sortField);
      return sorted;
    }
    return unsortedEntries;
  }

  async queryContentfulAsync(resource) {
    return http.get(resource, {
      params: {
        content_type: queryData,
        select: selectData,
        skip: skipData,
        limit: limitData,
      },
    });
  }

  getContentTypeIdFromResponse(resContentful) {
    return resContentful.items[0].contentType.sys.id;
  }

  getContentTypeInfoByField(fieldName, fieldValue) {
    const idx = this.contentTypeInfo.findIndex(
      cti => cti[fieldName] === fieldValue,
    );
    return idx > -1 ? this.contentTypeInfo[idx] : null;
  }

  getSortedEntries(unsortedData, sortField) {
    return unsortedData.sort((a, b) => {
      const fieldA =
        a[sortField] && isNaN(a[sortField])
          ? a[sortField].toUpperCase()
          : a[sortField];
      const fieldB =
        b[sortField] && isNaN(b[sortField])
          ? b[sortField].toUpperCase()
          : b[sortField];
      if (fieldA < fieldB) {
        return -1;
      }
      if (fieldA > fieldB) {
        return 1;
      }
      return 0;
    });
  }

  getTrimmedValue(field) {
    if (!isNaN(field)) {
      return field;
    }
    return field ? field.trim() : null;
  }

  extractFieldValue(fieldObj) {
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
  }
}

export default function apiContentful(params) {
  const { skip, limit, query, select } = params;
  skipData = skip;
  limitData = limit;
  queryData = query;
  selectData = select;
  return new APIContentful({
    url: 'https://cdn.contentful.com',
  });
}

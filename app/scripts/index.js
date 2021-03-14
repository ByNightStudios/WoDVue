/* eslint-disable no-console */
const contentful = require('contentful');
const fs = require('fs').promises;
const safeJsonStringify = require('safe-json-stringify');

const client = contentful.createClient({
  space: 'yicuw1hpxsdg',
  accessToken: 'rIeZdr6VyNARtIfAETRuivhCs4gaQNF8NWdYyTstgjo',
});

// let skipCount1 = 0;
// let hasMore = false;

const storeData = (data, path) => {
  try {
    fs.writeFile(path, safeJsonStringify(data));
  } catch (err) {
    console.error(err);
  }
};

async function writeToFile(fileName, data) {
  storeData(data, fileName);
}

const getDisciplinesFiles = () => {
  for (let skipCount = 0; skipCount <= 400; skipCount += 100) {
    console.log('Api calling of Disciplines');
    client
      .getEntries({
        content_type: 'discipline',
        skip: skipCount,
        limit: 100,
        select: 'fields,sys.id',
      })
      .then(entries => writeToFile(`discipline_${skipCount}.json`, entries));
    console.log('Create File Done of clans');
  }
};

const getRitualsFiles = () => {
  for (let skipCount = 0; skipCount <= 200; skipCount += 100) {
    console.log('Api calling of rituals');
    client
      .getEntries({
        content_type: 'rituals',
        skip: skipCount,
        limit: 100,
        select: 'fields,sys.id',
      })
      .then(entries => writeToFile(`rituals_${skipCount}.json`, entries));
    console.log('Create File Done of rituals');
  }
};

const getTechniquesFiles = () => {
  for (let skipCount = 0; skipCount <= 200; skipCount += 100) {
    console.log('Api calling of techniques');
    client
      .getEntries({
        content_type: 'techniques',
        skip: skipCount,
        limit: 100,
        select: 'fields,sys.id',
      })
      .then(entries => writeToFile(`techniques_${skipCount}.json`, entries));
    console.log('Create File Done of rituals');
  }
};

const getMeritsFiles = () => {
  for (let skipCount = 0; skipCount <= 400; skipCount += 100) {
    console.log('Api calling of merits');
    client
      .getEntries({
        content_type: 'merits',
        skip: skipCount,
        limit: 100,
        select: 'fields,sys.id',
      })
      .then(entries => writeToFile(`merits_${skipCount}.json`, entries));
    console.log('Create File Done of merits');
  }
};

const getFlawsFiles = () => {
  for (let skipCount = 0; skipCount <= 200; skipCount += 100) {
    console.log('Api calling of flaws');
    client
      .getEntries({
        content_type: 'flaws',
        skip: skipCount,
        limit: 100,
        select: 'fields,sys.id',
      })
      .then(entries => writeToFile(`flaws_${skipCount}.json`, entries));
    console.log('Create File Done of flaws');
  }
};

console.log('Api calling of CLANS')
client
  .getEntries({
    content_type: 'clans',
    skip: 0,
    limit: 100,
    select: 'fields,sys.id',
  })
  .then(entries => writeToFile('clans.json', entries));
console.log('Create File Done of clans');

setTimeout(() => {
  getDisciplinesFiles();
}, 2000);


setTimeout(() => {
  getRitualsFiles();
}, 3000);


setTimeout(() => {
  getTechniquesFiles();
}, 4000);


setTimeout(() => {
  client
  .getEntries({
    content_type: 'skills',
    skip: 0,
    limit: 100,
    select: 'fields,sys.id',
  })
  .then(entries => writeToFile('skills.json', entries));
  console.log('Create File Done of skills');;
}, 5000);


setTimeout(() => {
  getMeritsFiles();
}, 6000);

setTimeout(() => {
  getFlawsFiles();
}, 7000);


setTimeout(() => {
  console.log('Api call of attributes');

  client
  .getEntries({
    content_type: 'attributes',

    skip: 0,
    limit: 100,
    select: 'fields,sys.id',
  })
  .then(entries => writeToFile('attributes.json', entries));
  console.log('Create File Done of attributes');
}, 8000);

setTimeout(() => {
  console.log('Api call of skills');

console.log('Api call of backgrounds');
client
  .getEntries({
    content_type: 'backgrounds',
    skip: 0,
    limit: 100,
    select: 'fields,sys.id',
  })
  .then(entries => writeToFile('backgrounds.json', entries));
console.log('Create File Done of backgrounds');

console.log('complete all files');
}, 9000);

setTimeout(() => {
  process.exit();
}, 10000);


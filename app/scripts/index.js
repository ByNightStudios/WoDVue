/* eslint-disable no-console */
const contentful = require('contentful');
const fs = require('fs').promises;
const safeJsonStringify = require('safe-json-stringify');

const client = contentful.createClient({
  space: 'yicuw1hpxsdg',
  accessToken: 'rIeZdr6VyNARtIfAETRuivhCs4gaQNF8NWdYyTstgjo',
});

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

const getContentPages = () => {
  for (let skipCount = 0; skipCount <= 100; skipCount += 100) {
    client
      .getEntries({
        content_type: 'contentPages',
        skip: skipCount,
        limit: 100,
        select: 'fields,sys.id',
      })
      .then(entries => writeToFile(`contentPages_${skipCount}.json`, entries));
    console.log('Create File Done of contentPages');
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
  getTechniquesFiles();
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
  console.log('Api call of attributes');

  client
    .getEntries({
      content_type: 'attributes',

      skip: 0,
      limit: 100,
      select: 'fields,sys.id',
    })
    .then(entries => {
      writeToFile('attributes.json', entries);
      console.log('Create File Done of skills');

      client
        .getEntries({
          content_type: 'backgrounds',
          skip: 0,
          limit: 100,
          select: 'fields,sys.id',
        })
        .then(entries2 => {
          writeToFile('backgrounds.json', entries2);
          getContentPages();
        });
      console.log('Create File Done of backgrounds');
    });
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
  getFlawsFiles();
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
  getRitualsFiles();
};

console.log('Api calling of CLANS');
client
  .getEntries({
    content_type: 'clans',
    skip: 0,
    limit: 100,
    select: 'fields,sys.id',
  })
  .then(async entries => {
    await writeToFile('clans.json', entries);
    getDisciplinesFiles();
  });

client
  .getEntries({
    content_type: 'skills',
    skip: 0,
    limit: 100,
    select: 'fields,sys.id',
  })
  .then(entries => {
    writeToFile('skills.json', entries);
    getMeritsFiles();
  });

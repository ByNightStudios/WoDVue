const contentful = require('contentful');
const fs = require('fs');
const { parse, stringify } = require('flatted');

const client = contentful.createClient({
  space: 'yicuw1hpxsdg',
  accessToken: 'rIeZdr6VyNARtIfAETRuivhCs4gaQNF8NWdYyTstgjo',
});

// let skipCount1 = 0;
// let hasMore = false;

client
  .getEntries({
    skip: 0,
    limit: 100,
  })
  .then(entry => {
    const object = {
      name: 'demo',
    };
    fs.writeFileSync('./api.json', stringify(object));
  });

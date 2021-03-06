const contentfulImport = require('contentful-import');

const options = {
  contentFile: './dataToImport.json',
  spaceId: 'yicuw1hpxsdg',
  managementToken: 'rIeZdr6VyNARtIfAETRuivhCs4gaQNF8NWdYyTstgjo',
  queryEntries: 'content_type=discipline',
};

contentfulImport(options)
  .then(() => {
    console.log('Data imported successfully');
  })
  .catch(err => {
    console.log('Oh no! Some errors occurred!', err);
  });

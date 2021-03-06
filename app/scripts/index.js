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

// const contentful = require('contentful');

// const client = contentful.createClient({
//   space: 'yicuw1hpxsdg',
//   accessToken: 'rIeZdr6VyNARtIfAETRuivhCs4gaQNF8NWdYyTstgjo',
// });

// client
//   .getEntries({
//     content_type: 'discipline',
//   })
//   .then(function(entry) {
//     // logs the entry metadata
//     console.log(entry);

//     // logs the field with ID title
//   });

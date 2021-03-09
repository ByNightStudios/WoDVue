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
  .then(entry => entry).then(data => {

    const csvApi = { api: `${data}`};
    // STEP 3: Writing to a file 
    fs.writeFile("./api.json", csvApi, err => { 
      if (err) throw err;  
      console.log("Done writing"); 
    });
  });



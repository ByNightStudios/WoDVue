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

    // STEP 3: Writing to a file 
    fs.writeFile("./api.json", JSON.stringify(entry), err => { 
        
      // Checking for errors 
      if (err) throw err;  
    
      console.log("Done writing"); // Success 
    }); 
  });



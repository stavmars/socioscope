const axios = require('axios');

// Fetches all DataSets from the old Socioscope.
const getDataSets = async () => {
  try {
    return await axios.get('http://www.socioscope.gr/api/datasets?lang=el');
  }
  catch (e) {
    console.error(e);
  }
};

// Migrates DataSets from the old to the new Socioscope database.
const migrateDataSets = async () => {
  const oldDataSets = await getDataSets();
  
  if (oldDataSets.data) {
    console.log(`Got ${Object.entries(oldDataSets.data).length} DataSets`);

    try {
      // Log in as the admin to the new Socioscope site.
      axios.post('http://localhost:8080/api/authenticate', {
        'username' : "admin",
        'password' : "admin",
        'rememberMe' : false
      }).then(async response => {
        if (response.headers) {
          for (const key in oldDataSets.data) {
            if (oldDataSets.data.hasOwnProperty(key)) {
              try {
                // Get the metadata of all DataSets.
                const greekData = await axios.get(`http://www.socioscope.gr/api/datasets/${oldDataSets.data[key].id}?lang=el`);
                const englishData = await axios.get(`http://www.socioscope.gr/api/datasets/${oldDataSets.data[key].id}?lang=en`)
                for (const key in greekData.data.dimensions) {
                  // Add each new dimension to the database.
                  try {
                    await axios.post('http://localhost:8080/api/dimensions',
                      {
                        'id' : greekData.data.dimensions[key].id,
                        'name' : {
                          'el' : greekData.data.dimensions[key].label,
                          'en' : englishData.data.dimensions[key].label
                        },
                        'type' : greekData.data.dimensions[key].type
                      },
                      {
                        headers : { 'Authorization': response.headers.authorization}
                      });
                  }
                  catch (e) {
                    console.error(`Dimension error : ${e}`);
                  }
                }
                for (const key in greekData.data.measures) {
                  // Add each new measure to the database.
                  try {
                    await axios.post('http://localhost:8080/api/measures',
                      {
                        'id' : greekData.data.measures[key].id,
                        'name' : {
                          'el' : greekData.data.measures[key].label,
                          'en' : englishData.data.measures[key].label
                        },
                        'unit' : greekData.data.measures[key].unitMeasure ? greekData.data.measures[key].unitMeasure.id : 'NO_UNIT'
                      },
                      {
                        headers : { 'Authorization': response.headers.authorization}
                      });
                  }
                  catch (e) {
                    console.error(`Measure error : ${e}`);
                  }
                }
                // Finally add the DataSet to the database.
                try {
                  await axios.post('http://localhost:8080/api/data-sets',
                    {
                      'id' : greekData.data.id,
                      'name' : {
                        'el' : greekData.data.label,
                        'en' : englishData.data.label
                      },
                      'type' : greekData.data.type,
                      'comment' : {
                        'el' : greekData.data.comment,
                        'en' : englishData.data.comment
                      },
                      'dimensions' : greekData.data.dimensions.map(entity => ({
                        'id' : entity.id
                      })),
                      'measures' : greekData.data.measures.map(entity => ({
                        'id' : entity.id
                      }))
                    },
                    {
                      headers: { 'Authorization': response.headers.authorization}
                    });
                }
                catch (e) {
                  console.error(`Dataset error : ${e}`);
                }
              }
              catch (e) {
                console.error(e);
              }
            }
          }
        }
      });
    }
    catch (e) {
      console.error(e);
    }
  }
};

const migrateCodes = async () => {
  try {
    // Log in as the admin to the new Socioscope site.
    axios.post('http://localhost:8080/api/authenticate', {
      'username': "admin",
      'password': "admin",
      'rememberMe': false
    }).then(async response => {
      if (response.headers) {
        // Get all existing Dimensions in the new Socioscope database.
        const dimensions = await axios.get('http://localhost:8080/api/dimensions', {
          headers: { 'Authorization': response.headers.authorization}
        });
        for (const ent in dimensions.data) {
          if (dimensions.data.hasOwnProperty(ent)) {
            // Get all Codes (gr/en) for each Dimension.
            const oldCodeGreek = await axios.get(`http://www.socioscope.gr/api/dimensions/${dimensions.data[ent].id}/codes?lang=el`);
            const oldCodeEnglish = await axios.get(`http://www.socioscope.gr/api/dimensions/${dimensions.data[ent].id}/codes?lang=en`);
            // Create each Code in the new Socioscope database
            if (oldCodeGreek.data && oldCodeEnglish.data) {
              for (const key in oldCodeGreek.data) {
                if (oldCodeGreek.data.hasOwnProperty(key) && oldCodeEnglish.data.hasOwnProperty(key)) {
                  try {
                    await axios.post('http://localhost:8080/api/dimension-codes', {
                      'dimensionId' : dimensions.data[ent].id,
                      'notation' : oldCodeGreek.data[key].id,
                      'name' : {
                        'el' : oldCodeGreek.data[key].label,
                        'en' : oldCodeEnglish.data[key].label
                      },
                      'description' : {
                        'el' : oldCodeGreek.data[key].description ? oldCodeGreek.data[key].description : '',
                        'en' : oldCodeEnglish.data[key].description ? oldCodeEnglish.data[key].description : ''
                      },
                      'parentId' : oldCodeGreek.data[key].parent ? oldCodeGreek.data[key].parent : '',
                      'order' : oldCodeGreek.data[key].order ? oldCodeGreek.data[key].order : '',
                      'color' : oldCodeGreek.data[key].color ? oldCodeGreek.data[key].color : ''
                    }, {
                      headers: { 'Authorization': response.headers.authorization}
                    })
                  } catch (e) {
                    console.error(e);
                  }
                }
              }
            }
          }
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const args = process.argv.slice(2);

if (args.length > 1) {
  console.log("Too many arguments. Please re-run using -h/--help for execution info!");
  return;
}

switch (args[0]) {
  case 'datasets' :
    console.log("Importing DataSets from www.socioscope.gr");
    migrateDataSets();
    break;
  case 'codes' :
    console.log("Importing Codes for Dimensions in database from www.socioscope.gr");
    migrateCodes();
    break;
  case '-h' :
  case '--help' :
    console.log("Possible executions :\n" +
      "\t node migration.js datasets\n" +
      "\t node migration.js codes");
    break;
  default:
    console.log("Please re-run using -h/--help for execution info!");
}

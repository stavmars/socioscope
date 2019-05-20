const axios = require('axios');

// Fetches all DataSets from the old socioscope.
const getDataSets = async () => {
  try {
    return await axios.get('http://www.socioscope.gr/api/datasets?lang=el');
  }
  catch (e) {
    console.error(e);
  }
};

// Migrates data from the old to the new socioscope database.
const migrateData = async () => {
  const oldDataSets = await getDataSets();
  
  if (oldDataSets.data) {
    console.log(`Got ${Object.entries(oldDataSets.data).length} DataSets`);

    try {
      // Log in as the admin to the new socioscope site.
      axios.post('http://localhost:9000/api/authenticate', {
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
                    await axios.post('http://localhost:9000/api/dimensions',
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
                    await axios.post('http://localhost:9000/api/measures',
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
                  await axios.post('http://localhost:9000/api/data-sets',
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

migrateData();


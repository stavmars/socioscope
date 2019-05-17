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
                await axios.get(`http://www.socioscope.gr/api/datasets/${oldDataSets.data[key].id}?lang=el`)
                  .then(async metaData => {
                    for (const key in metaData.data.dimensions) {
                      // Add each new dimension to the database.
                      try {
                        await axios.post('http://localhost:9000/api/dimensions',
                          {
                            'id' : metaData.data.dimensions[key].id,
                            'name' : metaData.data.dimensions[key].label,
                            'type' : metaData.data.dimensions[key].type
                          },
                          {
                            headers : { 'Authorization': response.headers.authorization}
                          });
                      }
                      catch (e) {
                        console.error(`Dimension error : ${e}`);
                      }
                    }
                    for (const key in metaData.data.measures) {
                      // Add each new measure to the database.
                      try {
                        await axios.post('http://localhost:9000/api/measures',
                          {
                            'id' : metaData.data.measures[key].id,
                            'name' : metaData.data.measures[key].label,
                            'unit' : metaData.data.measures[key].unitMeasure ? metaData.data.measures[key].unitMeasure.id : 'NO_UNIT'
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
                          'id' : metaData.data.id,
                          'name' : metaData.data.label,
                          'type' : metaData.data.type,
                          'comment' : metaData.data.comment,
                          'dimensions' : metaData.data.dimensions.map(entity => ({
                            'id' : entity.id
                          })),
                          'measures' : metaData.data.measures.map(entity => ({
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
                  });
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


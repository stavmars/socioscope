const axios = require('axios');
const fs = require('fs');

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
  // Open a stream to append new DataSets to a .json file
  let dataSets = [];
  let dataSetStream = fs.createWriteStream("./migrate/dataSets.json");
  // Open a stream to append new Dimensions to a .json file
  let dimensions = [];
  let dimensionStream = fs.createWriteStream("./migrate/dimensions.json");
  // Open a stream to append new Measures to a .json file
  let measures = [];
  let measureStream = fs.createWriteStream("./migrate/measures.json");

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
                const englishData = await axios.get(`http://www.socioscope.gr/api/datasets/${oldDataSets.data[key].id}?lang=en`);
                for (const key in greekData.data.dimensions) {
                  // Add each new dimension to the database.
                  const dimension = {
                    'id' : greekData.data.dimensions[key].id,
                    'name' : {
                      'el' : greekData.data.dimensions[key].label,
                      'en' : englishData.data.dimensions[key].label
                    },
                    'type' : greekData.data.dimensions[key].type
                  };
                  // Append each new Dimension to the corresponding file
                  if (!dimensions.some(el => el.id === dimension.id)) {
                    dimensions.push(dimension);
                  }
                  try {
                    await axios.post('http://localhost:8080/api/dimensions', dimension,
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
                  const measure = {
                    'id' : greekData.data.measures[key].id,
                    'name' : {
                      'el' : greekData.data.measures[key].label,
                      'en' : englishData.data.measures[key].label
                    },
                    'unit' : greekData.data.measures[key].unitMeasure ? greekData.data.measures[key].unitMeasure.id : 'NO_UNIT'
                  };
                  // Append each new Measure to the corresponding file
                  if (!measures.some(el => el.id === measure.id)) {
                    measures.push(measure);
                  }
                  try {
                    await axios.post('http://localhost:8080/api/measures',measure,
                    {
                      headers : { 'Authorization': response.headers.authorization}
                    });
                  }
                  catch (e) {
                    console.error(`Measure error : ${e}`);
                  }
                }
                // Finally add the DataSet to the database.
                const dataSet = {
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
                };
                // Append each new DataSet to the corresponding file
                if (!dataSets.some(el => el.id === dataSets.id)) {
                  dataSets.push(dataSet);
                }
                try {
                  await axios.post('http://localhost:8080/api/data-sets', dataSet,
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
          console.log(`DataSets amount = ${dataSets.length} | Dimensions amount = ${dimensions.length} | Measures amount = ${measures.length}`);
          dataSetStream.write(JSON.stringify(dataSets));
          dimensionStream.write(JSON.stringify(dimensions));
          measureStream.write(JSON.stringify(measures));
        }
      });
    }
    catch (e) {
      console.error(e);
    }
  }
};

const migrateCodes = async () => {
  // Open a stream to append new Codes to a .json file
  let codes = [];
  let stream = fs.createWriteStream("./migrate/codes.json", {flags: 'a'});

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
                  const code = {
                    'id': `${dimensions.data[ent].id}-${oldCodeGreek.data[key].id}`,
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
                  };
                  // Append each new Code to the corresponding file
                  codes.push(code);
                  try {
                    await axios.post('http://localhost:8080/api/dimension-codes', codes, {
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
        console.log(`Codes amount = ${codes.length}`);
        stream.write(JSON.stringify(codes));
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

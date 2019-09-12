const axios = require('axios');
const fs = require('fs');

const importCollection = async (url, pass, dataType, importFile) => {

  try {
    // Log in as the admin to the new Socioscope site.
    axios.post(`${url}/api/authenticate`, {
      'username': "admin",
      'password': pass,
      'rememberMe': false
    }).then( async response => {
      if (response.headers) {
        const importData = JSON.parse(fs.readFileSync(importFile));
        if (dataType === 'code') {
          console.log(`Importing ${importData.length} Codes...`);
          importData.forEach( async row => {
            try {
              await axios.post(`${url}/api/dimension-codes`, row, {
                headers: { 'Authorization': response.headers.authorization}
              })
            } catch (e) {
              console.error(`Code error : ${e}`);
            }
          });
        } else if (dataType === 'dataset') {
          console.log(`Importing ${importData.length} DataSets...`);
          importData.forEach( async row => {
            try {
              await axios.post(`${url}/api/data-sets`, row,
              {
                headers: { 'Authorization': response.headers.authorization}
              });
            }
            catch (e) {
              if ( e.response.status === 400 ) {
                try {
                  await axios.put(`${url}/api/data-sets`, row,
                  {
                    headers: { 'Authorization': response.headers.authorization}
                  });
                }
                catch (e) {
                  console.error(`Update Dataset error : ${e}`);
                }
              } else {
                console.error(`Dataset error : ${e}`);
              }
            }
          });
        } else if (dataType === 'dimension') {
          console.log(`Importing ${importData.length} Dimensions...`);
          importData.forEach( async row => {
            try {
              await axios.post(`${url}/api/dimensions`, row,
              {
                headers : { 'Authorization': response.headers.authorization}
              });
            }
            catch (e) {
              if ( e.response.status === 400 ) {
                try {
                  await axios.put(`${url}/api/dimensions`, row,
                  {
                    headers: { 'Authorization': response.headers.authorization}
                  });
                }
                catch (e) {
                  console.error(`Update Dimension error : ${e}`);
                }
              } else {
                console.error(`Dimension error : ${e}`);
              }
            }
          });
        } else {
          console.log(`Importing ${importData.length} Measures...`);
          importData.forEach( async row => {
            try {
              await axios.post(`${url}/api/measures`,row,
              {
                headers : { 'Authorization': response.headers.authorization}
              });
            }
            catch (e) {
              if ( e.response.status === 400 ) {
                try {
                  await axios.put(`${url}/api/measures`, row,
                  {
                    headers: { 'Authorization': response.headers.authorization}
                  });
                }
                catch (e) {
                  console.error(`Update Measure error : ${e}`);
                }
              } else {
                console.error(`Measure error : ${e}`);
              }
            }
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }

}; 

const args = process.argv.slice(2);

if (args.length > 5) {
  console.log("Please re-run using -h/--help for execution info!");
  return;
} else if (args[0] && args[1] && args[2] && args[2] === 'all') {
  console.log('Beginning importing all meta-data at : ' + args[0]);
  importCollection(args[0], args[1], 'measure', 'migrate/measures.json');
  importCollection(args[0], args[1], 'dimension', 'migrate/dimensions.json');
  importCollection(args[0], args[1], 'code', 'migrate/codes.json');
  importCollection(args[0], args[1], 'dataset', 'migrate/dataSets.json');
  // console.log('Finished importing all meta-data at : ' + args[1]);
  return;
}

switch (args[2]) {
  case '-f' :
  case '--file' :
    if (!args[4]) {
      console.log("Please re-run using -h/--help for execution info!");
      break;
    }
    switch (args[3]) {
      case 'code' :
        console.log(`Importing Codes from file : ${args[4]}`);
        break;
      case 'dataset':
        console.log(`Importing DataSets from file : ${args[4]}`);
        break;
      case 'dimension':
        console.log(`Importing Dimensions from file : ${args[4]}`);
        break;
      case 'measure':
        console.log(`Importing Measures from file : ${args[4]}`);
        break;
      default:
        console.log("Please re-run using -h/--help for execution info!");
        return;
    }
    importCollection(args[0], args[1], args[3], args[4]);
    break;
  case '-h' :
  case '--help' :
    console.log("Possible executions :\n" +
      "\t node import.js <url> <pass> -f/--file [code | dataset | dimension | measure] FILE_NAME" +
      "\t node import.js <url> <pass> all");
    break;
  default:
    console.log("Please re-run using -h/--help for execution info!");
}
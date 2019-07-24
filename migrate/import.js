const axios = require('axios');
const fs = require('fs');

const importCollection = async (dataType, importFile) => {

  try {
    // Log in as the admin to the new Socioscope site.
    axios.post('http://localhost:8080/api/authenticate', {
      'username': "admin",
      'password': "admin",
      'rememberMe': false
    }).then( async response => {
      if (response.headers) {
        const importData = JSON.parse(fs.readFileSync(importFile));
        if (dataType === 'code') {
          console.log(`Importing ${importData.length} Codes...`);
          importData.forEach( async row => {
            try {
              await axios.post('http://localhost:8080/api/dimension-codes', row, {
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
              await axios.post('http://localhost:8080/api/data-sets', row,
              {
                headers: { 'Authorization': response.headers.authorization}
              });
            }
            catch (e) {
              if ( e.response.status === 400 ) {
                try {
                  await axios.put('http://localhost:8080/api/data-sets', row,
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
              await axios.post('http://localhost:8080/api/dimensions', row,
              {
                headers : { 'Authorization': response.headers.authorization}
              });
            }
            catch (e) {
              if ( e.response.status === 400 ) {
                try {
                  await axios.put('http://localhost:8080/api/dimensions', row,
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
              await axios.post('http://localhost:8080/api/measures',row,
              {
                headers : { 'Authorization': response.headers.authorization}
              });
            }
            catch (e) {
              if ( e.response.status === 400 ) {
                try {
                  await axios.put('http://localhost:8080/api/measures', row,
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

if (args.length > 3) {
  console.log("Please re-run using -h/--help for execution info!");
  return;
}

switch (args[0]) {
  case '-f' :
  case '--file' :
    if (!args[2]) {
      console.log("Please re-run using -h/--help for execution info!");
      break;
    }
    switch (args[1]) {
      case 'code' :
        console.log(`Importing Codes from file : ${args[2]}`);
        break;
      case 'dataset':
        console.log(`Importing DataSets from file : ${args[2]}`);
        break;
      case 'dimension':
        console.log(`Importing Dimensions from file : ${args[2]}`);
        break;
      case 'measure':
        console.log(`Importing Measures from file : ${args[2]}`);
        break;
      default:
        console.log("Please re-run using -h/--help for execution info!");
        return;
    }
    importCollection(args[1], args[2]);
    break;
  case '-h' :
  case '--help' :
    console.log("Possible executions :\n" +
      "\t node import.js -f/--file [code | dataset | dimension | measure] FILE_NAME");
    break;
  default:
    console.log("Please re-run using -h/--help for execution info!");
}
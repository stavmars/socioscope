const axios = require('axios');

const getData = async () => {
  try {
    return await axios.get('http://www.socioscope.gr/api/datasets?lang=el');
  }
  catch (e) {
    console.error(e);
  }
};

const postData = async dataSets => {
  try {
    axios.post('http://localhost:9000/api/authenticate', {
      'username' : "admin",
      'password' : "admin",
      'rememberMe' : false
    }).then(async response => {
      if (response.headers) {
        return await axios.post('http://localhost:9000/api/data-sets/list', dataSets, {
          headers: { 'Authorization': response.headers.authorization}
        });
      }
    });
  }
  catch (e) {
    console.error(e);
  }
};

const migrateData = async () => {
  const oldSocioscope = await getData();
  
  if (oldSocioscope.data) {
    console.log(`Got ${Object.entries(oldSocioscope.data).length} DataSets`);

    let dataSets = [];
    for (const key in oldSocioscope.data) {
      if (oldSocioscope.data.hasOwnProperty(key)) {
        dataSets.push({
          'name' : oldSocioscope.data[key].id,
          'comment' : oldSocioscope.data[key].label,
          'type' : oldSocioscope.data[key].type
        })
      }
    }
    postData(dataSets);
  }
};

migrateData();

const axios = require('axios');

const getData = async () => {
  try {
    return await axios.get('http://www.socioscope.gr/api/datasets?lang=el');
  }
  catch (e) {
    console.error(e);
  }
};

const migrateData = async () => {
  const oldSocioscope = await getData();
  
  if (oldSocioscope.data) {
    console.log(`Got ${Object.entries(oldSocioscope.data).length} DataSets`);

    try {
      axios.post('http://localhost:9000/api/authenticate', {
        'username' : "admin",
        'password' : "admin",
        'rememberMe' : false
      }).then(async response => {
        if (response.headers) {
          for (const key in oldSocioscope.data) {
            if (oldSocioscope.data.hasOwnProperty(key)) {
              try {
                return await axios.post('http://localhost:9000/api/data-sets',
                  {
                    'id' : oldSocioscope.data[key].id,
                    'name' : oldSocioscope.data[key].label,
                    'type' : oldSocioscope.data[key].type
                  },
                  {
                    headers: { 'Authorization': response.headers.authorization}
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


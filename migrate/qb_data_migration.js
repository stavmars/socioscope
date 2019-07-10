const axios = require('axios');
const _ = require('lodash');

// Transforms old socioscope observations to be loaded to the new platform
const transformQbData = async (dataset) => {
  // get observations for all measures of the dataset
  let requests = dataset.measures.map(measure => {
    return axios.post(`http://www.socioscope.gr/api/datasets/${dataset.id}/data`, {
      filters: {measure: measure.id}
    });
  });

  let responses = await Promise.all(requests);
  let obsByDims = {};
  let datasetDims = dataset.dimensions.map(dim => dim.id).sort();

  responses.forEach(res => {
    res.data.observations.forEach(obs => {
      let obsKey = datasetDims.reduce((previousValue, currentValue) =>
        previousValue + obs.dimensionValues[currentValue] + '-', ''
      );
      obsByDims[obsKey] = obsByDims[obsKey] || {
        dimensions: Object.keys(obs.dimensionValues).map(dimensionId => {
          return {id: dimensionId, value: dimensionId == 'refPeriod' ? obs.dimensionValues[dimensionId].split(':')[1] : obs.dimensionValues[dimensionId]}
        }),
        measures: {}
      };
      obsByDims[obsKey].measures[res.data.measure.id] = obs.value;
    });
  });

  return Object.values(obsByDims);
};


const migrateQbData = async () => {
  let authRes = await axios.post('http://localhost:8080/api/authenticate', {
    'username': "admin",
    'password': "admin",
    'rememberMe': false
  });

  // Fetch all datasets from old Socioscope
  let datasetsRes = await axios.get('http://www.socioscope.gr/api/datasets');
  let datasets = datasetsRes.data;

  for (let dataset of datasets) {
    try {
      console.log(`Uploading data for dataset ${dataset.id}`);

      // get dataset metadata
      let datasetRes = await axios.get(`http://www.socioscope.gr/api/datasets/${dataset.id}`);
      dataset = datasetRes.data;
      let obsChunks = _.chunk(await transformQbData(dataset), 1000);

      for (let obsChunk of obsChunks) {
        await axios.post(`http://localhost:8080/api/data-sets/${dataset.id}/data`, obsChunk,
          {
            headers: {'Authorization': authRes.headers.authorization}
          });
      }
    } catch (e) {
      console.error(`Error uploading data for dataset ${dataset.id}: ${e}`);
    }
  }
};

migrateQbData();



'use strict';

const client = require('../Connection.js');

async function selectAllRegions() {
  return client
    .query(getAllRegions())
    .then(result => result)
    .catch(err => console.log(err));
}

const getAllRegions = () => 'select * from regions';

module.exports = {
  selectAllRegions
};

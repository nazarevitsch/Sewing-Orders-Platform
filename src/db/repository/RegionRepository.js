'use strict';

const client = require('../Connection.js');

async function selectAllRegions() {
  const regions = await client
    .query(getAllRegions())
    .then(result => result)
    .catch(err => console.log(err));
  return regions.rows;
}

const getAllRegions = () => 'select * from regions';

module.exports = {
  selectAllRegions
};

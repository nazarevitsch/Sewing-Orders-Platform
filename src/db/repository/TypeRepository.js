'use strict';

const client = require('../Connection.js');

async function getAllTypes() {
  const types = await client
    .query(selectAllTypes())
    .then(result => result)
    .catch(err => console.log(err));
  return types.rows;
}

const selectAllTypes = () => 'select * from sewing_types';

module.exports = {
  getAllTypes
};

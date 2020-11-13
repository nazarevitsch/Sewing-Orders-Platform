'use strict';

const client = require('../Connection.js');

async function getAllTypes() {
  return client
    .query(selectAllTypes())
    .then(result => result)
    .catch(err => console.log(err));
}

const selectAllTypes = () => 'select * from sewing_types';

module.exports = {
  getAllTypes
};

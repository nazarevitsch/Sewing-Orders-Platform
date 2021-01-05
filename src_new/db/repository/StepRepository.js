'use strict';

const client = require('../Connection.js');

async function getAllSteps() {
  return client
    .query(selectAllSteps())
    .then(result => result)
    .catch(err => console.log(err));
}

const selectAllSteps = () => 'select * from manufacturing_steps';

module.exports = {
  getAllSteps
};

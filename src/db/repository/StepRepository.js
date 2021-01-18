'use strict';

const client = require('../Connection.js');

async function getAllSteps() {
  const steps = await client
    .query(selectAllSteps())
    .then(result => result)
    .catch(err => console.log(err));
  return steps.rows;
}

const selectAllSteps = () => 'select * from manufacturing_steps';

module.exports = {
  getAllSteps
};

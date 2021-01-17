'use strict';

const client = require('../Connection.js');

async function addProducersSteps(stepsList, producer_id) {
  return client
    .query(insertIntoProducersSteps(stepsList, producer_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getStepsByProducerId(producer_id) {
  let steps = await client
    .query(selectStepsByProducerId(producer_id))
    .then(result => result)
    .catch(err => console.log(err));
  return steps.rows;
}

async function deleteStepsByProducerId(producer_id) {
  return client
    .query(deleteStepsByProdId(producer_id))
    .then(result => result)
    .catch(err => console.log(err));
}

const deleteStepsByProdId = producer_id => `delete from producers_manufacturing_steps where producer_id = ${producer_id}`;

const selectStepsByProducerId = producer_id => `select * from producers_manufacturing_steps where producer_id = ${producer_id}`;

const insertIntoProducersSteps = (stepsList, producerId) => {
  let q = `insert into producers_manufacturing_steps(producer_id, manufacturing_step_id)
values (${producerId}, ${Number(stepsList[0])})`;
  for (let i = 1; i < stepsList.length; i++) {
    q += `, (${producerId}, ${Number(stepsList[i])})`;
  }
  return q;
};

module.exports = {
  addProducersSteps,
  getStepsByProducerId,
  deleteStepsByProducerId
};

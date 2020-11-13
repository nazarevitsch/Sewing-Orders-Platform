'use strict';

const client = require('../Connection.js');

async function addProducersTypes(typesList, producer_id) {
  return client
    .query(insertIntoProducersTypes(typesList, producer_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getTypesByProducerId(producer_id) {
  return client
    .query(selectTypesByProducerId(producer_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function deleteTypesByProducerId(producer_id) {
  return client
    .query(deleteTypesByProdId(producer_id))
    .then(result => result)
    .catch(err => console.log(err));
}

const deleteTypesByProdId = producer_id => `delete from producers_sewing_types where producer_id = ${producer_id}`;

const selectTypesByProducerId = producer_id => `select * from producers_sewing_types where producer_id = ${producer_id}`;

const insertIntoProducersTypes = (typesList, producerId) => {
  let q = `insert into producers_sewing_types(producer_id, sewing_type_id)
values (${producerId}, ${Number(typesList[0])})`;
  for (let i = 1; i < typesList.length; i++) {
    q += `, (${producerId}, ${Number(typesList[i])})`;
  }
  return q;
};

module.exports = {
  addProducersTypes,
  getTypesByProducerId,
  deleteTypesByProducerId
};

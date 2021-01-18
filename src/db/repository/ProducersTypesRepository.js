'use strict';
const format = require('pg-format');
const client = require('../Connection.js');

async function addProducersTypes(typesList, producer_id) {
  return client
    .query(insertIntoProducersTypes(typesList, producer_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getTypesByProducerId(producer_id) {
  const types = await client
    .query(selectTypesByProducerId, [producer_id])
    .then(result => result)
    .catch(err => console.log(err));
  return types.rows;
}

async function deleteTypesByProducerId(producer_id) {
  return client
    .query(deleteTypesByProdId, [producer_id])
    .then(result => result)
    .catch(err => console.log(err));
}

const deleteTypesByProdId = 'delete from producers_sewing_types where producer_id = $1';

const selectTypesByProducerId =  'select * from producers_sewing_types where producer_id = $1';

const insertIntoProducersTypes = (typesList, producerId) => {
  let q = format(`insert into producers_sewing_types(producer_id, sewing_type_id)
values (%L, %s)`, producerId, Number(typesList[0]));
  for (let i = 1; i < typesList.length; i++) {
    q += format(', (%L, %s)', producerId, Number(typesList[i]));
  }
  return q;
};

module.exports = {
  addProducersTypes,
  getTypesByProducerId,
  deleteTypesByProducerId
};

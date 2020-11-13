'use strict';

const ProducerTypesRepository = require('../db/repository/ProducersTypesRepository.js');

async function addProducersTypes(typesList, producer_id) {
  await ProducerTypesRepository.addProducersTypes(typesList, producer_id);
}

async function getTypesByProducerId(producer_id) {
  const answer = await ProducerTypesRepository.getTypesByProducerId(producer_id);
  return answer.rows;
}

async function deleteTypesByProducerId(producer_id) {
  await ProducerTypesRepository.deleteTypesByProducerId(producer_id);
}

module.exports = {
  addProducersTypes,
  getTypesByProducerId,
  deleteTypesByProducerId
};

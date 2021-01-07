'use strict';

const ProducerTypesRepository = require('../db/repository/ProducersTypesRepository.ts');

async function addProducersTypes(typesList, producer_id) {
  await ProducerTypesRepository.producersTypesRepository().addProducersTypes(typesList, producer_id);
}

async function getTypesByProducerId(producer_id) {
  return await ProducerTypesRepository.producersTypesRepository().getTypesByProducerId(producer_id);
}

async function deleteTypesByProducerId(producer_id) {
  await ProducerTypesRepository.producersTypesRepository().deleteTypesByProducerId(producer_id);
}

module.exports = {
  addProducersTypes,
  getTypesByProducerId,
  deleteTypesByProducerId
};

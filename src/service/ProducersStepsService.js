'use strict';

const ProducerStepsRepository = require('../db/repository/ProducersStepsRepository.ts');

async function addProducersSteps(stepsList, producer_id) {
  await ProducerStepsRepository.producersStepsRepository().addProducersSteps(stepsList, producer_id);
}

async function getStepsByProducerId(producer_id) {
  return await ProducerStepsRepository.producersStepsRepository().getStepsByProducerId(producer_id);
}

async function deleteStepsByProducerId(producer_id) {
  await ProducerStepsRepository.producersStepsRepository().deleteStepsByProducerId(producer_id);
}

module.exports = {
  addProducersSteps,
  getStepsByProducerId,
  deleteStepsByProducerId
};

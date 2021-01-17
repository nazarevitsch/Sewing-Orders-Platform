'use strict';

const ProducerStepsRepository = require('../db/repository/ProducersStepsRepository.js');

async function addProducersSteps(stepsList, producer_id) {
  await ProducerStepsRepository.addProducersSteps(stepsList, producer_id);
}

async function getStepsByProducerId(producer_id) {
  return await ProducerStepsRepository.getStepsByProducerId(producer_id);
}

async function deleteStepsByProducerId(producer_id) {
  await ProducerStepsRepository.deleteStepsByProducerId(producer_id);
}

module.exports = {
  addProducersSteps,
  getStepsByProducerId,
  deleteStepsByProducerId
};

'use strict';

const ProducerRepository = require('../db/repository/ProducerRepository.ts');
const UserService = require('./UserService.js');
const ProducerTypesService = require('./ProducersTypesService.js');
const ProducerStepsService = require('./ProducersStepsService.js');

async function createProducer(user, name, region_id, description, types, steps, image_link) {
  const user_id = await UserService.getUserIdByEmailAndPassword(user.username, user.password);
  const producer = await ProducerRepository.producerRepository().createProducer(user_id, name, region_id, description, image_link);
  if (types.length > 0) await ProducerTypesService.addProducersTypes(types, producer.id);
  if (steps.length > 0) await ProducerStepsService.addProducersSteps(steps, producer.id);
}

async function updateProducer(producer_id, name, region_id, description, types, steps) {
  await ProducerRepository.producerRepository().updateProducer(producer_id, region_id, name, description);
  await ProducerStepsService.deleteStepsByProducerId(producer_id);
  await ProducerTypesService.deleteTypesByProducerId(producer_id);
  if (types.length > 0) await ProducerTypesService.addProducersTypes(types, producer_id);
  if (steps.length > 0) await ProducerStepsService.addProducersSteps(steps, producer_id);
}

async function getProducerByUserId(userId) {
  return  await ProducerRepository.producerRepository().getProducerByUserId(userId);
}

async function getProducerIdByUserId(userId) {
  const answer = await ProducerRepository.producerRepository().getProducerByUserId(userId);
  if (answer === undefined) return undefined;
  return answer.id;
}

async function getProducers(page) {
  const answer = await ProducerRepository.producerRepository().getProducers(page);
  console.log(answer);
  return answer;
}

async function getProducersAmount() {
  return  await ProducerRepository.producerRepository().getProducersAmount();
}

async function getProducersByStepsAndTypesAndRegion(types, steps, region_id) {
  return await ProducerRepository.producerRepository().getProducersByStepsAndTypesAndRegion(types, steps, region_id);
}

async function deleteProducer(email, password) {
  await ProducerRepository.producerRepository().deleteProducer((await UserService.getUserIdByEmailAndPassword(email, password)));
}

async function getProducerById(id) {
  return await ProducerRepository.producerRepository().getProducerById(id);
}

async function getProducerRegionNamePhoneNumberById(id) {
  return (await ProducerRepository.producerRepository().getProducerRegionNamePhoneNumberById(id)).rows[0];
}

module.exports = {
  createProducer,
  getProducerByUserId,
  getProducerById,
  getProducerIdByUserId,
  updateProducer,
  getProducers,
  getProducersAmount,
  getProducersByStepsAndTypesAndRegion,
  getProducerRegionNamePhoneNumberById,
  deleteProducer
};

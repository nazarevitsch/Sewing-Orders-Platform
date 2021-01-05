'use strict';

const ProducerRepository = require('../db/repository/ProducerRepository.js');
const UserService = require('./UserService.js');
const ProducerTypesService = require('./ProducersTypesService.js');
const ProducerStepsService = require('./ProducersStepsService.js');

async function getProducerRegionNamePhoneNumberById(id) {
  return (await ProducerRepository.getProducerRegionNamePhoneNumberById(id)).rows[0];
}

async function createProducer(user, name, region_id, description, types, steps, image_link) {
  const user_id = await UserService.getUserIdByEmailAndPassword(user.username, user.password);
  await ProducerRepository.createProducer(user_id, name, region_id, description, image_link);
  const producer_id = await getProducerIdByUserId(user_id);
  if (types.length > 0) await ProducerTypesService.addProducersTypes(types, producer_id);
  if (steps.length > 0) await ProducerStepsService.addProducersSteps(steps, producer_id);
}

async function updateProducer(producer_id, name, region_id, description, types, steps) {
  await ProducerRepository.updateProducer(producer_id, region_id, name, description);
  await ProducerStepsService.deleteStepsByProducerId(producer_id);
  await ProducerTypesService.deleteTypesByProducerId(producer_id);
  if (types.length > 0) await ProducerTypesService.addProducersTypes(types, producer_id);
  if (steps.length > 0) await ProducerStepsService.addProducersSteps(steps, producer_id);
}

async function getProducerByUserId(userId) {
  const answer = await ProducerRepository.getProducerByUserId(userId);
  return answer.rows.length === 0 ? undefined : answer.rows[0];
}

async function getProducerIdByUserId(userId) {
  const answer = await ProducerRepository.getProducerByUserId(userId);
  return answer.rows.length === 0 ? undefined : answer.rows[0].id;
}

async function getProducers(page) {
  const answer = await ProducerRepository.getProducers(page);
  return answer.rows;
}

async function getProducersAmount() {
  const answer = await ProducerRepository.getProducersAmount();
  return answer;
}

async function getProducersByStepsAndTypesAndRegion(types, steps, region_id) {
  const answer = await ProducerRepository.getProducersByStepsAndTypesAndRegion(types, steps, region_id);
  return answer.rows;
}

async function deleteProducer(email, password) {
  await ProducerRepository.deleteProducer((await UserService.getUserIdByEmailAndPassword(email, password)));
}

module.exports = {
  createProducer,
  getProducerByUserId,
  getProducerIdByUserId,
  updateProducer,
  getProducers,
  getProducersAmount,
  getProducersByStepsAndTypesAndRegion,
  deleteProducer,
  getProducerRegionNamePhoneNumberById
};

'use strict';

const ProducerRepository = require('../db/repository/ProducerRepository.js');
const UserService = require('./UserService.js');
const ProducerTypesService = require('./ProducersTypesService.js');
const ProducerStepsService = require('./ProducersStepsService.js');
const s3 = require('../workWithAWS/connectionAWS.js');
const fs = require('fs');


async function manageProducer(email, name, region_id, description, types, steps, pathToImage){
  let image_link = await s3.uploadFile(pathToImage);
  fs.unlinkSync(pathToImage);
  let user = await UserService.getUserByEmail(email);
  let producer = await getProducerByUserId(user.id);
  if (producer === undefined) {
    let producerId = await ProducerRepository.createProducerAndReturnId(user.id, name, region_id, description, image_link);
    if (types.length > 0) await ProducerTypesService.addProducersTypes(types, producerId);
    if (steps.length > 0) await ProducerStepsService.addProducersSteps(steps, producerId);
    return {status: 200, message: 'Ok.'};
  } else {
    await ProducerRepository.updateProducer(producer.id, region_id, name, description, image_link);
    await ProducerStepsService.deleteStepsByProducerId(producer.id);
    await ProducerTypesService.deleteTypesByProducerId(producer.id);
    if (types.length > 0) await ProducerTypesService.addProducersTypes(types, producer.id);
    if (steps.length > 0) await ProducerStepsService.addProducersSteps(steps, producer.id);
    return {status: 200, message: 'Ok.'};
  }
}

async function getProducerByUserId(userId) {
  return  await ProducerRepository.getProducerByUserId(userId);
}

async function getProducersByStepsAndTypesAndRegion(types, steps, region_id) {
  return await ProducerRepository.getProducersByStepsAndTypesAndRegion(types, steps, region_id);
}

//old functions
async function getProducerRegionNamePhoneNumberById(id) {
  return (await ProducerRepository.getProducerRegionNamePhoneNumberById(id)).rows[0];
}

async function deleteProducer(email, password) {
  await ProducerRepository.deleteProducer((await UserService.getUserIdByEmailAndPassword(email, password)));
}

module.exports = {
  getProducerByUserId,
  getProducersByStepsAndTypesAndRegion,
  deleteProducer,
  getProducerRegionNamePhoneNumberById,

  manageProducer
};

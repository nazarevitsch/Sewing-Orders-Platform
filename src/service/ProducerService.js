'use strict';

const ProducerRepository = require('../db/repository/ProducerRepository.js');
const UserService = require('./UserService.js');
const ProducerTypesService = require('./ProducersTypesService.js');
const ProducerStepsService = require('./ProducersStepsService.js');
const regionService = require('./RegionService');
const stepService = require('./StepService');
const typesService = require('./TypeService');
const s3 = require('../workWithAWS/connectionAWS.js');
const fs = require('fs');

async function manageProducer(user, name, region_id, description, types, steps, sameImage, pathToImage) {
  let producer = await getProducerByUserId(user.id);
  let imageLink;
  if (producer === undefined) {
    imageLink = await s3.uploadFile(pathToImage);
    fs.unlinkSync(pathToImage);
    let producerId = await ProducerRepository.createProducerAndReturnId(user.id, name, region_id, description, imageLink);
    if (types.length > 0) await ProducerTypesService.addProducersTypes(types, producerId);
    if (steps.length > 0) await ProducerStepsService.addProducersSteps(steps, producerId);
    return { status: 200, message: 'Ok.' };
  } else {
    if (sameImage === true) {
      imageLink = producer.image_link;
    } else {
      imageLink = await s3.uploadFile(pathToImage);
      fs.unlinkSync(pathToImage);
    }
    await ProducerRepository.updateProducer(producer.id, region_id, name, description, imageLink);
    await ProducerStepsService.deleteStepsByProducerId(producer.id);
    await ProducerTypesService.deleteTypesByProducerId(producer.id);
    if (types.length > 0) await ProducerTypesService.addProducersTypes(types, producer.id);
    if (steps.length > 0) await ProducerStepsService.addProducersSteps(steps, producer.id);
    return { status: 200, message: 'Ok.' };
  }
}

async function getProducerForRendering(userId) {
  let producer = await getProducerByUserId(userId);
  let allRegions = await regionService.getAllRegions();
  let allSteps = await stepService.getAllSteps();
  let allTypes = await typesService.getAllTypes();
  if (producer === undefined) {
    return { regions: allRegions, steps: allSteps, types: allTypes, producer: producer };
  } else {
    let producerTypes = await ProducerTypesService.getTypesByProducerId(producer.id);
    let producerSteps = await ProducerStepsService.getStepsByProducerId(producer.id);
    for (let i = 0; i < allTypes.length; i++) {
      for (let l = 0; l < producerTypes.length; l++) {
        if (allTypes[i].id === producerTypes[l].sewing_type_id) {
          allTypes[i].checked = true;
          break;
        } else allTypes[i].checked = false;
      }
    }
    for (let i = 0; i < allSteps.length; i++) {
      for (let l = 0; l < producerSteps.length; l++) {
        if (allSteps[i].id === producerSteps[l].manufacturing_step_id) {
          allSteps[i].checked = true;
          break;
        } else allSteps[i].checked = false;
      }
    }
    return { regions: allRegions, steps: allSteps, types: allTypes, producer: producer };
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
  manageProducer,
  getProducerForRendering
};

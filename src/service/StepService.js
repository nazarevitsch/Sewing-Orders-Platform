'use strict';

const StepRepository = require('../db/repository/StepRepository');

async function getAllSteps() {
  return await StepRepository.getAllSteps();
}

module.exports = {
  getAllSteps
};

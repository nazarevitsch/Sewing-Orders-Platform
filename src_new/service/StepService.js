'use strict';

const StepRepository = require('../db/repository/StepRepository');

async function getAllSteps() {
  const answer = await StepRepository.getAllSteps();
  return answer.rows;
}

module.exports = {
  getAllSteps
};

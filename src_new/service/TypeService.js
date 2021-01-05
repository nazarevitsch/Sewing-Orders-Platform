'use strict';

const TypeRepository = require('../db/repository/TypeRepository');

async function getAllTypes() {
  const answer = await TypeRepository.getAllTypes();
  return answer.rows;
}

module.exports = {
  getAllTypes
};

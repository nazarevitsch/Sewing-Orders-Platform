'use strict';

const TypeRepository = require('../db/repository/TypeRepository');

async function getAllTypes() {
  return await TypeRepository.getAllTypes();
}

module.exports = {
  getAllTypes
};

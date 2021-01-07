'use strict';

const TypeRepository = require('../db/repository/TypeRepository');

async function getAllTypes() {
  return await TypeRepository.typeRepository().getAllTypes();
}

module.exports = {
  getAllTypes
};

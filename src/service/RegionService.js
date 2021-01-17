'use strict';

const RegionRepository = require('../db/repository/RegionRepository.js');

async function getAllRegions() {
  return await RegionRepository.selectAllRegions();
}

module.exports = {
  getAllRegions
};

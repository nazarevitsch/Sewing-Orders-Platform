'use strict';

const RegionRepository = require('../db/repository/RegionRepository.ts');

async function getAllRegions() {
  return await RegionRepository.regionRepository().selectAllRegions();
}

module.exports = {
  getAllRegions
};

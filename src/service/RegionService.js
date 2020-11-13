'use strict';

const RegionRepository = require('../db/repository/RegionRepository.js');
//
async function getAllRegions() {
  const answer = await RegionRepository.selectAllRegions();
  return answer.rows;
}

module.exports = {
  getAllRegions
};

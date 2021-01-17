'use strict';

function checkBodyOfCreateOrder(request) {
  try {
    return (request.body.name.length > 10 && request.body.description.length > 6 &&
      request.body.small_description.length > 6 && request.body.region_id.length >= 1 &&
      request.body.steps.split(',').length >= 1 && request.body.types.split(',').length >= 1 &&
      request.files.image !== undefined);
  } catch (err) {
    return false;
  }
}

function checkBodyOfManageProducer(request) {
  try {
    return (request.body.producer_name.length > 10 && request.body.description.length > 6 &&
      request.body.region_id.length >= 1 &&
      ((request.body.new_image === 'true' && request.files.image !== undefined) ||
        (request.body.new_image  === 'false' && request.files.image === undefined)) &&
      request.body.steps.split(',').length >= 1 && request.body.types.split(',').length >= 1);
  } catch (err) {
    return false;
  }
}

module.exports = {
  checkBodyOfCreateOrder,
  checkBodyOfManageProducer
};

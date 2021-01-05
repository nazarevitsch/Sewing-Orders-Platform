'use strict';

const OrderStepsRepository = require('../db/repository/OrdersStepsRepository.js');

async function createOrdersSteps(order_id, steps) {
  await OrderStepsRepository.createOrdersSteps(order_id, steps);
}

module.exports = {
  createOrdersSteps
};

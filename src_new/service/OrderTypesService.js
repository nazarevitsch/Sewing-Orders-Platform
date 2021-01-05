'use strict';

const OrderTypesRepository = require('../db/repository/OrdersTypesRepository.js');

async function createOrdersTypes(order_id, types) {
  await OrderTypesRepository.createOrdersTypes(order_id, types);
}

module.exports = {
  createOrdersTypes
};

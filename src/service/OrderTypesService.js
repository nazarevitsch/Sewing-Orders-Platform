'use strict';

const OrderTypesRepository = require('../db/repository/OrdersTypesRepository.ts');

async function createOrdersTypes(order_id, types) {
  await OrderTypesRepository.ordersTypesRepository().createOrdersTypes(order_id, types);
}

module.exports = {
  createOrdersTypes
};

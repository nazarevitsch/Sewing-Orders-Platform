'use strict';

const OrderRepository = require('../db/repository/OrderRepository.js');
const UserService = require('./UserService.js');
const OrdersStepsService = require('./OrdersStepsService.js');
const OrdersTypesService =  require('./OrderTypesService.js');
const s3 = require('../workWithAWS/connectionAWS.js');
const fs = require('fs');


async function getOrdersByStepsAndTypesAndRegion(steps, types, region_id) {
  return await OrderRepository.getOrdersByStepsAndTypesAndRegion(steps, types, region_id);
}

async function createOrder(user, name, region_id, small_description, description, types, steps, pathToFile) {
  let image_link = await s3.uploadFile(pathToFile);
  fs.unlinkSync(pathToFile);
  let orderId = await OrderRepository.createOrderAndGetId(user.id, name, region_id, small_description, description, image_link);
  if (types.length > 0) await OrdersTypesService.createOrdersTypes(orderId, types);
  if (steps.length > 0) await OrdersStepsService.createOrdersSteps(orderId, steps);
  return {status: 200, message: 'Ok.'};
}

async function getHistoryOfOrdersByUserId(userId) {
  return {available: await getOrderByUserIdAndAvailable(userId, true), unavailable: await getOrderByUserIdAndAvailable(userId, false)};
}

async function getOrderByUserIdAndAvailable(user_id, available) {
  const answer = await OrderRepository.getOrderByUserIdAndAvailable(user_id, available);
  return answer.rows;
}

async function disableOrderByOrderIdAndUserId(order_id, user_id) {
  await OrderRepository.disableOrderByOrderId(order_id, user_id);
}

//old functions
async function getOrderRegionNameAndPhoneNumberByID(id){
  return (await OrderRepository.selectOrderRegionNameAndPhoneNumberByID(id)).rows[0];
}

async function deleteOrder(email, password) {
  await OrderRepository.deleteOrder((await UserService.getUserIdByEmailAndPassword(email, password)));
}

module.exports = {
  createOrder,
  getOrderByUserIdAndAvailable,
  disableOrderByOrderIdAndUserId,
  getOrdersByStepsAndTypesAndRegion,
  deleteOrder,
  getOrderRegionNameAndPhoneNumberByID,
  getHistoryOfOrdersByUserId
};

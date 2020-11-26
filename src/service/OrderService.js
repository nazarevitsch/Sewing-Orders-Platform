'use strict';

const OrderRepository = require('../db/repository/OrderRepository.js');
const UserService = require('./UserService.js');
const OrdersStepsService = require('./OrdersStepsService.js');
const OrdersTypesService =  require('./OrderTypesService.js');

async function createOrder(user, name, region_id, small_description, description, types, steps, image_link) {
  const user_id = await UserService.getUserIdByEmailAndPassword(user.username, user.password);
  const random_key = await makeKey();
  await OrderRepository.createOrder(user_id, name, region_id, small_description, description, random_key, image_link);
  const order_id = (await getOrderByAll(user_id, name, region_id, small_description, description, random_key)).id;
  if (types.length > 0) await OrdersTypesService.createOrdersTypes(order_id, types);
  if (steps.length > 0) await OrdersStepsService.createOrdersSteps(order_id, steps);
}

async function getOrderByAll(user_id, name, region_id, small_description, description, random_key) {
  const answer = await OrderRepository.getOrderByAll(user_id, name, region_id, small_description, description, random_key);
  return answer.rows.length > 0 ? answer.rows[0] : undefined;
}

async function getOrderByUserIdAndAvailable(user_id, available) {
  const answer = await OrderRepository.getOrderByUserIdAndAvailable(user_id, available);
  return answer.rows.length > 0 ? answer.rows : [];
}

async function getOrdersByStepsAndTypesAndRegion(steps, types, region_id) {
  const answer = await OrderRepository.getOrdersByStepsAndTypesAndRegion(steps, types, region_id);
  return answer.rows.length > 0 ? answer.rows : [];
}

async function disableOrderByOrderIdAndUserId(order_id, user_id) {
  await OrderRepository.disableOrderByOrderId(order_id, user_id);
}

async function makeKey() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function deleteOrder(email, password) {
  await OrderRepository.deleteOrder((await UserService.getUserIdByEmailAndPassword(email, password)));
}

async function findLastOrder() {
  return (await OrderRepository.findLastOrder()).rows[0];
}

module.exports = {
  createOrder,
  getOrderByUserIdAndAvailable,
  disableOrderByOrderIdAndUserId,
  getOrdersByStepsAndTypesAndRegion,
  deleteOrder,
  findLastOrder
};

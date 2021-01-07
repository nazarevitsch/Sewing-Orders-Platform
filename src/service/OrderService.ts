'use strict';

import {Order} from "../db/Order";
import {PostgresConnection} from "../db/Connection";

const OrderRepository = require('../db/repository/OrderRepository.ts');
const UserService = require('./UserService.js');
const OrdersStepsService = require('./OrdersStepsService.ts');
const OrdersTypesService =  require('./OrderTypesService.js');

class User{
  username: string;
  password: string
}

type OrderService = {
  createOrder: (user: User, name: string, region_id: number, small_description: string,
                description: string, types: number[], steps: number[], image_link: string) => void,
  getOrderByUserIdAndAvailable: (user_id: number, available: boolean) => Promise<Order>,
  getOrdersByStepsAndTypesAndRegion: (steps: number[], types: number[], region_id: number) => Promise<unknown>,
  disableOrderByOrderIdAndUserId: (order_id: number, user_id: number) => void,
  deleteOrder: (email: string, password: string) => void
  getOrderRegionNameAndPhoneNumberByID: (id:number) => Promise<unknown>
}

export const orderService = (db: PostgresConnection): OrderService => {
  return {
    getOrderRegionNameAndPhoneNumberByID: async (id:number) => {
      return (await OrderRepository.orderRepository(db).selectOrderRegionNameAndPhoneNumberByID(id)).rows[0];
    },
    createOrder: async (user: User, name: string, region_id: number, small_description: string, description: string, types: number[], steps: number[], image_link: string) => {
      const user_id = await UserService.getUserIdByEmailAndPassword(user.username, user.password);
      const random_key = await makeKey();
      const order = await OrderRepository.orderRepository(db).createOrder(user_id, name, region_id, small_description, description, random_key, image_link);
      if (types.length > 0) await OrdersTypesService.createOrdersTypes(order.id, types);
      if (steps.length > 0) await OrdersStepsService.orderStepsService(db).createOrdersSteps(order.id, steps);
    },
    getOrderByUserIdAndAvailable: async (user_id: number, available: boolean): Promise<Order> => {
      return  await OrderRepository.orderRepository(db).getOrderByUserIdAndAvailable(user_id, available);
    },
    getOrdersByStepsAndTypesAndRegion: async (steps: number[], types: number[], region_id: number) => {
      const answer = await OrderRepository.orderRepository(db).getOrdersByStepsAndTypesAndRegion(steps, types, region_id);
      return answer.rows.length > 0 ? answer.rows : [];
    },
    disableOrderByOrderIdAndUserId: async (order_id: number, user_id: number) => {
      await OrderRepository.orderRepository(db).disableOrderByOrderId(order_id, user_id);
    },
    deleteOrder: async (email: string, password: string) => {
      await OrderRepository.orderRepository(db).deleteOrder((await UserService.getUserIdByEmailAndPassword(email, password)));
    }
  }
}

async function makeKey() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}



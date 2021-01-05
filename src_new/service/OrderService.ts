'use strict';
import {PostgresConnection} from "../db/Connection";
import {Order} from "../domain/Order";

const OrderRepository = require('../db/repository/OrderRepository');
const UserService = require('./UserService.js');
const OrdersStepsService = require('./OrdersStepsService.js');
const OrdersTypesService =  require('./OrderTypesService.js');

class User{
  username: string;
  password: string
}

type OrderService = {
  createOrder: (user: User, name: string, region_id: number, small_description: string,
              description: string, types: number[], steps: number[], image_link: string) => void,
  getOrderByAll: (user_id: number, name: string, region_id: number, small_description: string,
                description: string, random_key: string) => Promise<Order>,
  getOrderByUserIdAndAvailable: (user_id: number, available: boolean) => Promise<Order[]>,
  getOrdersByStepsAndTypesAndRegion: (steps: number[], types: number, region_id: number) => Promise<Order[]>,
  disableOrderByOrderIdAndUserId: (order_id: number, user_id: number) => void,
  deleteOrder: (email: string, password: string) => void
}

export const orderService = (db: PostgresConnection): OrderService => {
  return {
    createOrder: async (user: User, name: string, region_id: number, small_description: string,
                        description: string, types: number[], steps: number[], image_link: string) => {
      const user_id = await UserService.getUserIdByEmailAndPassword(user.username, user.password);
      const random_key = await makeKey();
      await OrderRepository.orderRepository(db).createOrder(user_id, name, region_id, small_description, description, random_key, image_link);
      const order_id = (await orderService(db).getOrderByAll(user_id, name, region_id, small_description, description, random_key)).id;
      if (types.length > 0) await OrdersTypesService.createOrdersTypes(order_id, types);
      if (steps.length > 0) await OrdersStepsService.createOrdersSteps(order_id, steps);
    },
    getOrderByAll: async (user_id: number, name: string, region_id: number, small_description: string,
                          description: string, random_key: string) => {
      const answer = await OrderRepository.orderRepository(db).getOrderByAll(user_id, name, region_id, small_description, description, random_key);
      return new Order(answer.rows[0].id, answer.rows[0].user_id, answer.rows[0].name, answer.rows[0].region_id,
          answer.rows[0].available, answer.rows[0].small_description, answer.rows[0].description,
          answer.rows[0].random_key, answer.rows[0].image_link, answer.rows[0].date_creation, '');
    },
    getOrderByUserIdAndAvailable: async (user_id: number, available: boolean) => {
      const answer = await OrderRepository.orderRepository(db).getOrderByUserIdAndAvailable(user_id, available);
      if (answer.rows.length > 0) {
        let arr: Order[] = answer.rows.map((el: any) => new Order(el.id,-1, '', -1,
            false, '', '', '', '', el.date, ''));
        return arr;
      }
      else return [] as Order[];
    },
    getOrdersByStepsAndTypesAndRegion: async (steps: number[], types: number, region_id: number) => {
      const answer = await OrderRepository.orderRepository(db).getOrdersByStepsAndTypesAndRegion(steps, types, region_id);
      if (answer.rows.length > 0) {
        let arr: Order[] = answer.rows.map((el: any) => new Order(el.id,-1, el.name, el.region_id,
            true, el.small_description, '', '', el.image_link, '', el.region_name));
        return arr;
      }
      else return [] as Order[];
    },
    disableOrderByOrderIdAndUserId: async (order_id: number, user_id: number) => {
      await OrderRepository.orderRepository(db).disableOrderByOrderId(order_id, user_id);
    },
    deleteOrder: async (email: string, password: string) => {
      await OrderRepository.orderRepository(db).deleteOrder((await UserService.getUserIdByEmailAndPassword(email, password)));
    }
  };
};

async function makeKey() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

'use strict';

import {PostgresConnection} from "../db/Connection";

const OrderStepsRepository = require('../db/repository/OrdersStepsRepository.ts');

type OrderStepsService = {
  createOrdersSteps: (order_id: number, steps: number[]) => void
}

export const orderStepsService = (db: PostgresConnection) => {
  return{
    createOrdersSteps: async (order_id: number, steps: number[]) => {
      await OrderStepsRepository.ordersStepsRepository(db).createOrdersSteps(order_id, steps);
    }
  }
}


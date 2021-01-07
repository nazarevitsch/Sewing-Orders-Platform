'use strict';

import {QueryResult} from "pg";
import {PostgresConnection} from "../Connection";

const client = require('../Connection.ts');


type OrdersStepsRepository = {
  createOrdersSteps: (order_id: number, steps: number[]) => Promise<QueryResult>
};

export const ordersStepsRepository = (db : PostgresConnection) => {
  return{
    createOrdersSteps: (order_id: number, steps: number[]): Promise<QueryResult> => {
      return db.connection()
          .query(insertOrdersSteps(order_id, steps))
          .then((result:QueryResult) => result)
          .catch((err:Error) => console.log(err));
    }
  }
}

const insertOrdersSteps = (order_id: number, steps: number[]) => {
  let answer = `insert into orders_manufacturing_steps(order_id, manufacturing_step_id)`;
  for (let i = 0; i < steps.length; i++) {
    if (i === 0) {
      answer += `VALUES (${order_id}, ${steps[i]})`;
    } else answer += `, (${order_id}, ${steps[i]})`;
  }
  return answer;
};

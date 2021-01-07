'use strict';

import {QueryResult} from "pg";

const client = require('../Connection.ts');

type OrdersTypesRepository = {
  createOrdersTypes: (order_id: number, types: number[]) => Promise<QueryResult>
}

export const ordersTypesRepository = () => {
  return{
    createOrdersTypes: async (order_id: number, types: number[]): Promise<QueryResult> => {
      return client
          .query(insertOrdersTypes(order_id, types))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    }
  }
}

const insertOrdersTypes = (order_id: number, types:number[]) => {
  let answer = 'insert into orders_sewing_types(order_id, sewing_type_id)';
  for (let i = 0; i < types.length; i++) {
    if (i === 0) {
      answer += ` VALUES (${order_id}, ${types[i]})`;
    } else answer += `, (${order_id}, ${types[i]})`;
  }
  return answer;
};


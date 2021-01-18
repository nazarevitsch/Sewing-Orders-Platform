'use strict';
const format = require('pg-format');
const client = require('../Connection.js');

async function createOrdersTypes(order_id, types) {
  return client
    .query(insertOrdersTypes(order_id, types))
    .then(result => result)
    .catch(err => console.log(err));
}

const insertOrdersTypes = (order_id, types) => {
  let answer = 'insert into orders_sewing_types(order_id, sewing_type_id)';
  for (let i = 0; i < types.length; i++) {
    if (i === 0) {
      answer += format(' VALUES (%s, %L)', order_id, types[i]);
    } else answer += format(', (%s, %L)', order_id, types[i]);
  }
  return answer;
};

module.exports = {
  createOrdersTypes
};

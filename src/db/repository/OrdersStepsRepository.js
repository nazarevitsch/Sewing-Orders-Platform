'use strict';

const client = require('../Connection.js');

async function createOrdersSteps(order_id, steps) {
  return client
    .query(insertOrdersSteps(order_id, steps))
    .then(result => result)
    .catch(err => console.log(err));
}

const insertOrdersSteps = (order_id, steps) => {
  let answer = `insert into orders_manufacturing_steps(order_id, manufacturing_step_id)`;
  for (let i = 0; i < steps.length; i++) {
    if (i === 0) {
      answer += `VALUES (${order_id}, ${steps[i]})`;
    } else answer += `, (${order_id}, ${steps[i]})`;
  }
  return answer;
};

module.exports = {
  createOrdersSteps
};

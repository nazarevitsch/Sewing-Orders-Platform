'use strict';

const client = require('../Connection.js');

async function createOrder(user_id, name, region_id, small_description, description, random_key) {
  return client
    .query(insertOrder(user_id, name, region_id, small_description, description, random_key))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getOrderByAll(user_id, name, region_id, small_description, description, random_key) {
  return client
    .query(selectOrderByAll(user_id, name, region_id, small_description, description, random_key))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getOrderByUserIdAndAvailable(user_id, available) {
  return client
    .query(selectOrderByUserIdAndAvailable(user_id, available))
    .then(result => result)
    .catch(err => console.log(err));
}

async function disableOrderByOrderId(order_id, user_id) {
  return client
    .query(disOrderByOrderId(order_id, user_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getOrdersByStepsAndTypesAndRegion(steps, types, region_id) {
  return client
    .query(selectOrdersByStepsAndTypesAndRegion(steps, types, region_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function deleteOrder(user_id) {
  return client
    .query(dropOrderByUserId(user_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function findLastOrder() {
  return client
    .query(selectLastOrder())
    .then(result => result)
    .catch(err => console.log(err));
}

const selectLastOrder = () => 'select * from orders where id = (select max(id) as max from orders);';

const dropOrderByUserId = user_id => `delete from orders where user_id = ${user_id}`;

const selectOrdersByStepsAndTypesAndRegion = (steps, types, region_id) => {
  let answer = '';
  if (Number(region_id) === 1) {
    answer = `select t4.id as id, t4.name as name, region_id ,small_description, region_name from
  (select * from
  (select distinct t2.id, t2.name, t2.region_id, t2.small_description, count(t2.id) over (partition by t2.id) as types_amount from
  (select * from
  (select distinct o.id, name, region_id, o.small_description, count(o.id) over (partition by o.id) as steps_amount from
  (select * from orders where available = true) o
  join orders_manufacturing_steps oms on o.id = oms.order_id`;
  } else {
    answer = `select t4.id as id, t4.name as name, region_id ,small_description, region_name from
  (select * from
  (select distinct t2.id, t2.name, t2.region_id, t2.small_description, count(t2.id) over (partition by t2.id) as types_amount from
  (select * from
  (select distinct o.id, name, region_id, o.small_description, count(o.id) over (partition by o.id) as steps_amount from
  (select * from orders where available = true and region_id = ${region_id}) o
  join orders_manufacturing_steps oms on o.id = oms.order_id`;
  }
  if (steps !== undefined) {
    answer += ' where (';
    for (let i = 0; i < steps.length; i++) {
      if (i === 0) {
        answer += `oms.manufacturing_step_id = ${steps[i]} `;
      } else {
        answer += `or oms.manufacturing_step_id = ${steps[i]} `;
      }
    }
    answer += `)) t
where steps_amount = ${steps.length}) t2
    join orders_sewing_types ost on t2.id = ost.order_id`;
  } else {
    answer += `) t
    ) t2
    join orders_sewing_types ost on t2.id = ost.order_id`;
  }
  if (types !== undefined) {
    answer += ' where (';
    for (let i = 0; i < types.length; i++) {
      if (i === 0) {
        answer += `ost.sewing_type_id = ${types[i]} `;
      } else {
        answer += `or ost.sewing_type_id = ${types[i]} `;
      }
    }
    answer += `)) t3
where types_amount = ${types.length}) t4
join regions r on r.id = t4.region_id`;
  } else {
    answer += `) t3 ) t4
    join regions r on r.id = t4.region_id`;
  }
  return answer;
};

const disOrderByOrderId = (order_id, user_id) => `update orders set available = false where id = ${order_id} and user_id = ${user_id}`;

const selectOrderByUserIdAndAvailable = (user_id, available) => `select id, name, to_char(date_creation, 'DD Mon YYYY') as date from orders 
where user_id = ${user_id} and available = ${available}`;

const selectOrderByAll = (user_id, name, region_id, small_description, description, random_key) =>
  `select * from orders where user_id = ${user_id} and name = '${name}' and region_id = ${region_id} and 
small_description = '${small_description}' and description = '${description}' and available = true 
and random_key = '${random_key}'`;

const insertOrder = (user_id, name, region_id, small_description, description, random_key) =>
  `insert into orders(user_id, name, region_id, available, small_description, description, date_creation, random_key) 
VALUES(${user_id}, '${name}', ${region_id}, true, '${small_description}', '${description}', current_date, '${random_key}')`;

module.exports = {
  createOrder,
  getOrderByAll,
  getOrderByUserIdAndAvailable,
  disableOrderByOrderId,
  getOrdersByStepsAndTypesAndRegion,
  deleteOrder,
  findLastOrder
};

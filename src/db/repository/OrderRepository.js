'use strict';

const client = require('../Connection.js');

async function getOrdersByStepsAndTypesAndRegion(steps, types, region_id) {
  let orders = await client
    .query(selectOrdersByStepsAndTypesAndRegion(steps, types, region_id))
    .then(result => result)
    .catch(err => console.log(err));
  console.log(orders);
  return orders.rows;
}

async function createOrderAndGetId(user_id, name, region_id, small_description, description, image_link) {
  let orderId = await client
    .query(insertOrder(user_id, name, region_id, small_description, description, image_link))
    .then(result => result)
    .catch(err => console.log(err));
  return orderId.rows[0].id;
}

async function getOrderByUserIdAndAvailable(user_id, available) {
  let orders = await client
    .query(selectOrderByUserIdAndAvailable(user_id, available))
    .then(result => result)
    .catch(err => console.log(err));
  return orders.rows;
}

async function disableOrderByOrderId(order_id, user_id) {
  return client
    .query(disOrderByOrderId(order_id, user_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function deleteOrder(user_id) {
  return client
    .query(dropOrderByUserId(user_id))
    .then(result => result)
    .catch(err => console.log(err));
}

//old functions
async function selectOrderRegionNameAndPhoneNumberByID(id) {
  return client
    .query(orderRegionNameAndPhoneNumberByID(id))
    .then(result => result)
    .catch(err => console.log(err));
}

const orderRegionNameAndPhoneNumberByID = (id) => `select j.id, j.user_id, j.name, j.region_name as region_name, 
j.description, j.image_link, u.name as person_name, u.phone from
((select o.id, o.user_id, o.name, r.region_name as region_name, o.description, o.image_link from 
(select * from orders where id = ${id}) o 
join regions r on o.region_id = r.id)) j
join users u on u.id = j.user_id`

const dropOrderByUserId = user_id => `delete from orders where user_id = ${user_id}`;

const selectOrdersByStepsAndTypesAndRegion = (steps, types, region_id) => {
  let answer = '';
  if (Number(region_id) === 1) {
    answer = `select t4.id as id, t4.name as name, region_id ,small_description, t4.image_link as image_link, region_name from
  (select * from
  (select distinct t2.id, t2.name, t2.region_id, t2.small_description, t2.image_link, count(t2.id) over (partition by t2.id) as types_amount from
  (select * from
  (select distinct o.id, name, region_id, o.small_description, image_link, count(o.id) over (partition by o.id) as steps_amount from
  (select * from orders where available = true) o
  join orders_manufacturing_steps oms on o.id = oms.order_id`;
  } else {
    answer = `select t4.id as id, t4.name as name, region_id ,small_description, t4.image_link as image_link, region_name from
  (select * from
  (select distinct t2.id, t2.name, t2.region_id, t2.small_description, t2.image_link, count(t2.id) over (partition by t2.id) as types_amount from
  (select * from
  (select distinct o.id, name, region_id, o.small_description, image_link, count(o.id) over (partition by o.id) as steps_amount from
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

const insertOrder = (user_id, name, region_id, small_description, description, image_link) =>
  `insert into orders(user_id, name, region_id, available, small_description, description, date_creation, image_link) 
VALUES(${user_id}, '${name}', ${region_id}, true, '${small_description}', '${description}', current_date, '${image_link}') returning id`;

module.exports = {
  createOrderAndGetId,
  getOrderByUserIdAndAvailable,
  disableOrderByOrderId,
  getOrdersByStepsAndTypesAndRegion,
  deleteOrder,
  selectOrderRegionNameAndPhoneNumberByID
};

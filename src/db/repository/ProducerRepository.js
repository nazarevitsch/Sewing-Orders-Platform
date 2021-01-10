'use strict';

const client = require('../Connection.js');

async function createProducerAndReturnId(user_id, name, region_id, description, image_link) {
  let producerId = await client
    .query(insertIntoProducers(user_id, name, region_id, description, image_link))
    .then(result => result)
    .catch(err => console.log(err));
  return producerId.rows[0].id;
}

async function updateProducer(producer_id, region_id, name, description, image_link) {
  return client
    .query(updateProd(producer_id, region_id, name, description, image_link))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getProducerByUserId(user_id) {
  const producer = await client
    .query(selectProducerByUserId(user_id))
    .then(result => result)
    .catch(err => console.log(err));
  return producer.rowCount === 0 ? undefined : producer.rows[0]
}

async function getProducersByStepsAndTypesAndRegion(types, steps, region_id) {
  let producers = await client
    .query(selectProducersByStepsAndTypesAndRegion(types, steps, region_id))
    .then(result => result)
    .catch(err => console.log(err));
  return producers.rows;
}

//old functions
async function deleteProducer(user_id) {
  return client
    .query(dropProducerByUserId(user_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getProducerRegionNamePhoneNumberById(id) {
  return client
    .query(selectProducerRegionNamePhoneNumberById(id))
    .then(result => result)
    .catch(err => console.log(err));
}

const selectProducerRegionNamePhoneNumberById = (id) => `select j.id, j.user_id, j.name, j.region_name,
j.description, j.image_link, u.phone, u.name as person_name from
(select p.id, p.user_id, p.name, r.region_name as region_name,
p.description, p.image_link from
(select * from producers where id = ${id}) p 
join regions r on r.id = p.region_id) j
join users u on u.id = j.user_id`;

const dropProducerByUserId = user_id => `delete from producers where user_id = ${user_id}`;

const selectProducersByStepsAndTypesAndRegion = (types, steps, region_id) => {
  let answer;
  if (Number(region_id) === 1) {
    answer = `select t4.id, name, region_id, image_link, r.region_name from 
   (select distinct t3.id, name, region_id, image_link from
 (select t2.id,t2.name, t2.region_id, t2.image_link, count(t2.id) over (partition by t2.id) as amount_types from
 (select distinct t.id, name, image_link, region_id from (select p.id, p.name, p.region_id, p.image_link, count(p.id) over (partition by p.id) as amount_steps from producers p
     join producers_manufacturing_steps pms on p.id = pms.producer_id`;
  } else {
    answer = `select t4.id, name, region_id, image_link from 
   (select distinct t3.id, name, region_id, image_link from
 (select t2.id,t2.name, t2.region_id, t2.image_link, count(t2.id) over (partition by t2.id) as amount_types from
 (select distinct t.id, name, image_link, region_id from (select p.id, p.name, p.region_id, p.image_link, count(p.id) over (partition by p.id) as amount_steps from 
 (select * from producers where region_id = ${region_id}) p
     join producers_manufacturing_steps pms on p.id = pms.producer_id`;
  }
  if (steps !== undefined) {
    answer += ' where (';
    for (let i = 0; i < steps.length; i++) {
      if (i === 0) {
        answer += `pms.manufacturing_step_id = ${steps[i]} `;
      } else {
        answer += `or pms.manufacturing_step_id = ${steps[i]} `;
      }
    }
    answer += `)) t
where amount_steps = ${steps.length}) t2
    join producers_sewing_types pst on t2.id = pst.producer_id`;
  } else {
    answer += `) t
    ) t2
    join producers_sewing_types pst on t2.id = pst.producer_id`;
  }
  if (types !== undefined) {
    answer += ' where (';
    for (let i = 0; i < types.length; i++) {
      if (i === 0) {
        answer += `pst.sewing_type_id = ${types[i]} `;
      } else {
        answer += `or pst.sewing_type_id = ${types[i]} `;
      }
    }
    answer += `)) t3
where amount_types = ${types.length}) t4
join regions r on r.id = t4.region_id`;
  } else {
    answer += `) t3 ) t4
    join regions r on r.id = t4.region_id`;
  }
  return answer;
};

const updateProd = (producer_id, region_id, name, description, image_link) => `update producers set name = '${name}', region_id = ${region_id}, description = '${description}', image_link = '${image_link}' where id = ${producer_id}`;

const insertIntoProducers = (user_id, name, region_id, description, image_link) =>
  `insert into producers(user_id, name, region_id, date_creation, description, image_link) 
    values (${user_id}, '${name}', ${region_id}, current_date, '${description}', '${image_link}') returning id`;

const selectProducerByUserId = user_id => `select * from producers where user_id = ${user_id}`;

module.exports = {
  getProducerByUserId,
  updateProducer,
  getProducersByStepsAndTypesAndRegion,
  deleteProducer,
  getProducerRegionNamePhoneNumberById,


  createProducerAndReturnId
};

'use strict';

const client = require('../Connection.js');

async function createProducer(user_id, name, region_id, description) {
  return client
    .query(insertIntoProducers(user_id, name, region_id, description))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getProducerByUserId(user_id) {
  return client
    .query(selectProducerByUserId(user_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function updateProducer(producer_id, region_id, name, description) {
  return client
    .query(updateProd(producer_id, region_id, name, description))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getProducers(page) {
  return client
    .query(selectProducers(page))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getProducersAmount() {
  return client
    .query(countProducers())
    .then(result => result)
    .catch(err => console.log(err));
}

async function getProducersByStepsAndTypesAndRegion(types, steps, region_id) {
  return client
    .query(selectProducersByStepsAndTypesAndRegion(types, steps, region_id))
    .then(result => result)
    .catch(err => console.log(err));
}

async function deleteProducer(user_id) {
  return client
    .query(dropProducerByUserId(user_id))
    .then(result => result)
    .catch(err => console.log(err));
}

const dropProducerByUserId = user_id => `delete from producers where user_id = ${user_id}`;

const selectProducersByStepsAndTypesAndRegion = (types, steps, region_id) => {
  let answer;
  if (Number(region_id) === 1) {
    answer = `select * from 
   (select distinct id, name, region_id from
 (select t2.id,t2.name, t2.region_id, count(t2.id) over (partition by t2.id) as amount_types from
 (select distinct id, name, region_id from (select p.id, p.name, p.region_id, count(p.id) over (partition by p.id) as amount_steps from producers p
     join producers_manufacturing_steps pms on p.id = pms.producer_id`;
  } else {
    answer = `select * from 
   (select distinct id, name, region_id from
 (select t2.id,t2.name, t2.region_id, count(t2.id) over (partition by t2.id) as amount_types from
 (select distinct id, name, region_id from (select p.id, p.name, p.region_id, count(p.id) over (partition by p.id) as amount_steps from 
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

const countProducers = () => 'select count(id) from producers';

const selectProducers = page => `select * from producers order by id offset ${page * 15} fetch first 15 rows only;`;

const updateProd = (producer_id, region_id, name, description) => `update producers set name = '${name}', region_id = ${region_id}, description = '${description}' where id = ${producer_id}`;

const insertIntoProducers = (user_id, name, region_id, description) =>
  `insert into producers(user_id, name, region_id, date_creation, description) 
    values (${user_id}, '${name}', ${region_id}, current_date, '${description}')`;

const selectProducerByUserId = user_id => `select * from producers where user_id = ${user_id}`;

module.exports = {
  createProducer,
  getProducerByUserId,
  updateProducer,
  getProducers,
  getProducersAmount,
  getProducersByStepsAndTypesAndRegion,
  deleteProducer
};

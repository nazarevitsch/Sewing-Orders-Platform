'use strict';

import {QueryResult} from "pg";
import {Producer} from "../Producer";

const client = require('../Connection.ts');

type ProducerRepository = {
  createProducer: (user_id: number, name: string, region_id: number, description: string, image_link: string) => Promise<Producer>,
  getProducerByUserId: (user_id: number) => Promise<Producer|undefined>,
  getProducerById: (id: number) => Promise<Producer|undefined>,
  updateProducer: (producer_id: number, region_id: number, name: string, description: string) => Promise<QueryResult>,
  getProducers: (page: number) => Promise<Producer[]|undefined>,
  getProducersAmount: () => Promise<number>,
  getProducersByStepsAndTypesAndRegion: (types: number[], steps: number[], region_id: number) => Promise<Producer[]>,
  deleteProducer: (user_id: number) => Promise<QueryResult>,
  getProducerRegionNamePhoneNumberById: (id:number) => Promise<QueryResult>
}

export const producerRepository = () => {
  return{
    createProducer: async (user_id: number, name: string, region_id: number, description: string, image_link: string): Promise<Producer> => {
      const result: QueryResult =  await client.query(insertIntoProducers(user_id, name, region_id, description, image_link));
      return new Producer(result.rows[0].id, user_id, name, region_id, Date.now().toString(), description, image_link);
    },
    getProducerByUserId: async (user_id: number): Promise<Producer|undefined> => {
      const result: QueryResult = await client.query(selectProducerByUserId(user_id))
      if (result.rowCount===0) {
        return undefined
      }
      else {
        const row = result.rows[0];
        return new Producer(row.id, row.user_id, row.name, row.region_id, row.date_creation, row.description, row.image_link);
      }
    },
    getProducerById: async (id: number): Promise<Producer|undefined> => {
      const result: QueryResult = await client.query(selectProducerById(id))
      if (result.rowCount===0) return undefined;
      const row = result.rows[0];
      return new Producer(row.id, row.user_id, row.name, row.region_id, row.date_creation, row.description, row.image_link);
    },
    updateProducer: async (producer_id: number, region_id: number, name: string, description: string): Promise<QueryResult> => {
      return client
          .query(updateProd(producer_id, region_id, name, description))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    },
    getProducers: async (page: number): Promise<Producer[]|undefined> => {
      const result: QueryResult = await client.query(selectProducers(page))
      if (result.rowCount === 0) return undefined;
      let array: Producer[] = result.rows.map((el:any) => new Producer(el.id, el.user_id, el.name, el.region_id, el.date_creation, el.description, el.image_link));
      return array;
    },
    getProducersAmount: async (): Promise<number> => {
      const result: QueryResult = await client.query(countProducers())
      return result.rows[0].count;
    },
    getProducersByStepsAndTypesAndRegion: async (types: number[], steps: number[], region_id: number): Promise<Producer[]> => {
      const result: QueryResult = await client.query(selectProducersByStepsAndTypesAndRegion(types, steps, region_id))
      if (result.rowCount === 0) return [];
      let array: Producer[] = result.rows.map((el:any) => new Producer(el.id, el.user_id, el.name, el.region_id, el.date_creation, el.description, el.image_link));
      return array;
    },
    deleteProducer: async (user_id: number): Promise<QueryResult> => {
      return client
          .query(dropProducerByUserId(user_id))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    },
    getProducerRegionNamePhoneNumberById: (id:number): Promise<QueryResult> => {
      return client
          .query(selectProducerRegionNamePhoneNumberById(id))
          .then((result: QueryResult) => result)
          .catch((err:Error) => console.log(err));
    }
  }
}

const selectProducerRegionNamePhoneNumberById = (id: number) => `select j.id, j.user_id, j.name, j.region_name,
j.description, j.image_link, u.phone, u.name as person_name from
(select p.id, p.user_id, p.name, r.region_name as region_name,
p.description, p.image_link from
(select * from producers where id = ${id}) p 
join regions r on r.id = p.region_id) j
join users u on u.id = j.user_id`;

const dropProducerByUserId = (user_id: number) => `delete from producers where user_id = ${user_id}`;

const selectProducersByStepsAndTypesAndRegion = (types: number[], steps: number[], region_id: number) => {
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

const countProducers = () => 'select count(id) from producers';

const selectProducers = (page: number) => `select * from producers order by id offset ${page * 15} fetch first 15 rows only;`;

const updateProd = (producer_id: number, region_id: number, name: string, description: string) => `update producers set name = '${name}', region_id = ${region_id}, description = '${description}' where id = ${producer_id}`;

const insertIntoProducers = (user_id: number, producer_name: string, region_id: number, description: string, image_link: string) =>
  `insert into producers(user_id, name, region_id, date_creation, description, image_link) 
    values (${user_id}, '${producer_name}', ${region_id}, current_date, '${description}', '${image_link}') returning id`;

// @ts-ignore
const selectProducerByUserId = (user_id: number) => `select * from producers where user_id = ${user_id}`;

// @ts-ignore
const selectProducerById = (id: number) => `select * from producers where id = ${id}`;


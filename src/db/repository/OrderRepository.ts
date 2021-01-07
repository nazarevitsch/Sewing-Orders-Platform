'use strict';

import {QueryResult} from "pg";
import {Order} from "../Order";
import {Producer} from "../Producer";
import {PostgresConnection} from "../Connection";
import {MongoConnection} from "../MongoDB";

const client = require('../Connection.ts');

type OrderRepository = {
  createOrder: (user_id: number, name: string, region_id: number, small_description: string, description: string, random_key: string, image_link:string) => Promise<Order>,
  getOrderByUserIdAndAvailable: (user_id: number, available: boolean) => Promise<Order[]>,
  disableOrderByOrderId: (order_id: number, user_id: number) => Promise<QueryResult>,
  getOrdersByStepsAndTypesAndRegion:(steps:number[], types: number[], region_id: number) => Promise<QueryResult>,
  deleteOrder: (user_id: number) => Promise<QueryResult>,
  selectOrderRegionNameAndPhoneNumberByID: (id: number) => Promise<QueryResult>
}

export const orderRepository = (db: PostgresConnection) => {
  return {
    createOrder: async (user_id: number, name: string, region_id: number, small_description: string, description: string, random_key: string, image_link: string): Promise<Order> => {
      const result: QueryResult = await db.connection().query(insertOrder(user_id, name, region_id, small_description, description, random_key, image_link))
      const id = result.rows[0].id;
      return new Order(id, user_id, name, region_id, small_description, description, random_key, image_link, '');
    },
    getOrderByUserIdAndAvailable: async (user_id: number, available: boolean): Promise<Order[]> => {
      const result: QueryResult = await db.connection().query(selectOrderByUserIdAndAvailable(user_id, available))
      if (result.rowCount === 0) return [];
      let array: Order[] = result.rows.map((el: Order) => new Order(el.id, user_id, el.name, 0, '', '', '', '', el.date_creation));
      return array;
    },
    disableOrderByOrderId: async (order_id: number, user_id: number): Promise<QueryResult> => {
      return db.connection()
          .query(disOrderByOrderId(order_id, user_id))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    },
    getOrdersByStepsAndTypesAndRegion: async (steps: number[], types: number[], region_id: number): Promise<QueryResult> => {
      return db.connection()
          .query(selectOrdersByStepsAndTypesAndRegion(steps, types, region_id))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    },
    deleteOrder(user_id: number): Promise<QueryResult> {
      return db.connection()
          .query(dropOrderByUserId(user_id))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    },
    selectOrderRegionNameAndPhoneNumberByID(id: number): Promise<QueryResult> {
      return db.connection()
          .query(orderRegionNameAndPhoneNumberByID(id))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    }
  }
}

export const orderRepositoryMongo = (db: MongoConnection): OrderRepository => {
  return {
    createOrder: async (user_id: number, name: string, region_id: number, small_description: string,
                        description: string, random_key: string, image_link: string) => {
      const max = db.connection().collection('Order').find({}, {'id': 1}).sort({'id': -1}).limit(1)
      return db.connection().collection('Order').insertOne({'id': max+1, 'user_id': user_id, 'name': name, 'region_id': region_id, 'small_description': small_description,
      'description': description, 'random_key': random_key, 'image_link': image_link})
          .then((result: JSON) => result)
          .catch((err: Error) => console.log(err));
    },
    getOrderByUserIdAndAvailable: async (user_id: number, available: boolean) => {
      return db.connection().collection('Order').find({'user_id':user_id, 'available': available})
          .then((result: JSON) => result)
          .catch((err: Error) => console.log(err));
    },
    disableOrderByOrderId: async (order_id: number, user_id: number) => {
      return db.connection().collection('Order').update({'id': order_id, 'user_id': user_id}, {$set : {'available' : false}})
          .catch((err: Error) => console.log(err));
    },
    getOrdersByStepsAndTypesAndRegion: async (steps: number[], types: number[], region_id: number) => {
      return db.connection().collection('Order').find({'steps': steps, 'types': types, 'region_id': region_id})
          .then((result: JSON) => result)
          .catch((err: Error) => console.log(err));
    },
    deleteOrder: async (user_id: number) => {
      return db.connection().collection('Order').remove({'user_id':user_id})
          .catch((err: Error) => console.log(err));
    },
    selectOrderRegionNameAndPhoneNumberByID: async (id: number) => {
      return db.connection().collection('Order').find({'id': id})
          .then((result: JSON) => result)
          .catch((err:Error) => console.log(err));
    }
  };
};

const orderRegionNameAndPhoneNumberByID = (id:number) => `select j.id, j.user_id, j.name, j.region_name as region_name, 
j.description, j.image_link, u.name as person_name, u.phone from
((select o.id, o.user_id, o.name, r.region_name as region_name, o.description, o.image_link from 
(select * from orders where id = ${id}) o 
join regions r on o.region_id = r.id)) j
join users u on u.id = j.user_id`;

// const selectLastOrder = () => 'select * from orders where id = (select max(id) as max from orders);';

const dropOrderByUserId = (user_id: number) => `delete from orders where user_id = ${user_id}`;

const selectOrdersByStepsAndTypesAndRegion = (steps: number[], types: number[], region_id: number) => {
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




const disOrderByOrderId = (order_id: number, user_id: number) => `update orders set available = false where id = ${order_id} and user_id = ${user_id}`;

const selectOrderByUserIdAndAvailable = (user_id: number, available: boolean) => `select id, name, to_char(date_creation, 'DD Mon YYYY') as date_creation from orders 
where user_id = ${user_id} and available = ${available}`;



const insertOrder = (user_id: number, name: string, region_id: number, small_description: string, description:string, random_key: string, image_link:string) =>
  `insert into orders(user_id, name, region_id, available, small_description, description, date_creation, random_key, image_link) 
VALUES(${user_id}, '${name}', ${region_id}, true, '${small_description}', '${description}', current_date, '${random_key}', '${image_link}') returning id`;


'use strict';

import {PostgresConnection} from "../Connection";
import {MongoConnection} from "../MongoDB";
import {Order} from "../../domain/Order";

type OrderRepository = {
  createOrder: (user_id: number, name: string, region_id: number, small_description: string,
                description: string, random_key: string, image_link: string) => void,
  getOrderByAll: (user_id: number, name : string, region_id: number, small_description : string,
                  description: string, random_key: string) => Promise<JSON>,
  getOrderByUserIdAndAvailable: (user_id: number, available: boolean) => Promise<JSON>,
  disableOrderByOrderId: (order_id: number, user_id: number) => void,
  getOrdersByStepsAndTypesAndRegion: (steps: number[], types: number[], region_id: number) => Promise<JSON>,
  deleteOrder: (user_id: number) => void
};

export const orderRepository = (db: PostgresConnection): OrderRepository => {
  return {
    createOrder: async (user_id: number, name: string, region_id: number, small_description: string,
                        description: string, random_key: string, image_link: string) => {
      return db.connection()
          .query(insertOrder(user_id, name, region_id, small_description, description, random_key, image_link))
          .catch((err: Error) => console.log(err));
    },
    getOrderByAll: async (user_id: number, name: string, region_id: number, small_description: string,
                          description: string, random_key: string) => {
      return db.connection()
          .query(selectOrderByAll(user_id, name, region_id, small_description, description, random_key))
          .then((result: JSON) => result)
          .catch((err: Error) => console.log(err));
    },
    getOrderByUserIdAndAvailable: async (user_id: number, available: boolean) => {
      return db.connection()
          .query(selectOrderByUserIdAndAvailable(user_id, available))
          .then((result: JSON) => result)
          .catch((err: Error) => console.log(err));
    },
    disableOrderByOrderId: async (order_id: number, user_id: number) => {
      return db.connection()
          .query(disOrderByOrderId(order_id, user_id))
          .catch((err: Error) => console.log(err));
    },
    getOrdersByStepsAndTypesAndRegion: async (steps: number[], types: number[], region_id: number) => {
      return db.connection()
          .query(selectOrdersByStepsAndTypesAndRegion(steps, types, region_id))
          .then((result: JSON) => result)
          .catch((err: Error) => console.log(err));
    },
    deleteOrder: async (user_id: number) => {
      return db.connection()
          .query(dropOrderByUserId(user_id))
          .catch((err: Error) => console.log(err));
    }
  };
};

export const orderRepositoryMongo = (db: MongoConnection): OrderRepository => {
  return {
    createOrder: async (user_id: number, name: string, region_id: number, small_description: string,
                        description: string, random_key: string, image_link: string) => {
      const max = db.connection().collection('Order').find({}, {'id': 1}).sort({'id': -1}).limit(1)
      const order = new Order(max+1, user_id, name, region_id, true, small_description, description,
          random_key, image_link, Date.now().toString(), '');
      return db.connection().collection('Order').insertOne(order)
          .then((result: JSON) => result)
          .catch((err: Error) => console.log(err));
    },
    getOrderByAll: async (user_id: number, name: string, region_id: number, small_description: string,
                          description: string, random_key: string) => { //по всім полям перевірка
      return db.connection().collection('Order').find({'user_id': user_id, 'name': name,'region_id': region_id,
        'small_description': small_description, 'description': description, 'random_key': random_key})
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
    }
  };
};

const dropOrderByUserId = (user_id: number) => `delete from orders where user_id = ${user_id}`;

const selectOrdersByStepsAndTypesAndRegion = (steps: number[], types: number[], region_id: number) => {
  let answer : String = '';
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

const selectOrderByUserIdAndAvailable = (user_id: number, available: boolean) => `select id, name, to_char(date_creation, 'DD Mon YYYY') as date from orders 
where user_id = ${user_id} and available = ${available}`;

const selectOrderByAll = (user_id: number, name: string, region_id: number, small_description: string,
                          description: string, random_key: string) =>
  `select * from orders where user_id = ${user_id} and name = '${name}' and region_id = ${region_id} and 
small_description = '${small_description}' and description = '${description}' and available = true 
and random_key = '${random_key}'`;

const insertOrder = (user_id: number, name: string, region_id: number, small_description: string,
                     description: string, random_key: string, image_link: string) =>
  `insert into orders(user_id, name, region_id, available, small_description, description, date_creation, random_key, image_link) 
VALUES(${user_id}, '${name}', ${region_id}, true, '${small_description}', '${description}', current_date, '${random_key}', '${image_link}')`;

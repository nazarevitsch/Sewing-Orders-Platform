'use strict';

import {QueryResult} from "pg";

const client = require('../Connection.ts');

type ProducersTypesRepository = {
  addProducersTypes: (typesList: number[], producer_id: number) => Promise<QueryResult>,
  getTypesByProducerId: (producer_id: number) => Promise<number[]>,
  deleteTypesByProducerId: (producer_id: number) => Promise<QueryResult>
};

export const producersTypesRepository = () => {
  return{
    addProducersTypes: async (typesList: number[], producer_id: number): Promise<QueryResult> => {
      return client
          .query(insertIntoProducersTypes(typesList, producer_id))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    },
    getTypesByProducerId: async (producer_id: number): Promise<number[]> => {
      const result: QueryResult = await client.query(selectTypesByProducerId(producer_id))
      if (result.rowCount === 0) return [];
      let array: number[] = result.rows.map((el:any) => el.sewing_type_id);
      return array;
    },
    deleteTypesByProducerId:(producer_id: number): Promise<QueryResult> => {
      return client
          .query(deleteTypesByProdId(producer_id))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    }
  }
}

const deleteTypesByProdId = (producer_id: number) => `delete from producers_sewing_types where producer_id = ${producer_id}`;

const selectTypesByProducerId = (producer_id: number) => `select * from producers_sewing_types where producer_id = ${producer_id}`;

const insertIntoProducersTypes = (typesList: number[], producerId: number) => {
  let q = `insert into producers_sewing_types(producer_id, sewing_type_id)
values (${producerId}, ${Number(typesList[0])})`;
  for (let i = 1; i < typesList.length; i++) {
    q += `, (${producerId}, ${Number(typesList[i])})`;
  }
  return q;
};

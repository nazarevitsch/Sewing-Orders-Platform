'use strict';

import {QueryResult} from "pg";
import {Region} from "../Region";

const client = require('../Connection.ts');

type ProducersStepsRepository = {
  addProducersSteps: (stepsList: number[], producer_id: number) => Promise<QueryResult>,
  getStepsByProducerId: (producer_id: number) => Promise<number[]>,
  deleteStepsByProducerId: (producer_id: number) => Promise<QueryResult>
}

export const producersStepsRepository = () => {
  return{
    addProducersSteps: async (stepsList: number[], producer_id: number): Promise<QueryResult> => {
      return client
          .query(insertIntoProducersSteps(stepsList, producer_id))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    },
    getStepsByProducerId: async (producer_id: number): Promise<number[]> => {
      const result: QueryResult = await client.query(selectStepsByProducerId(producer_id))
      if (result.rowCount === 0) return [];
      let array: number[] = result.rows.map((el:any) => el.manufacturing_step_id);
      return array;
    },
    deleteStepsByProducerId: async (producer_id: number): Promise<QueryResult> => {
      return client
          .query(deleteStepsByProdId(producer_id))
          .then((result: QueryResult) => result)
          .catch((err: Error) => console.log(err));
    }
  }
}


const deleteStepsByProdId = (producer_id: number) => `delete from producers_manufacturing_steps where producer_id = ${producer_id}`;

const selectStepsByProducerId = (producer_id: number) => `select * from producers_manufacturing_steps where producer_id = ${producer_id}`;

const insertIntoProducersSteps = (stepsList: number[], producerId: number) => {
  let q = `insert into producers_manufacturing_steps(producer_id, manufacturing_step_id)
values (${producerId}, ${Number(stepsList[0])})`;
  for (let i = 1; i < stepsList.length; i++) {
    q += `, (${producerId}, ${Number(stepsList[i])})`;
  }
  return q;
};

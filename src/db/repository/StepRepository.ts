'use strict';

import {QueryResult} from "pg";

const client = require('../Connection.ts');
import {Step} from "../Step";

type StepRepository = {
  getAllSteps: () => Promise<Step[]>
};

export const stepRepository = () => {
  return{
    getAllSteps: async (): Promise<Step[]> => {
      const result: QueryResult = await client.query(selectAllSteps());
      if(result.rowCount === 0) return [];
      let array: Step[] = result.rows.map((el:any) => new Step(el.id, el.name));
      return array;
    }
  }
}

const selectAllSteps = () => 'select * from manufacturing_steps';


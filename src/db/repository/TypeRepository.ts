'use strict';


import {QueryResult} from "pg";
const client = require('../Connection.ts');
import {Type} from "../Type"

type TypeRepository = {
  getAllTypes: () => Promise<Type[]>
};

export const typeRepository = () => {
  return {
    getAllTypes: async (): Promise<Type[]> =>{
      const result: QueryResult = await client.query(selectAllTypes())
      if(result.rowCount === 0) return [];
      let array: Type[] = result.rows.map((el:any) => new Type(el.id, el.name));
      return array;
    }
  }
}


const selectAllTypes = () => 'select * from sewing_types';


'use strict';

import {QueryResult} from "pg";

const client = require('../Connection.ts');
import {Region} from "../Region";


type RegionRepository = {
  selectAllRegions: () => Promise<Region[]>
};

export const regionRepository = () => {
  return{
    selectAllRegions: async (): Promise<Region[]> => {
      const result: QueryResult = await client.query(getAllRegions());
      if(result.rowCount === 0) return [];
      let array: Region[] = result.rows.map((el:any) => new Region(el.id, el.region_name));
      return array;
    }
  }
};

const getAllRegions = () => 'select * from regions';

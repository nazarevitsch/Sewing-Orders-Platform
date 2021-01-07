'use strict';

const MongoClient = require('mongodb').MongoClient;

const url = '"mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();

export type MongoConnection = {
    connection: () => any
};

export const createConnection = (): MongoConnection => {
    return {
        connection: () => {return client.db('JSTrack')}
    }
};

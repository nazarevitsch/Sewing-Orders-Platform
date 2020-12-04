'use strict';
require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('Connection to remote DB is working...');
  })
  .catch(e => console.log(e));

module.exports = client;

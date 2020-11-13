'use strict';
require('dotenv').config();
const jwt = require('jsonwebtoken');

function createToken(body) {
  const token = jwt.sign({
    username: body.username,
    password: body.password
  }, process.env.SECRET_KEY);
  return token;
}

async function verifyToken(token) {
  let user;
  await jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    user = data;
  });
  return user;
}

module.exports = {
  createToken,
  verifyToken
};

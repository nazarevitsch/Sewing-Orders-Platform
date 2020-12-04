'use strict';
require('dotenv').config();
const jwt = require('jsonwebtoken');
const userService = require('../service/UserService.js');

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
  if (user !== undefined) {
    return (await userService.findUserByEmailAndPassword(user.username, user.password)) ? user : undefined;
  } else return undefined;
}

module.exports = {
  createToken,
  verifyToken
};

'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const userService = require('../service/UserService');

async function login(email, password){
  if ((await userService.isUserExist(email, password))){
    return createToken(email, password);
  }
  return undefined;
}

async function registration(email, password) {
  if (await userService.isEmailAlreadyUsed(email)) {
    return {token: undefined, status: 406, message: 'Email is already used.'};
  } else if (checkEmail(email) && checkPassword(password)) {
    await userService.createUser(email, password);
    return {token: createToken(email, password), status: 200, message: 'Everything is ok.'}
  } else {
    return {token: undefined, status: 406, message: 'Email or Password is wrong!.'}
  }
}

function createToken(username, password) {
  const token = jwt.sign({
    username: username,
    password: password
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

function checkEmail(email){
  let patternForEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return email.match(patternForEmail);
}

function checkPassword(password) {
  let pattern = /^\w+$/;
  return pattern.test(password);
}

module.exports = {
  createToken,
  verifyToken,

  login,
  registration
};

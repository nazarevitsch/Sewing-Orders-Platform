'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const userService = require('../service/UserService.js');
const mailSender = require('../email/MailSender.js');

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

async function changePassword(token, oldPassword, newPassword) {
  const user = await verifyToken(token);
  if (user === undefined) {
    return {token: undefined, status: 401, message: 'You are unauthorized.'};
  } else {
    if (user.password === oldPassword) {
      if (checkPassword(newPassword)) {
        await userService.updatePasswordByEmail(user.username, newPassword);
        return {token: createToken(user.username, newPassword), status: 200, message: 'OK.'};
      } else {
        return {token: undefined, status: 406, message: 'New password is incorrect.'};
      }
    } else {
      return {token: undefined, status: 406, message: 'Old password is incorrect.'};
    }
  }
}

async function forgotPassword(email) {
  const user = userService.getUserByEmail(email);
  if (user === undefined){
    return {status: 406, message: 'User with such email does not exists.'}
  } else {
    const newPassword = await makeKey(10);
    await userService.updatePasswordByEmail(email, newPassword);
    await mailSender.sendMail(email, 'New Password', `Your new password: ${newPassword}`);
    return {status: 200, message: 'New password was sent to email.'}
  }
}

async function makeKey(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function checkEmail(email){
  let patternForEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return patternForEmail.test(email);
}

function checkPassword(password) {
  let pattern = /^\w{8,20}$/;
  return pattern.test(password);
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
    let userDB = await userService.getUserByEmailAndPassword(user.username, user.password);
    return (user.username === userDB.email && user.password === userDB.password) ? userDB : undefined;
  } else return undefined;
}

async function validateToken(ctx, next) {
  ctx.request.user = await verifyToken(ctx.cookies.get('token'));
  await next();
}

module.exports = {
  createToken,
  verifyToken,
  login,
  registration,
  changePassword,
  validateToken,
  forgotPassword
};

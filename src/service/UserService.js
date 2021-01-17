'use strict';

const UserRepository = require('../db/repository/UserRepository.js');

async function getUserByEmailAndPassword(email, password) {
  return await  UserRepository.getUserByEmailAndPassword(email, password);
}

async function isUserExist(email, password){
  return await UserRepository.isUserExist(email, password);
}

async function isEmailAlreadyUsed(email) {
  return await UserRepository.isEmailAlreadyUsed(email);
}

async function createUser(email, password) {
  await UserRepository.createUser(email, password);
}

async function updatePasswordByEmail(email, newPassword) {
  await UserRepository.updatePasswordByEmail(email, newPassword);
}

async function updatePhoneAndNameOfUser(email, password, name, phone) {
  if (checkPhone(phone)) {
    await UserRepository.updatePhoneAndNameOfUser(email, password, name, phone);
    return {status: 200, message: 'Ok.'}
  } else return {status: 406, message: 'Wrong phone.'};
}

async function getUserByEmail(email) {
  return await UserRepository.getUserByEmail(email);
}

function checkPhone(phone){
  let patternForPhoneNumber = /(^\+?\d{12}$)|(^\d{10}$)/;
  return patternForPhoneNumber.test(phone);
}

// old function

async function deleteUserByEmailAndPassword(email, password) {
  await UserRepository.deleteUserByEmailAndPassword(email, password);
}

module.exports = {
  updatePasswordByEmail,
  createUser,
  isEmailAlreadyUsed,
  updatePhoneAndNameOfUser,
  getUserByEmail,
  deleteUserByEmailAndPassword,
  isUserExist,
  getUserByEmailAndPassword,
};

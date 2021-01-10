'use strict';

const UserRepository = require('../db/repository/UserRepository.js');
const MailSender = require('../email/MailSender.js');

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
  console.log(patternForPhoneNumber.test(phone));
  return patternForPhoneNumber.test(phone);
}

// old function

async function findUserByEmailAndPassword(email, password) {
  return (await UserRepository.searchUserByEmailAndPassword(email, password)).rowCount === 1;
}

async function getAllInformationAboutUser(email, password) {
  const answer = await UserRepository.searchUserByEmailAndPassword(email, password);
  return answer.rows[0];
}

async function getUserIdByEmailAndPassword(email, password) {
  const answer = await UserRepository.searchUserByEmailAndPassword(email, password);
  return answer.rows[0].id;
}


async function forgotPassword(email) {
  const newPassword = await makeKey();
  await updatePasswordByEmail(email, newPassword);
  await MailSender.sendMail(email, 'New Password', `Your new password: ${newPassword}`);
}

async function deletePasswordByEmailAndPassword(email, password) {
  await UserRepository.deleteUserByEmailAndPassword(email, password);
}

async function makeKey() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = {
  getAllInformationAboutUser,
  updatePasswordByEmail,
  findUserByEmailAndPassword,
  createUser,
  isEmailAlreadyUsed,
  updatePhoneAndNameOfUser,
  getUserIdByEmailAndPassword,
  getUserByEmail,
  forgotPassword,
  deletePasswordByEmailAndPassword,

  isUserExist
};

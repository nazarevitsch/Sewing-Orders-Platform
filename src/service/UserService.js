'use strict';

const UserRepository = require('../db/repository/UserRepository.js');
const MailSender = require('../email/MailSender.js');

async function isEmailAlreadyUsed(email) {
  return (await UserRepository.emailIsAlreadyUsed(email)).rowCount === 1;
}

async function createUser(email, password) {
  await UserRepository.createUser(email, password);
}

async function findUserByEmailAndPassword(email, password) {
  return (await UserRepository.searchUserByEmailAndPassword(email, password)).rowCount === 1;
}

async function updatePasswordByEmail(email, newPassword) {
  await UserRepository.updatePasswordByEmail(email, newPassword);
}

async function getAllInformationAboutUser(email, password) {
  const answer = await UserRepository.searchUserByEmailAndPassword(email, password);
  return answer.rows[0];
}

async function updatePhoneAndNameOfUser(email, password, name, phone) {
  await UserRepository.updatePhoneAndNameOfUser(email, password, name, phone);
}

async function getUserIdByEmailAndPassword(email, password) {
  const answer = await UserRepository.searchUserByEmailAndPassword(email, password);
  return answer.rows[0].id;
}

async function getUserByEmail(email) {
  const answer = await UserRepository.getUserByEmail(email);
  return answer.rows.length > 0 ? answer.rows[0] : undefined;
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
  deletePasswordByEmailAndPassword
};

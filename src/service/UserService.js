'use strict';

const UserRepository = require('../db/repository/UserRepository.ts');
const MailSender = require('../email/MailSender.js');


async function isEmailAlreadyUsed(email) {
  return await UserRepository.userRepository().emailIsAlreadyUsed(email);
}

async function createUser(email, password) {
  await UserRepository.userRepository().createUser(email, password);
}

async function findUserByEmailAndPassword(email, password) {
  return (await UserRepository.userRepository().searchUserByEmailAndPassword(email, password)) !== undefined;
}

async function updatePasswordByEmail(email, newPassword) {
  await UserRepository.userRepository().updatePasswordByEmail(email, newPassword);
}

async function getAllInformationAboutUser(email, password) {
  return  await UserRepository.userRepository().searchUserByEmailAndPassword(email, password);
}

async function updatePhoneAndNameOfUser(email, password, name, phone) {
  await UserRepository.userRepository().updatePhoneAndNameOfUser(email, password, name, phone);
}

async function getUserIdByEmailAndPassword(email, password) {
  const answer = await UserRepository.userRepository().searchUserByEmailAndPassword(email, password);
  return answer.id;
}

async function getUserByEmail(email) {
  const answer = await UserRepository.userRepository().getUserByEmail(email);
  return answer.rows.length > 0 ? answer.rows[0] : undefined;
}

async function forgotPassword(email) {
  const newPassword = await makeKey();
  await updatePasswordByEmail(email, newPassword);
  await MailSender.sendMail(email, 'New Password', `Your new password: ${newPassword}`);
}

async function deletePasswordByEmailAndPassword(email, password) {
  await UserRepository.userRepository().deleteUserByEmailAndPassword(email, password);
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

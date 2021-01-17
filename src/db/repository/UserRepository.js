'use strict';

const client = require('../Connection.js');

async function getUserByEmailAndPassword(email, password) {
  const user = await client
    .query(selectUserByEmailAndPassword(email, password))
    .then(result => result)
    .catch(err => console.log(err));
  return user.rows[0];
}

async function isUserExist(email, password){
  const user = await getUserByEmailAndPassword(email, password);
  if (user === undefined) return false;
  return user.email === email && user.password === password;
}

async function isEmailAlreadyUsed(email) {
  const user = await client
    .query(searchEmail(email))
    .then(result => result)
    .catch(err => console.log(err));
  return user.rowCount > 0;
}

async function createUser(email, password) {
  return client
    .query(insertUser(email, password))
    .then(result => result)
    .catch(err => console.log(err));
}

async function updatePasswordByEmail(email, newPassword) {
  return client
    .query(updatePassword(email, newPassword))
    .then(result => result)
    .catch(err => console.log(err));
}

async function updatePhoneAndNameOfUser(email, password, name, phone) {
  return client
    .query(updateExistedUser(email, password, name, phone))
    .then(result => result)
    .catch(err => console.log(err));
}

async function getUserByEmail(email) {
  let user = await client
    .query(selectUserByEmail(email))
    .then(result => result)
    .catch(err => console.log(err));
  return user.rowCount === 1 ? user.rows[0] : undefined;
}

//old functions

async function deleteUserByEmailAndPassword(email, password) {
  return client
    .query(deleteUser(email, password))
    .then(result => result)
    .catch(err => console.log(err));
}

const deleteUser = (email, password) => `delete from users where email = '${email}' and password = '${password}'`;

const selectUserByEmail = email => `select * from users where email = '${email}'`;

const updateExistedUser = (email, password, name, phone) => `update users set name = '${name}', phone = '${phone}' where email = '${email}' and password = '${password}'`;

const updatePassword = (email, newPassword) => `update users set password = '${newPassword}' where email = '${email}'`;

const selectUserByEmailAndPassword = (email, password) => `select * from users where email = '${email}' and password = '${password}'`;

const searchEmail = email => `select * from users where email = '${email}'`;

const insertUser = (email, password) => `insert into users(email, password, date_creation) values('${email}', '${password}', current_date)`;

module.exports = {
  updatePhoneAndNameOfUser,
  isEmailAlreadyUsed,
  updatePasswordByEmail,
  createUser,
  getUserByEmail,
  deleteUserByEmailAndPassword,
  getUserByEmailAndPassword,
  isUserExist
};

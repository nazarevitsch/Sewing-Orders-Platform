'use strict';

const client = require('../Connection.js');

async function getUserByEmailAndPassword(email, password) {
  const user = await client
    .query(selectUserByEmailAndPassword, [email, password])
    .then(result => result)
    .catch(err => console.log(err));
  return user.rows[0];
}

async function isUserExist(email, password) {
  const user = await getUserByEmailAndPassword(email, password);
  if (user === undefined) return false;
  return user.email === email && user.password === password;
}

async function isEmailAlreadyUsed(email) {
  const user = await client
    .query(searchEmail, [email])
    .then(result => result)
    .catch(err => console.log(err));
  return user.rowCount > 0;
}

async function createUser(email, password) {
  return client
    .query(insertUser, [email, password])
    .then(result => result)
    .catch(err => console.log(err));
}

async function updatePasswordByEmail(email, newPassword) {
  return client
    .query(updatePassword, [email, newPassword])
    .then(result => result)
    .catch(err => console.log(err));
}

async function updatePhoneAndNameOfUser(email, password, name, phone) {
  return client
    .query(updateExistedUser, [email, password, name, phone])
    .then(result => result)
    .catch(err => console.log(err));
}

async function getUserByEmail(email) {
  const user = await client
    .query(selectUserByEmail, [email])
    .then(result => result)
    .catch(err => console.log(err));
  return user.rowCount === 1 ? user.rows[0] : undefined;
}

//old functions

async function deleteUserByEmailAndPassword(email, password) {
  return client
    .query(deleteUser, [email, password])
    .then(result => result)
    .catch(err => console.log(err));
}

const deleteUser = 'delete from users where email = \'$1\' and password = \'$2\'';

const selectUserByEmail = 'select * from users where email = \'$1\'';

const updateExistedUser =  'update users set name = \'$1\', phone = \'$2\' where email = \'$3\' and password = \'$4\'';

const updatePassword = 'update users set password = \'$1\' where email = \'$2\'';

const selectUserByEmailAndPassword =  'select * from users where email = \'$1\' and password = \'$2\'';

const searchEmail =  'select * from users where email = \'$1\'';

const insertUser = 'insert into users(email, password, date_creation) values(\'$1\', \'$2\', current_date)';

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

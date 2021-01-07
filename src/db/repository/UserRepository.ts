'use strict';

import {QueryResult} from "pg";

const client = require('../Connection.ts');
import {User} from "../User";

type UserRepository = {
    emailIsAlreadyUsed:  (email: string) => Promise<boolean>,
    createUser:  (email: string, password: string) =>  Promise<User>,
    searchUserByEmailAndPassword: (email: string , password: string) => Promise<User|undefined>,
    updatePasswordByEmail: (email: string, newPassword: string) => Promise<QueryResult>,
    updatePhoneAndNameOfUser: (email: string, password: string, name:string, phone: string) => Promise<QueryResult>,
    getUserByEmail: (email: string) => Promise<User|undefined>,
    deleteUserByEmailAndPassword: (email: string, password: string) => Promise<QueryResult>

};

export const userRepository = () => {
    return{
        emailIsAlreadyUsed: async (email: string): Promise<boolean> => {
            const result = await client.query(searchEmail(email))
            if (result.rowCount === 1) return true
            return false
        },
        createUser: async (email: string, password: string): Promise<User> => {
            const result: QueryResult =  await client.query(insertUser(email, password))
            const id = result.rows[0].id;
            return new User(id, email, password, '','');
        },
        searchUserByEmailAndPassword: async (email: string , password: string): Promise<User|undefined> => {
            const  result: QueryResult = await client.query(selectUserByEmailAndPassword(email, password))
            if (result.rowCount === 0)
                return undefined
            const row = result.rows[0];
            return new User(row.id, row.email, row.password, row.name, row.phone);
        },
        updatePasswordByEmail: async (email: string, newPassword: string): Promise<QueryResult> => {
            return client
                .query(updatePassword(email, newPassword))
                .then((result: QueryResult) => result)
                .catch((err: Error) => console.log(err));
        },
        updatePhoneAndNameOfUser: async (email: string, password: string, name:string, phone: string): Promise<QueryResult> => {
            return client
                .query(updateExistedUser(email, password, name, phone))
                .then((result: QueryResult) => result)
                .catch((err: Error) => console.log(err));
        },
        getUserByEmail: async (email: string): Promise<User|undefined> => {
            const  result: QueryResult = await client.query(selectUserByEmail(email))
            if (result.rowCount === 0)
                return undefined
            const row = result.rows[0];
            return new User(row.id, row.email, row.password, row.name, row.phone);
        },
        deleteUserByEmailAndPassword: async (email: string, password: string): Promise<QueryResult> => {
            return client
                .query(deleteUser(email, password))
                .then((result: QueryResult) => result)
                .catch((err: Error) => console.log(err));
        }
    };
};


const deleteUser = (email: string, password: string) => `delete from users where email = '${email}' and password = '${password}'`;

const selectUserByEmail = (email: string)=> `select * from users where email = '${email}'`;

const updateExistedUser = (email: string, password: string, name: string, phone: string) => `update users set name = '${name}', phone = '${phone}' where email = '${email}' and password = '${password}'`;

const updatePassword = (email: string, newPassword: string) => `update users set password = '${newPassword}' where email = '${email}'`;

const selectUserByEmailAndPassword = (email: string, password: string) => `select * from users where email = '${email}' and password = '${password}'`;

const searchEmail = (email: string) => `select * from users where email = '${email}'`;

const insertUser = (email: string, password: string) => `insert into users(email, password, date_creation) values('${email}', '${password}', current_date) returning id`;



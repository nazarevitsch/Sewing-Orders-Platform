'use strict';
const request = require('supertest');
const userService = require('./src/service/UserService.js');
const producerService = require('./src/service/ProducerService.js');
const orderService = require('./src/service/OrderService.js');

const testEmail = '22testfortest22@gmail.com';
const testPassword =  'test2020test';
// Tests with user

test('User exist', async() =>
{
  await userService.createUser(testEmail, testPassword);
  expect(await userService.isEmailAlreadyUsed(testEmail))
      .toBe(true);
  await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
}
)
;

test('Find user by email and password', async () => {
  await userService.createUser(testEmail, testPassword);
  expect(await userService.findUserByEmailAndPassword(testEmail, testPassword))
      .toBe(true);
  await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
});

test('Create user and delete user', async () => {
  await userService.createUser(testEmail, testPassword);
  expect(await userService.findUserByEmailAndPassword(testEmail, testPassword))
      .toBe(true);
  await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
});

test('Find user by Email', async () => {
  await userService.createUser(testEmail, testPassword);
  expect((await userService.getUserByEmail(testEmail)).email)
      .toBe(testEmail);
  await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
});

test('Update password', async () => {
  await userService.createUser(testEmail, testPassword);
  const newPassword = '1234567890';
  await userService.updatePasswordByEmail(testEmail, newPassword);
  expect(await userService.findUserByEmailAndPassword(testEmail, newPassword))
      .toBe(true);
  await userService.deletePasswordByEmailAndPassword(testEmail, newPassword);
});

test('Get all information about user', async () => {
  await userService.createUser(testEmail, testPassword);
  const user = await userService.getAllInformationAboutUser(testEmail, testPassword);
  expect(user !== undefined)
      .toBe(true);
  await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
});

test('Update phone and username', async () => {
  await userService.createUser(testEmail, testPassword);
  const testName = 'test';
  const testPhone = '0973664242';
  await userService.updatePhoneAndNameOfUser(testEmail, testPassword, testName, testPhone);
  const user = await userService.getAllInformationAboutUser(testEmail, testPassword);
  const result = {phone: user.phone, name: user.name};
  expect(result)
      .toStrictEqual({phone: testPhone, name: testName});
  await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
});

test('Forgot password', async () => {
  await userService.createUser(testEmail, testPassword);
  await userService.forgotPassword(testEmail);
  const newPassword = (await userService.getUserByEmail(testEmail)).password;
  expect(newPassword !== testPassword)
      .toBe(true);
  await userService.deletePasswordByEmailAndPassword(testEmail, newPassword);
});


//Test with Types
const typeService = require('./src/service/TypeService.js');
test('Get Types', async () => {
  expect((await typeService.getAllTypes()) !== undefined)
      .toBe(true);
});


//Test with Steps
const stepsService = require('./src/service/StepService.js');
test('Get Steps', async () => {
  expect((await stepsService.getAllSteps()) !== undefined)
      .toBe(true);
});

//Test with Regions
const regionsService = require('./src/service/RegionService.js');
test('Get Regions', async () => {
  expect((await regionsService.getAllRegions()) !== undefined)
      .toBe(true);
});


//Routes
const app = require('./index.js').app.listen(8794);
test('Rout: / -GET', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
});

test('Rout: /index -GET', async () => {
  const response = await request(app).get('/index');
  expect(response.status).toBe(200);
});

test('Rout: /login -GET', async () => {
  const response = await request(app).get('/login');
  expect(response.status).toBe(200);
});

// test('Rout: /registration -GET', async () => {
//   const response = await request(app).get('/registration');
//   expect(response.status).toBe(200);
// });

async function login() {
  await userService.createUser(testEmail, testPassword);
  const response = await request(app)
      .post('/login')
      .send({username: testEmail, password: testPassword});
  return response;
}

// test('Rout: /registration -POST', async () => {
//   const response = await request(app)
//       .post('/registration')
//       .send({username: testEmail, password: testPassword});
//   expect(response.status).toBe(200);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });

// test('Rout: /login -POST', async () => {
//   const response = await login();
//   expect(response.status).toBe(200);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });

test('Rout: /change password -POST', async () => {
  const newPassword = '1234567890';
  const logined = await login();
  const response = await request(app)
      .post('/change_password')
      .set('Cookie', ['token=' + logined.body.token])
      .send({old_password: testPassword, new_password: newPassword});
  expect(response.status).toBe(200);
  await userService.deletePasswordByEmailAndPassword(testEmail, newPassword);
});

// test('Rout: /user room -GET', async () => {
//   const logined = await login();
//   const response = await request(app)
//       .get('/user_room')
//       .set('Cookie', ['token=' + logined.body.token]);
//   expect(response.status).toBe(200);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });


// test('Rout: /update personal user data -POST', async () => {
//   const logined = await login();
//   const response = await request(app)
//       .post('/set_new_user_data')
//       .set('Cookie', ['token=' + logined.body.token])
//       .send({name: 'Test', phone: '0973653434'});
//   expect(response.status).toBe(200);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });


// test('Rout: /create_manufacture -POST', async () => {
//   const logined = await login();
//   const response = await request(app)
//       .post('/create_manufacture')
//       .set('Cookie', ['token=' + logined.body.token])
//       .send({producer_name: 'Test', region_id: 1, types: [], steps: [], description: 'Test'});
//   expect(response.status).toBe(200);
//   await producerService.deleteProducer(testEmail, testPassword);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });

// test('Rout: /update_manufacture -POST', async () => {
//   const logined = await login();
//   await request(app)
//       .post('/create_manufacture')
//       .set('Cookie', ['token=' + logined.body.token])
//       .send({producer_name: 'Test', region_id: 1, types: [], steps: [], description: 'Test'});
//   const response = await request(app)
//       .post('/update_manufacture')
//       .set('Cookie', ['token=' + logined.body.token])
//       .send({producer_name: 'Test', region_id: 2, types: [], steps: [], description: 'Test'});
//   expect(response.status).toBe(200);
//   await producerService.deleteProducer(testEmail, testPassword);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });

test('Rout: /producers -GET', async () => {
  const response = await request(app)
      .get('/producers');
  expect(response.status).toBe(200);
});


test('Rout: /producer_page -GET', async () => {
  const response = await request(app)
      .post('/producer_page/0')
      .send({region_id: 1, types: [1, 3], steps: [4, 5]});
  expect(response.status).toBe(200);
});

// test('Rout: /create_order -GET', async () => {
//   const logined = await login();
//   const response = await request(app)
//       .get('/create_order')
//       .set('Cookie', ['token=' + logined.body.token]);
//   expect(response.status).toBe(200);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });

// test('Rout: /create_order -POST', async () => {
//   const logined = await login();
//   const response = await request(app)
//       .post('/create_order')
//       .set('Cookie', ['token=' + logined.body.token])
//       .send({name: 'Test', region_id: 1, small_description: 'Test', description: 'Test', types: [], steps: []});
//   expect(response.status).toBe(200);
//   await orderService.deleteOrder(testEmail, testPassword);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });

// test('Rout: /disable_order -POST', async () => {
//   const logined = await login();
//   await request(app)
//       .post('/create_order')
//       .set('Cookie', ['token=' + logined.body.token])
//       .send({name: 'Test', region_id: 1, small_description: 'Test', description: 'Test', types: [], steps: []});
//   const order = await orderService.findLastOrder();
//   const response = await request(app)
//       .post('/disable_order/' + order.id)
//       .send({username: testEmail});
//   expect(response.status).toBe(302);
//   await orderService.deleteOrder(testEmail, testPassword);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });

test('Rout: /orders -GET', async () => {
  const response = await request(app)
      .get('/orders');
  expect(response.status).toBe(200);
});

// test('Rout: /order_page -GET', async () => {
//   const response = await request(app)
//       .post('/order_page/0')
//       .send({region_id: 1, types: [1, 3], steps: [4, 5]});
//   expect(response.status).toBe(200);
// });

// test('Rout: /orders_history -GET', async () => {
//   const logined = await login();
//   const response = await request(app)
//       .get('/orders_history')
//       .set('Cookie', ['token=' + logined.body.token]);
//   expect(response.status).toBe(200);
//   await userService.deletePasswordByEmailAndPassword(testEmail, testPassword);
// });

test('Rout: /forgot_password -GET', async () => {
  const response = await request(app)
      .get('/forgot_password');
  expect(response.status).toBe(200);
});

test('Rout: /forgot_password -POST', async () => {
  await login();
  const response = await request(app)
      .post('/forgot_password')
      .send({username: testEmail});
  expect(response.status).toBe(200);
  await userService.deletePasswordByEmailAndPassword(testEmail,
      (await userService.getUserByEmail(testEmail)).password);
});

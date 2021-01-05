'use strict';
require('dotenv').config();
const Router = require('koa-router');
const workWithToken = require('./auth/WorkWithToken.js');
const userService = require('./service/UserService.js');
const regionService = require('./service/RegionService.js');
const producerService = require('./service/ProducerService.js');
const typeService = require('./service/TypeService.js');
const stepService = require('./service/StepService.js');
const producerStepsService = require('./service/ProducersStepsService.js');
const producerTypesService = require('./service/ProducersTypesService.js');
const orderService = require('./service/OrderService');
const s3 = require('./workWithAWS/connectionAWS.js');
const fs = require('fs');
const db = require('./db/Connection');

const router = new Router();

router
  .get('/', async ctx => {
    await ctx.render('index');
  })
  .get('/index', async ctx => {
    await ctx.render('index');
  })
  .get('/login', async ctx => {
    await ctx.render('login');
  })
  .post('/login', async ctx => {
    const userExist = await userService.findUserByEmailAndPassword(ctx.request.body.username, ctx.request.body.password);
    if (userExist) {
      const token = workWithToken.createToken(ctx.request.body);
      ctx.response.body = { token };
    } else ctx.response.body = 406;
  })
  .get('/registration', async ctx => {
    await ctx.render('registration');
  })
  .post('/registration', async ctx => {
    if ((await userService.isEmailAlreadyUsed(ctx.request.body.username))) {
      ctx.response.body = 406;
    } else {
      await userService.createUser(ctx.request.body.username, ctx.request.body.password);
      const token = workWithToken.createToken(ctx.request.body);
      ctx.response.body = {
        token
      };
    }
  })
  .post('/change_password', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      if (data.password === ctx.request.body.old_password) {
        await userService.updatePasswordByEmail(data.username, ctx.request.body.new_password);
        const token = workWithToken.createToken({ username: data.username, password: ctx.request.body.new_password });
        ctx.response.body = { token };
      } else {
        ctx.response.body = 'Wrong old password!';
      }
    } else {
      ctx.response.body = 406;
    }
  })
  .get('/user_room', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      const user = await userService.getAllInformationAboutUser(data.username, data.password);
      const regions = await regionService.getAllRegions();
      const steps = await stepService.getAllSteps();
      const types = await typeService.getAllTypes();
      const producer = await producerService.getProducerByUserId(user.id);
      if (producer !== undefined) {
        const producer_types = await producerTypesService.getTypesByProducerId(producer.id);
        const producer_steps = await producerStepsService.getStepsByProducerId(producer.id);
        for (let i = 0; i < steps.length; i++) {
          for (let l = 0; l < producer_steps.length; l++) {
            if (steps[i].id === producer_steps[l].manufacturing_step_id) {
              steps[i].check = true;
              break;
            }
          }
        }
        for (let i = 0; i < types.length; i++) {
          for (let l = 0; l < producer_types.length; l++) {
            if (types[i].id === producer_types[l].sewing_type_id) {
              types[i].check = true;
              break;
            }
          }
        }
      }
      await ctx.render('user_room', {
        username: data.username,
        name: user.name,
        phone: user.phone,
        regions,
        steps,
        types,
        producer_already_existed: (producer !== undefined),
        region_id: producer === undefined ? -1 : producer.region_id,
        producer_name: producer === undefined ? '' : producer.name
      });
    } else {
      ctx.redirect('/login');
    }
  })
  .post('/set_new_user_data', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      await userService.updatePhoneAndNameOfUser(data.username, data.password, ctx.request.body.name, ctx.request.body.phone_number);
      ctx.response.body = 200;
    } else {
      ctx.redirect('/login');
    }
  })
  .post('/create_manufacture', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      const producer_id = await producerService.getProducerIdByUserId(await userService.getUserIdByEmailAndPassword(data.username, data.password));
      let image_link = await s3.uploadFile(ctx.request.files.image.path);
      fs.unlinkSync(ctx.request.files.image.path);
      if (producer_id === undefined) {
        await producerService.createProducer(data, ctx.request.body.producer_name, ctx.request.body.region_id, ctx.request.body.description,
          ctx.request.body.types.split(','), ctx.request.body.steps.split(','), image_link);
        ctx.response.body = 200;
      } else {
        ctx.response.body = 406;
      }
    } else {
      ctx.redirect('/login');
    }
  })
  .post('/update_manufacture', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      const producer_id = await producerService.getProducerIdByUserId(await userService.getUserIdByEmailAndPassword(data.username, data.password));
      if (producer_id !== -1) {
        await producerService.updateProducer(producer_id, ctx.request.body.producer_name, ctx.request.body.region_id, ctx.request.body.description, ctx.request.body.types, ctx.request.body.steps);
        ctx.response.body = 200;
      } else {
        ctx.response.body = 406;
      }
    } else {
      ctx.redirect('/login');
    }
  })
  .get('/producers', async ctx => {
    const types = await typeService.getAllTypes();
    const steps = await stepService.getAllSteps();
    const regions = await regionService.getAllRegions();
    await ctx.render('producers', { types, steps, regions });
  })
  .post('/producer_page/:page', async ctx => {
    const producers = await producerService.getProducersByStepsAndTypesAndRegion(ctx.request.body.types, ctx.request.body.steps, ctx.request.body.region_id);
    await ctx.render('producers_render', { producers });
  })
  .get('/create_order', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      const types = await typeService.getAllTypes();
      const steps = await stepService.getAllSteps();
      const regions = await regionService.getAllRegions();
      await ctx.render('create_order', { types, steps, regions });
    } else ctx.redirect('/login');
  })
  .post('/create_order', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      let image_link = await s3.uploadFile(ctx.request.files.image.path);
      fs.unlinkSync(ctx.request.files.image.path);
      await orderService.orderService(db).createOrder(data, ctx.request.body.name, ctx.request.body.region_id, ctx.request.body.small_description,
        ctx.request.body.description, ctx.request.body.types.split(','), ctx.request.body.steps.split(','), image_link);
      ctx.response.status = 200;
    } else ctx.redirect('/login');
  })
  .get('/orders', async ctx => {
    const types = await typeService.getAllTypes();
    const steps = await stepService.getAllSteps();
    const regions = await regionService.getAllRegions();
    await ctx.render('orders', { types, steps, regions });
  })
  .post('/order_page/:page', async ctx => {
    const orders = await orderService.orderService(db)
      .getOrdersByStepsAndTypesAndRegion(ctx.request.body.types, ctx.request.body.steps, ctx.request.body.region_id);
    await ctx.render('order_render', { orders });
  })
  .get('/orders_history', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      const user_id = await userService.getUserIdByEmailAndPassword(data.username, data.password);
      const available_orders = await orderService.orderService(db).getOrderByUserIdAndAvailable(user_id, true);
      const unavailable_orders = await orderService.orderService(db).getOrderByUserIdAndAvailable(user_id, false);
      await ctx.render('orders_history', { available_orders, unavailable_orders });
    } else ctx.redirect('/login');
  })
  .post('/disable_order/:id', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      const user_id = await userService.getUserIdByEmailAndPassword(data.username, data.password);
      await orderService.orderService(db).disableOrderByOrderIdAndUserId(ctx.request.params.id, user_id);
      ctx.redirect('/orders_history');
    } else ctx.redirect('/login');
  })
  .get('/forgot_password', async ctx => {
    await ctx.render('forgot_password');
  })
  .post('/forgot_password', async ctx => {
    const user = await userService.getUserByEmail(ctx.request.body.username);
    if (user !== undefined) {
      await userService.forgotPassword(user.email);
      ctx.response.body = 200;
    } else ctx.response.body = 406;
  });

exports.routes = router.routes();

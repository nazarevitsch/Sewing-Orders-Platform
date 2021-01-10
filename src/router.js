'use strict';

require('dotenv').config();
const Router = require('koa-router');
const workWithToken = require('./auth/Authorization.js');
const regionService = require('./service/RegionService.js');
const producerService = require('./service/ProducerService.js');
const typeService = require('./service/TypeService.js');
const stepService = require('./service/StepService.js');
const producerStepsService = require('./service/ProducersStepsService.js');
const producerTypesService = require('./service/ProducersTypesService.js');
const orderService = require('./service/OrderService.js');
const userService = require('./service/UserService.js');

const router = new Router();

router
  .get(['/', '/index'], async ctx => {
    await ctx.render('index');
  })
  .get('/login', async ctx => {
    await ctx.render('login');
  })
  .post('/login', async ctx => {
    const token = await workWithToken.login(ctx.request.body.username, ctx.request.body.password);
    ctx.response.status = token !== undefined ? 200 : 406;
    ctx.response.body = { token: token };
  })
  .get('/registration', async ctx => {
    await ctx.render('registration');
  })
  .post('/registration', async ctx => {
    const answer = await workWithToken.registration(ctx.request.body.username, ctx.request.body.password);
    ctx.response.status = answer.status;
    ctx.response.body = { token: answer.token, message: answer.message};
  })
  .post('/change_password', async ctx => {
    const answer = await workWithToken.changePassword(ctx.cookies.get('token'), ctx.request.body.old_password, ctx.request.body.new_password);
    ctx.response.status = answer.status;
    ctx.response.body = { token: answer.token, message: answer.message};
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
    if (ctx.request.user !== undefined) {
      const answer = await userService.updatePhoneAndNameOfUser(ctx.request.user.username, ctx.request.user.password, ctx.request.body.name, ctx.request.body.phone_number);
      ctx.status = answer.status;
      ctx.response.body = {message: answer.message};
    } else {
      ctx.status = 401;
      ctx.response.body = {message: 'You are unauthorized.'};
    }
  })
  .post('/manage_producer', async ctx => {
    if (ctx.request.user !== undefined) {
      let answer = await producerService.manageProducer(ctx.request.user.username, ctx.request.body.producer_name, ctx.request.body.region_id,
        ctx.request.body.description, ctx.request.body.types.split(','), ctx.request.body.steps.split(','), ctx.request.files.image.path);
      ctx.status = answer.status;
      ctx.response.body = {message: answer.message};
    } else {
      ctx.status = 401;
      ctx.response.body = {message: 'You are unauthorized.'};
    }
  })
  .get('/producers', async ctx => {
    await ctx.render('producers', { types: await typeService.getAllTypes(), steps: await stepService.getAllSteps(), regions: await regionService.getAllRegions() });
  })
  .post('/producer_page/:page', async ctx => {
    await ctx.render('producers_render', { producers: await producerService.getProducersByStepsAndTypesAndRegion(ctx.request.body.types, ctx.request.body.steps, ctx.request.body.region_id) });
  })
  .get('/create_order', async ctx => {
    if (ctx.request.user !== undefined) {
      await ctx.render('create_order', { types: await typeService.getAllTypes(), steps: await stepService.getAllSteps(), regions: await regionService.getAllRegions()});
    } else ctx.redirect('/login');
  })
  .post('/create_order', async ctx => {
    if (ctx.request.user !== undefined) {
      let answer = await orderService.createOrder(ctx.request.user, ctx.request.body.name, ctx.request.body.region_id, ctx.request.body.small_description,
        ctx.request.body.description, ctx.request.body.types.split(','), ctx.request.body.steps.split(','), ctx.request.files.image.path);
      ctx.status = answer.status;
      ctx.response.body = { message: answer.message };
    } else {
      ctx.status = 401;
      ctx.response.body = { message: 'You are unauthorized.' };
    }
  })
  .get('/orders', async ctx => {
    await ctx.render('orders', { types: await typeService.getAllTypes(), steps: await stepService.getAllSteps(), regions: await regionService.getAllRegions() });
  })
  .post('/order_page/:page', async ctx => {
    await ctx.render('order_render', { orders: await orderService.getOrdersByStepsAndTypesAndRegion(ctx.request.body.types, ctx.request.body.steps, ctx.request.body.region_id) });
  })


  .get('/orders_history', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      const user_id = await userService.getUserIdByEmailAndPassword(data.username, data.password);
      const available_orders = await orderService.getOrderByUserIdAndAvailable(user_id, true);
      const unavailable_orders = await orderService.getOrderByUserIdAndAvailable(user_id, false);
      await ctx.render('orders_history', { available_orders, unavailable_orders });
    } else ctx.redirect('/login');
  })
  .post('/disable_order/:id', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    if (data !== undefined) {
      const user_id = await userService.getUserIdByEmailAndPassword(data.username, data.password);
      await orderService.disableOrderByOrderIdAndUserId(ctx.request.params.id, user_id);
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
  })
  .get('/observe_order/:id', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    const order = await orderService.getOrderRegionNameAndPhoneNumberByID(ctx.request.params.id);
    await ctx.render('observe_order', {showNumber: data !== undefined, order: order});
  })
  .get('/observe_producer/:id', async ctx => {
    const data = await workWithToken.verifyToken(ctx.cookies.get('token'));
    const producer = await producerService.getProducerRegionNamePhoneNumberById(ctx.request.params.id);
    await ctx.render('observe_producer', { showNumber: data !== undefined, producer: producer });
  });

exports.routes = router.routes();

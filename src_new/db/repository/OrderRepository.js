'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = void 0;
var client = require('../Connection.js');
var orderRepository = function () {
    return {
        createOrder: function (user_id, name, region_id, small_description, description, random_key, image_link) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, client
                        .query(insertOrder(user_id, name, region_id, small_description, description, random_key, image_link))
                        .then(function (result) { return result; })];
            });
        }); },
        getOrderByAll: function (user_id, name, region_id, small_description, description, random_key) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, client
                        .query(selectOrderByAll(user_id, name, region_id, small_description, description, random_key))
                        .then(function (result) { return result; })];
            });
        }); },
        getOrderByUserIdAndAvailable: function (user_id, available) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, client
                        .query(selectOrderByUserIdAndAvailable(user_id, available))
                        .then(function (result) { return result; })];
            });
        }); },
        disableOrderByOrderId: function (order_id, user_id) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, client
                        .query(disOrderByOrderId(order_id, user_id))
                        .then(function (result) { return result; })];
            });
        }); },
        getOrdersByStepsAndTypesAndRegion: function (steps, types, region_id) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, client
                        .query(selectOrdersByStepsAndTypesAndRegion(steps, types, region_id))
                        .then(function (result) { return result; })];
            });
        }); },
        deleteOrder: function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, client
                        .query(dropOrderByUserId(user_id))
                        .then(function (result) { return result; })];
            });
        }); }
    };
};
exports.orderRepository = orderRepository;
var dropOrderByUserId = function (user_id) { return "delete from orders where user_id = " + user_id; };
var selectOrdersByStepsAndTypesAndRegion = function (steps, types, region_id) {
    var answer = '';
    if (Number(region_id) === 1) {
        answer = "select t4.id as id, t4.name as name, region_id ,small_description, t4.image_link as image_link, region_name from\n  (select * from\n  (select distinct t2.id, t2.name, t2.region_id, t2.small_description, t2.image_link, count(t2.id) over (partition by t2.id) as types_amount from\n  (select * from\n  (select distinct o.id, name, region_id, o.small_description, image_link, count(o.id) over (partition by o.id) as steps_amount from\n  (select * from orders where available = true) o\n  join orders_manufacturing_steps oms on o.id = oms.order_id";
    }
    else {
        answer = "select t4.id as id, t4.name as name, region_id ,small_description, t4.image_link as image_link, region_name from\n  (select * from\n  (select distinct t2.id, t2.name, t2.region_id, t2.small_description, t2.image_link, count(t2.id) over (partition by t2.id) as types_amount from\n  (select * from\n  (select distinct o.id, name, region_id, o.small_description, image_link, count(o.id) over (partition by o.id) as steps_amount from\n  (select * from orders where available = true and region_id = " + region_id + ") o\n  join orders_manufacturing_steps oms on o.id = oms.order_id";
    }
    if (steps !== undefined) {
        answer += ' where (';
        for (var i = 0; i < steps.length; i++) {
            if (i === 0) {
                answer += "oms.manufacturing_step_id = " + steps[i] + " ";
            }
            else {
                answer += "or oms.manufacturing_step_id = " + steps[i] + " ";
            }
        }
        answer += ")) t\nwhere steps_amount = " + steps.length + ") t2\n    join orders_sewing_types ost on t2.id = ost.order_id";
    }
    else {
        answer += ") t\n    ) t2\n    join orders_sewing_types ost on t2.id = ost.order_id";
    }
    if (types !== undefined) {
        answer += ' where (';
        for (var i = 0; i < types.length; i++) {
            if (i === 0) {
                answer += "ost.sewing_type_id = " + types[i] + " ";
            }
            else {
                answer += "or ost.sewing_type_id = " + types[i] + " ";
            }
        }
        answer += ")) t3\nwhere types_amount = " + types.length + ") t4\njoin regions r on r.id = t4.region_id";
    }
    else {
        answer += ") t3 ) t4\n    join regions r on r.id = t4.region_id";
    }
    return answer;
};
var disOrderByOrderId = function (order_id, user_id) { return "update orders set available = false where id = " + order_id + " and user_id = " + user_id; };
var selectOrderByUserIdAndAvailable = function (user_id, available) { return "select id, name, to_char(date_creation, 'DD Mon YYYY') as date from orders \nwhere user_id = " + user_id + " and available = " + available; };
var selectOrderByAll = function (user_id, name, region_id, small_description, description, random_key) {
    return "select * from orders where user_id = " + user_id + " and name = '" + name + "' and region_id = " + region_id + " and \nsmall_description = '" + small_description + "' and description = '" + description + "' and available = true \nand random_key = '" + random_key + "'";
};
var insertOrder = function (user_id, name, region_id, small_description, description, random_key, image_link) {
    return "insert into orders(user_id, name, region_id, available, small_description, description, date_creation, random_key, image_link) \nVALUES(" + user_id + ", '" + name + "', " + region_id + ", true, '" + small_description + "', '" + description + "', current_date, '" + random_key + "', '" + image_link + "')";
};
//# sourceMappingURL=OrderRepository.ts.map

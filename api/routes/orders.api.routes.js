import express from 'express';

// <----------------------Controllers------------------------>
import * as ordersApiController from '../controllers/orders.api.controller.js'

// <----------------------Middleware------------------------>
import { isAdmin, isLogued } from "../middleware/auth.middleware.js";

const route = express.Router()

route.route('/api/orders')
    .post([isLogued], ordersApiController.create);

route.route('/api/user/:id/orders')
    .get([isLogued], ordersApiController.getUserOrders)

route.route('/api/order/:id/details')
    .get([isLogued], ordersApiController.getUserOrderDetails);

route.route('/api/orders/:id/cancel')
    .put([isLogued], ordersApiController.cancelOrder);

route.route('/api/orders/:id/reactivate')
    .put([isLogued], ordersApiController.reactivateOrder);    

export default route;
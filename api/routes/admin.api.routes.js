import express from "express";

import * as adminApiController from '../controllers/admin.api.controller.js';

// <----------------------Middleware------------------------>
import { isAdmin, isLogued } from "../middleware/auth.middleware.js";

const route = express.Router();

route.route('/api/admin')
    .get([isLogued, isAdmin], adminApiController.getStats);

route.route('/api/admin/user/:id/orders')
    .get([isLogued, isAdmin], adminApiController.getUserOrders);

route.route('/api/admin/order/:id/details')
    .get([isLogued, isAdmin], adminApiController.getUserOrderDetails)

export default route;
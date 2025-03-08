import express from 'express'
import * as userApiController from "../controllers/users.api.controller.js";

// <----------------------Middleware------------------------>
import { validateUserLogin } from '../middleware/auth.middleware.js';
import { validateUser } from '../middleware/user.validate.middleware.js';
import { isAdmin, isLogued } from '../middleware/auth.middleware.js';

const route = express.Router();

route.route('/api/users')
    .get([isLogued, isAdmin] ,userApiController.getUsers)
    .post([validateUser], userApiController.create)

route.route('/api/users/iniciar-sesion')
    .post([validateUserLogin], userApiController.logIn)

route.route('/api/users/:id')
    .get([isLogued] ,userApiController.getById)

export default route;
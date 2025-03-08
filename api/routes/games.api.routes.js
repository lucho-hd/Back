import express from 'express';

// No me toma los valores del body por algún motivo ---- VER
import { validateGame }      from '../middleware/game.validate.middleware.js';

// <----------------------Controllers------------------------>
import * as gamesApiController from '../controllers/games.api.controller.js';

// <----------------------Middleware------------------------>
import { isAdmin, isLogued } from "../middleware/auth.middleware.js";

// <----------------------Validations------------------------>

const route = express.Router();

route.route('api/uploads/games')
    .post(gamesApiController.uploadGameImage);

route.route('/api/games')
    .get(gamesApiController.getGames)
    .post([isLogued, isAdmin], gamesApiController.uploadGameImage, gamesApiController.create)

route.route('/api/games/:id')
    .get(gamesApiController.viewGameDetails)
    .put([isLogued, isAdmin], gamesApiController.update)
    .delete([isLogued, isAdmin], gamesApiController.deleteOne);

route.route('/api/games/:id/related')
    .get(gamesApiController.getRelatedGames);

export default route;
import express from 'express';

import * as genresApiController from '../controllers/genres.api.controller.js';

const route = express.Router();

route.route('/api/genres')
    .get(genresApiController.getGenres);

route.route('/api/genres/:id')
    .get(genresApiController.viewGenreDetails);

export default route;
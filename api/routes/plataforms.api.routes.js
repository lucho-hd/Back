import express from 'express';

import * as plataformsApiController from '../controllers/plataforms.api.controller.js';

const route = express.Router();

route.route('/api/plataforms')
    .get(plataformsApiController.getPlataforms);

route.route('/api/plataforms/:id')
    .get(plataformsApiController.viewPlataformDetails);

export default route;
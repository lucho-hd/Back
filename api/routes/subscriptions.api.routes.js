import express from 'express';

// <----------------------Controllers------------------------>
import * as subscriptionsApiController from '../controllers/subscriptions.api.controller.js';

// <----------------------Middleware------------------------>
import { isAdmin, isLogued } from '../middleware/auth.middleware.js';

// <----------------------Validations------------------------>
import { validateSubscription } from '../middleware/subscription.validate.middleware.js';

const route = express.Router();

route.route('/api/subscriptions')
    .get(subscriptionsApiController.getSubscriptions)
    .post([isLogued, isAdmin, validateSubscription], subscriptionsApiController.create)

route.route('/api/subscriptions/:id')
    .get(subscriptionsApiController.getSubscriptionById)
    .put([isLogued, isAdmin, validateSubscription], subscriptionsApiController.update)
    .delete([isLogued, isAdmin], subscriptionsApiController.deleteOne)

export default route;
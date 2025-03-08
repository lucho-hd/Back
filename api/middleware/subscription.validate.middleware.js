import { subscriptionScheme } from "../schemes/subscription.scheme.js";

/**
 * Valida los datos ingresados a la hora de crear | editar una suscripción
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validateSubscription(req, res, next) {
    subscriptionScheme.validate(req.body, { abortEarly: false })
        .then((data) => {
            req.body = data;
            next()
        })
        .catch(error => {
            res.status(400).json({ error: error.errors })
        })
}

export {
    validateSubscription
}
import { gameScheme } from "../schemes/game.scheme.js";

/**
 * Valida los datos ingresados a la hora de crear | editar un juego
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validateGame(req, res, next) {

    console.log('Datos recibidos para validación:', req.body);

    gameScheme.validate(req.body, { abortEarly: false })
        .then((data) => {
            req.body = data;
            next()
        })
        .catch(error => {
            res.status(400).json({errors: error.errors })
        })
}

export {
    validateGame
}
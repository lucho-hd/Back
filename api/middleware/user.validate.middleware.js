import { userScheme }  from "../schemes/user.scheme.js";
/**
 * Valida los datos ingresados a la hora de crear | editar un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validateUser(req, res, next) {
    userScheme.validate(req.body, { abortEarly: false})
        .then((data) => {
            req.body = data;
            next()
        })
        .catch(error => {
            res.status(400).json({ error: error.errors })
        })
}

export {
    validateUser
}
// <----------------------JWT------------------------>
import Jwt  from 'jsonwebtoken'

// <----------------------Servicios------------------------>
import * as tokenServices from "../services/token.services.js";

import { userLoginScheme } from '../schemes/user.scheme.js';

function isLogued(req, res, next) {
    const token = req.headers['auth-token']

    if(!token) {
        return res.status(401).json({ message: "No se envió el token" })
    }

    try {
        const payload = Jwt.verify(token, process.env.TOKEN_SECRET)

        tokenServices.getByToken(token)
            .then(function(token) {
                if (!token) {
                    return res.status(401).json({ message: "El token no es válido" })
                }
                req.user = payload
                next()
            })
            .catch(function(error) {
                return res.status(401).json( {message: "El token ingresado no es válido"} )
            })
    }
    catch(error) {
        return res.status(401).json({ message: "Token inválido" })
    }
}

function isAdmin(req, res, next) {
    if(req.user?.role !== 'admin') {
        return res.status(403).json({ message: "No tienes permisos para realizar esta acción" })
    }
    next()
}

function validateUserLogin(req, res, next) {
    userLoginScheme.validate(req.body, {abortEarly: false})
        .then(function(data) {
            req.body = data;
            next()
        })
        .catch(function(error) {
            res.status(400).json({ errors: error.errors })
        })
}

export {
    isLogued,
    isAdmin,
    validateUserLogin,
}
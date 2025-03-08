// <----------------------Servicios------------------------>
import * as usersService  from "../services/user.services.js"
import * as tokenServices from "../services/token.services.js" 

import Jwt from 'jsonwebtoken'

/**
 * Trae la lista de usuarios 
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getUsers(req, res) {
    usersService.getUsers()
        .then(function(users) {
            res.status(200).json(users)
        })
}

/**
 * Trae los datos de un usuario mediante su id
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getById(req, res) {
    const id = req.params.id

    usersService.getUserById(id)
        .then(function(user) {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: "Usuario no encontrado." })
            }
        })
}

/**
 * Crea un nuevo usuario
 * 
 * @param {*} req 
 * @param {*} res 
 */
function create(req, res) {
    usersService.createUser(req.body)
        .then(function(newUser) {
            res.status(201).json(newUser)
        })
        .catch(function(error) {
            res.status(400).json({ message: error.message })
        })
}

/**
 * Inicia la sesión de un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 */
function logIn(req, res) {
    const user = {
        email: req.body.email,
        password: req.body.password,
    }

    usersService.logIn(user)
        .then(function(user) {
            const token = Jwt.sign({_id: user._id, role: user.role}, process.env.TOKEN_SECRET)

            tokenServices.create({token: token, user_id: user._id})
                .then(function() {
                    res.status(200).json({ token, user })
                })
                .catch(function(error) {
                    res.status(500).json({ message: error.message })
                })
        }).catch(function(error) {
            res.status(401).json({ message: error.message })
        })
}

/**
 * Cierra la sesión de un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 */
function logOut(req, res) {
    const token = req.headers['auth-token']

    tokenServices.deleteToken(token)
        .then(function() {
            res.status(200).json({ message: "Sesión cerrada exitomente!" })
        })
}

export {
    getUsers,
    getById,
    create,
    logIn,
    logOut,
}
// <---------------------- Servicios ----------------------->
import * as plataformsService from '../services/plataforms.services.js';

/**
 * Trae todas las plataformas de la base de datos y las muestra en la api.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getPlataforms(req, res) {
    plataformsService.getPlataforms()
        .then(plataforms => {
            res.json(plataforms);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
}

/**
 * Trae el detalle de una plataforma mediante su id.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function viewPlataformDetails(req, res) {
    const id = req.params.id;

    plataformsService.viewPlataformDetails(id)
        .then(plataform => {
            if (plataform) {
                res.status(200).json(plataform);
            } else {
                res.status(404).json({ message: 'No se encontró la plataforma' });
            }
        })
}

export {
    getPlataforms,
    viewPlataformDetails,
}
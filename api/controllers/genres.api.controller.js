// <---------------------- Servicios ----------------------->
import * as genresService from '../services/genres.services.js';

/**
 * Trae todos los géneros de la base de datos y los muestra en la api.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getGenres(req, res) {
    genresService.getGenres()
        .then(genres => {
            res.json(genres);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
}

/**
 * Trae el detalle de un género mediante su id.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function viewGenreDetails(req, res) {
    const id = req.params.id;

    genresService.viewGenreDetails(id)
        .then(genre => {
            if (genre) {
                res.status(200).json(genre);
            } else {
                res.status(404).json({ message: 'No se encontró el género' });
            }
        })
}

export {
    getGenres,
    viewGenreDetails,
}
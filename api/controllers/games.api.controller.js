// <--------------------> Servicios <-------------------->
import * as gamesService from '../services/games.services.js';

// <--------------------> JWT <-------------------->
import jwt from 'jsonwebtoken';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Trae todos los juegos de la base de datos y los muestra en la api.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns response
 */
function getGames(req, res) {
    const filter = {}

    gamesService.getGames(filter)
        .then(function(games) {
            if (games) {
                res.status(200).json(games);
            } else {
                res.status(404).json({ message: 'No se encontraron juegos' });
            }
        })
}

/**
 * Trae los detalles de un juego mediante su id
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns response
 */
function viewGameDetails(req, res) {
    const id = req.params.id;

    gamesService.viewGameDetails(id)
        .then(function(game) {
            if (game) {
                res.status(200).json(game);
            } else {
                res.status(404).json({ message: 'No se encontró el juego' });
            }
        })
}

/**
 * Trae todos los juegos salvo el actual
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getRelatedGames(req, res) {
    const id = req.params.id;

    gamesService.getRelatedGames(id)
        .then(function(games) {
            if (games) {
                res.status(200).json(games);
            } else {
                res.status(404).json({ message: 'No se encontraron juegos relacionados' });
            }
        })
}

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'uploads', 'games'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

const uploadGameImage = upload.single('cover');

/**
 * Crea un nuevo juego en la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function create(req, res) {
    const gameData = {
        ...req.body,
        cover: req.file ? `https://back-production-4d76.up.railway.app/uploads/games/${req.file.filename}` : null,
    };
    if (!gameData.created_at || !gameData.updated_at) {
        gameData.created_at = new Date();
        gameData.updated_at = new Date();
    }
    gamesService.saveGame(gameData)
        .then(newGame => res.status(201).json(newGame))
        .catch(error => {
            console.error("Error al guardar el juego:", error);
            res.status(500).json({ message: 'Error al guardar el juego' });
        });
}


/**
 * Edita un juego en la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function update(req, res) {
    upload.single('cover')(req, res, async function(err) {
        if (err) {
            return res.status(400).json({ message: 'Error al subir la imagen: ' + err.message });
        }

        const id = req.params.id;

        console.log("Datos del formulario:", req.body);
        console.log("Archivo subido:", req.file);

        const existingGame = await gamesService.viewGameDetails(id);
        if (!existingGame) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        if (req.file && existingGame.cover) {
            const oldImagePath = path.resolve('uploads', 'games', path.basename(existingGame.cover));

            fs.unlink(oldImagePath, (error) => {
                if (error) {
                    console.log("Error al eliminar la imagen anterior: ", error);
                } else {
                    console.log("Imagen anterior eliminada exitosamente! ", oldImagePath);
                }
            });
        }

        const updatedGameData = {
            ...req.body,
            cover: req.file ? `http://localhost:3000/uploads/games/${req.file.filename}` : existingGame.cover,
        };

        gamesService.updateGame(id, updatedGameData)
            .then(updatedGame => res.status(200).json(updatedGame))
            .catch(error => {
                console.error("Error al actualizar el juego:", error);
                res.status(500).json({ message: 'Error al actualizar el juego' });
            });
    });
}

/**
 * Elimina un juego mediante su id desde la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function deleteOne(req, res) {
    const id = req.params.id;

    try {
        const existingGame = await gamesService.viewGameDetails(id);
        if (!existingGame) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        if (existingGame.cover) {
            const imageName = existingGame.cover.split('/').pop();
            const imagePath = path.resolve('uploads', 'games', imageName);
        
            fs.unlink(imagePath, (error) => {
                if (error) {
                    console.error("Error al eliminar la imagen:", error);
                } else {
                    console.log("Imagen eliminada con éxito:", imagePath);
                }
            });
        }

        await gamesService.deleteGame(id);
        res.status(200).json({ message: 'Juego eliminado exitosamente!' });

    } catch (error) {
        console.error("Error al intentar eliminar el juego:", error);
        res.status(500).json({ message: 'Error al intentar eliminar el juego' });
    }
}

export {
    uploadGameImage,
    getGames,
    viewGameDetails,
    getRelatedGames,
    create,
    update,
    deleteOne,
}

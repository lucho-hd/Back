
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

dotenv.config();

const client = new MongoClient(process.env.DB_CONNECTION)
const db = client.db('caruso_luciano_final_ah');
const games = db.collection('Games');

/**
 * 
 * Trae todos los juegos de la base de datos.
 * 
 * params {*} filter
 * @returns 
 */
async function getGames(filter) {
    return client.connect()
        .then(() => {
            return games.find(filter).toArray()
        })
}

/**
 * 
 * Trae el detalle de un juego mediante su id.
 * 
 * @param {*} id 
 * @returns game
 */
async function viewGameDetails(id) {
    const game = await games.findOne({_id: new ObjectId(id)})

    return game
}
/**
 * Trae todos los juegos desde la base de datos exceptuando en el que se encuentra actualmente
 * 
 * @param {*} currentGameId - El id del juego en el que se encuentra actualmente el usuario
 * @returns 
 */
async function getRelatedGames(currentGameId) {
    try {
        const relatedGames = await games
            .find({ _id: { $ne: new ObjectId(currentGameId) } })
            .toArray();

        return relatedGames;
    } catch (error) {
        console.error("Error al obtener juegos relacionados:", error);
        return [];
    }
}

/**
 * Guarda los datos del nuevo juego en la base de datos
 * 
 * @param {*} data - Los datos del juego a crear 
 * @returns 
 */
async function saveGame(data) {
    try {
        const { title, price, release_date, description, company, cover_description, genres, plataforms, cover, created_at, updated_at } = data;

        const newGame = {
            title,
            price,
            release_date,
            description,
            company,
            cover_description,
            genres,
            plataforms,
            cover,
            created_at: new Date(created_at).toISOString().split('T')[0],  
            updated_at: new Date(updated_at).toISOString().split('T')[0],
        };

        const result = await games.insertOne(newGame);
        return result;
    } catch (error) {
        throw new Error('Error al guardar el juego: ' + error.message);
    }
}

/**
 * Actualiza los datos de un juego en la base de datos
 * 
 * @param {*} id - El id del juego a actualizar
 * @param {*} data - Los datos del juego a actualizar
 * @returns 
 */
async function updateGame(id, data) {
    try {
        const { title, price, release_date, description, company, cover_description, genres, plataforms, cover } = data;
        const newGame = {
            title,
            price,
            release_date,
            description,
            company,
            cover_description,
            genres,
            plataforms,
            cover,
            updated_at: new Date()
        };

        const q = await games.updateOne({ _id: new ObjectId(id) }, { $set: newGame });

        console.log("Juego actualizado exitosamente!")
        return q
    } catch(error) {
        throw new Error('Error al actualizar el juego: ' + error.message);
    }
} 

/**
 * Elimina un juego de la base de datos
 * 
 * @param {*} id - El id del juego a eliminar
 * @returns 
 */
async function deleteGame(id) {
    try {
        const q = await games.deleteOne({_id: new ObjectId(id)})

        console.log("Juego eliminado exitosamente!")
        return q
    } catch(error) {
        console.error("Error al eliminar el juego: ", error)
        return null;
    }
}

export {
    getGames,
    viewGameDetails,
    getRelatedGames,
    saveGame,
    updateGame,
    deleteGame
}

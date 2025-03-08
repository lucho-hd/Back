
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.DB_CONNECTION)
const db = client.db('caruso_luciano_final_ah');
const genres = db.collection('Genres');

/**
 * Trae todos los géneros desde la base de datos
 * 
 * @returns 
 */
async function getGenres() {
    return client.connect()
        .then(() => {
            return genres.find().toArray()
        })
}

export {
    getGenres,
}
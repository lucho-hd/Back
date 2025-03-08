
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.DB_CONNECTION)
const db = client.db('caruso_luciano_final_ah');
const plataforms = db.collection('Plataforms');

/**
 * Trae todas las plataformas desde la base de datos
 * 
 * @returns 
 */
async function getPlataforms() {
    return client.connect()
        .then(() => {
            return plataforms.find().toArray()
        })
}

export {
    getPlataforms,
}
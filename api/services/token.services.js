import { MongoClient } from "mongodb";

const client  = new MongoClient(process.env.DB_CONNECTION)
const db      = client.db('caruso_luciano_final_ah');
const tokens  = db.collection('Tokens'); 

/**
 * Crea un nuevo token en la base de datos
 * 
 * @param {*} tokenData 
 * @returns 
 */
async function create(tokenData) {
    const newToken = {
        ...tokenData,
    };

    await tokens.insertOne(newToken);

    return newToken;
}

/**
 * Trae un token desde la base de datos
 * 
 * @param {*} token - El token de JWT
 * @returns 
 */
async function getByToken(token) {
    return await tokens.findOne({ token })
}

/**
 * Elimina un token de la base de datos
 * 
 * @param {*} token - El token de JWT
 */
async function deleteToken(token) {
    await tokens.deleteOne({ token });
}

export {
    create,
    getByToken,
    deleteToken,
}

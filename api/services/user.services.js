import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const client  = new MongoClient(process.env.DB_CONNECTION)
const db      = client.db('caruso_luciano_final_ah');
const users   = db.collection('Users'); 

/**
 * Crea un nuevo usuario en la base de datos
 * 
 * @param {*} userData - Los datos del usuario a crear
 * @returns 
 */
async function createUser(userData) {
    const newUser = {
        ...userData,
    }

    if (await users.findOne({ email: newUser.email })) {
        throw new Error('El email ingresado ya esta en uso');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newUser.password, salt);
    const role = 'user';

    newUser.password = passwordHash;
    newUser.role = role;

    await users.insertOne(newUser);

    return newUser;
}

/**
 * Trae la lista de usuarios desde la base de datos
 * 
 * @returns 
 */
async function getUsers() {
    return await users.find().toArray();
}

/**
 * Trae un usuario desde la base de datos
 * 
 * @param {*} id 
 * @returns 
 */
async function getUserById(id) {
    return await users.findOne({_id: new ObjectId(id)})
}

/**
 * Inicia la sesión del usuario
 * 
 * @param {*} userData - Los datos del usuario para iniciar sesión
 * @returns 
 */
async function logIn(userData) {
    const user = await users.findOne({ email: userData.email });

    if (!user) {
        throw new Error('El email ingresado no esta registrado');
    }

    const validPassword = await bcrypt.compare(userData.password, user.password);
    
    if (!validPassword) {
        throw new Error('La contraseña ingresada es incorrecta');
    }

    return user;
}

export {
    createUser,
    getUsers,
    logIn,
    getUserById,
}

import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.DB_CONNECTION)
const db = client.db('caruso_luciano_final_ah');
const subscriptions = db.collection('Subscriptions');

/**
 * Trae todas las suscripciones de la base de datos.
 * 
 * @returns 
 */
async function getSubscriptions() {
    return client.connect()
        .then(() => {
            return subscriptions.find().toArray()
        })
}

/**
 * Trae los datos de una suscripción mediante su id
 * 
 * @param {*} id - El id de la suscripción
 * @returns 
 */
async function getSubscriptionById(id) {
    const subscription = await subscriptions.findOne({ _id: new ObjectId(id) })

    return subscription
}

/**
 * Crea una suscripción en la base de datos
 * 
 * @param {*} data - Los datos de la suscripción
 */
async function saveSubscription(data) {
    try {
        const { name, price, benefits } = data;

        const newSubscription = {
            name,
            price,
            benefits,
        };

        const result = await subscriptions.insertOne(newSubscription);
        return result;
    } catch(error) {
        console.log("Error al guardar la suscripción: ", error)
        throw new Error("Error al guardar la suscripción")
    }
}

/**
 * Realiza la actualización de una suscripción en la base de datos
 * 
 * @param {*} id - El id de la suscripción
 * @param {*} data - Los datos de la suscripción
 * @returns 
 */
async function updateSubscription(id, data) {
    try {
        const { name, price, benefits } = data
        const newSubscription = {
            name,
            price,
            benefits,
        };

        const q = await subscriptions.updateOne({_id: new ObjectId(id ) }, {$set: newSubscription});

        console.log("Suscripción actualizada exitosamente!")
        return q

    } catch(error) {
        console.error("Error al actualizar la suscripción: ", error)
    }
}

/**
 * Elimina los datos de una suscripción de la base de datos
 * 
 * @param {*} id - El id de la suscripción 
 * @returns 
 */
async function deleteSubscription(id) {
    try {
        const q = await subscriptions.deleteOne({_id: new ObjectId(id)})

        console.log("Suscripción eliminada exitosamente!")
        return q
    } catch(error) {
        console.error("Error al eliminar la suscripción: ", error)
    }
}

export {
    getSubscriptions,
    getSubscriptionById,
    saveSubscription,
    updateSubscription,
    deleteSubscription,
}
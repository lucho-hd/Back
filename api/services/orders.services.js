
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.DB_CONNECTION)
const db     = client.db('caruso_luciano_final_ah');
const orders = db.collection('Orders'); 

/**
 * Devuelve los pedidos de un usuario en específico mediante su id
 * 
 * @param {*} userId - El id del usuario
 * @returns {Array} - Lista de pedidos realizados por el usuario
 */
async function getUserOrders(userId) {
    try {
        const userOrders = await orders.find(
            { user_id: userId },
            { projection: { _id: 1, total: 1, date_of_purchase: 1, product_name: 1, state: 1, updated_at: 1 } }
        )
        .sort({ date_of_purchase: -1 })
        .toArray();

        return userOrders
    } catch(error) {
        console.error("Error al obtener los pedidos del usuario", error)
        return [];
    }
}

/**
 * Obtiene los detalles de un pedido específico por su ID
 * 
 * @param {string} orderId - ID del pedido
 * @returns {Object|null} - Detalles del pedido o `null` si no se encuentra
 */
async function getUserOrdersDetails(orderId) {
    try {
        if (!ObjectId.isValid(orderId)) {
            console.error("ID de orden inválido:", orderId);
            return null;
        }

        const result = await orders.aggregate([ 
            {
                $match: { _id: new ObjectId(orderId) }
            },
            {
                $set: { userObjectId: { $toObjectId: "$user_id" } }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "userObjectId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    product_name: 1,
                    date_of_purchase: 1,
                    payment_method: 1,
                    total: 1,
                    state: 1,
                    "user.name": 1,
                    "user.surname": 1
                }
            }
        ]).toArray();

        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Error en getUserOrdersDetails:", error);
        return null;
    }
}

/**
 * Crea una nueva orden en la base de datos
 * 
 * @param {*} data - Los datos de la orden 
 */
async function saveOrder(data) {
    try {
        const { product_name, date_of_purchase, payment_method, total, state, user_id } = data;

        if (!product_name || !date_of_purchase || !payment_method || !total || !state || !user_id) {
            console.error("Faltan datos:", {
                product_name,
                date_of_purchase,
                payment_method,
                total,
                state,
                user_id
            });
            throw new Error("Faltan datos requeridos para crear la orden.");
        }

        const result = await orders.insertOne(data);

        return result;
    } catch (error) {
        console.error('Error al guardar la orden:', error.message);
        throw error;
    }
}

/**
 * Cancela el pedido del usuario
 * 
 * @param {*} orderId - El id del pedido
 * @returns 
 */
async function cancelOrder(orderId) {
    try {
        const order = await orders.findOne({ _id: new ObjectId(orderId) });

        if (!order) {
            throw new Error("Orden no encontrada");
        }

        const result = await orders.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { state: "Cancelado", updated_at: new Date().toISOString().split('T')[0] } }
        );

        return result;
    } catch (error) {
        console.error("Error al cancelar la orden:", error);
        throw new Error("No se pudo cancelar la orden");
    }
}

/**
 * Permite reactivar una orden cancelada
 * 
 * @param {*} orderId - El id de la orden
 */
async function reactivateOrder(orderId) {
    try {
        const order = await orders.findOne({ _id: new ObjectId(orderId) });

        if (!order) {
            throw new Error("No se ha encontrado la orden solicitada");
        }

        const result = await orders.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { state: "Activo", updated_at: new Date().toISOString().split('T')[0] } }
        )
        return result;
    } catch(error) {
        console.log("Ocurrio un error al intentar reactivar la orden", error)
        throw new Error("No se puedo reactivar la orden");
    }
}

export {
    getUserOrders,
    getUserOrdersDetails,
    saveOrder,
    cancelOrder,
    reactivateOrder,
}
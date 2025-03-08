
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const client       = new MongoClient(process.env.DB_CONNECTION)
const db           = client.db('caruso_luciano_final_ah');

const game         = db.collection('Games') 
const genre        = db.collection('Genres') 
const plataform    = db.collection('Plataforms') 
const subscription = db.collection('Subscriptions')
const user         = db.collection('Users')  
const order        = db.collection('Orders') 

/**
 * Obtiene datos relevantes de los juegos, géneros, ordenes y plataformas de la base de datos
 * 
 * @returns 
 */
async function getStats() {
    try {
        const gameCount = await game.countDocuments();
        const genreCount = await genre.countDocuments();
        const plataformCount = await plataform.countDocuments();
        const subscriptionCount = await subscription.countDocuments();
        const userCount = await user.countDocuments();
        const orderCount = await order.countDocuments();

        const lastGame = await game.find({}, { projection: { title: 1 } }).sort({ created_at: -1 }).limit(1).toArray();
        const lastGenre = await genre.find({}, { projection: { name: 1 } }).sort({ created_at: -1 }).limit(1).toArray();
        const lastPlataform = await plataform.find({}, { projection: { name: 1 } }).sort({ created_at: -1 }).limit(1).toArray();
        
        const lastOrders = await order.find({}, { projection: { _id: 1, date_of_purchase: 1, total: 1, state: 1, product_name: 1 } })
            .sort({ date_of_purchase: -1 })
            .limit(5)
            .toArray();

        const totalRaised = await order.aggregate([
            { $match: { state: "Aprobado" } }, 
            { $project: { total: { $toDouble: "$total" } } }, 
            { $group: { _id: null, total: { $sum: "$total" } } } 
        ]).toArray();

        const totalAmount = totalRaised.length > 0 ? totalRaised[0].total : 0;

        const bestSellingProduct = await order.aggregate([
            { $match: { state: "Aprobado" } }, 
            { $unwind: { path: "$product_name", preserveNullAndEmptyArrays: false } }, 
            { $group: { 
                _id: "$product_name", 
                totalSold: { $sum: 1 } 
            }},
            { $sort: { totalSold: -1 } }, 
            { $limit: 1 } 
        ]).toArray();

        const mostSoldProduct = bestSellingProduct.length > 0 ? bestSellingProduct[0]._id : null;

        return  {
            gameCount, 
            genreCount, 
            plataformCount, 
            subscriptionCount,
            userCount,
            orderCount,
            totalAmount,
            lastGame: lastGame[0] ? lastGame[0].title : null,
            lastGenre: lastGenre[0] ? lastGenre[0].name : null,
            lastPlataform: lastPlataform[0] ? lastPlataform[0].name : null,
            lastOrders,
            mostSoldProduct,
        };
    } catch(error) {
        console.log("Error al obtener las estadíticas", error)
    }
}

/**
 * Obtiene los pedidos de un usuario en específico por su ID
 * 
 * @param {*} userId - ID del usuario
 * @returns {Array} - Lista de pedidos del usuario
 */
async function getUserOrders(userId) {
    try {
        const userOrders = await order.find(
            { user_id: userId, state: "Aprobado" },
            { projection: { _id: 1, total: 1, date_of_purchase: 1 } }
        )
        .sort({ date_of_purchase: -1 })
        .toArray();
        
        return userOrders;
    } catch(error) {
        console.error("Error al obtener los pedidos del usuario", error);
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

        const result = await order.aggregate([ 
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

export {
    getStats,
    getUserOrders,
    getUserOrdersDetails
}
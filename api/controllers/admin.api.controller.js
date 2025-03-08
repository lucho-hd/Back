// <--------------------> Servicios <-------------------->
import * as adminService from '../services/admin.services.js';

/**
 * Trae datos relevantes para mostrar en el panel de administración
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getStats(req, res) {
    adminService.getStats()
        .then(function(data) {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json({message: 'No se encontraron las estadísticas'});
            }
        })
}

/**
 * Trae los pedidos asociados a un usuario 
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getUserOrders(req, res) {
    const userId = req.params.id

    adminService.getUserOrders(userId)
        .then(function(orders) {
            if (orders) {
                res.status(200).json(orders);
            } else {
                res.status(404).json({ message: 'No se encontraron pedidos asociados a este usuario' });
            }
        })
}

/**
 * Trae el detalle de un pedido
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getUserOrderDetails(req, res) {
    const orderId = req.params.id;

    adminService.getUserOrdersDetails(orderId)
        .then(function(order) {
            if (order) {
                res.status(200).json(order);
            } else {
                res.status(404).json({ message: 'No se encontró el detalle del pedido' });
            }
        })
        .catch((error) => {
            console.error("Error al obtener los detalles del pedido:", error);
            res.status(500).json({ message: 'Error interno del servidor' });
        });
}

export {
    getStats,
    getUserOrders,
    getUserOrderDetails,
}
import * as orderServices from "../services/orders.services.js"

/**
 * Trae los pedidos asociados a un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getUserOrders(req, res) {
    const userId = req.params.id;

    orderServices.getUserOrders(userId)
        .then(function(orders) {
            if (orders) {
                res.status(200).json(orders);
            } else {
                res.status(404).json({ message: "No se encontraron pedidos asociados a este usuario" });
            }
        })
}

/**
 * Trae los datos de la orden mediante su id desde la base de datos y los muestra en la api
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getUserOrderDetails(req, res) {
    const id = req.params.id;

    orderServices.getUserOrdersDetails(id)
        .then(function(order) {
            if (order) {
                res.status(200).json(order);
            } else {
                res.status(404).json({ message: "No se encontró los datos de la orden solicitada" })
            }
        })
}

/**
 * Crea una nueva orden en la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function create(req, res) {
    console.log(req.body)
    const orderData = {
        ...req.body,
    };

    orderServices.saveOrder(orderData)
        .then(newOrder => res.status(201).json(newOrder))
        .catch(error => {
            console.error("Error al guardar la orden: ", error);
            res.status(500).json({ message: "Error al guardar la orden en la base de datos: ", error })
        });
}

/**
 * Permite cancelar una orden al usuario
 * 
 * @param {*} req 
 * @param {*} res 
 */
function cancelOrder(req, res) {
    const id = req.params.id;

    orderServices.cancelOrder(id)
        .then(function(order) {
            if (order) {
                res.status(200).json({ message: "¡Orden cancelada exitosamente!" });
            } else {
                res.status(404).json({ message: "No se pudo cancelar la orden solicitada" })
            }
        })
}

function reactivateOrder(req, res) {
    const id = req.params.id;

    orderServices.reactivateOrder(id)
        .then(function(order) {
            if (order) {
                res.status(200).json({ message: "¡Orden reactivada exitosamente!" })
            } else {
                res.status(404).json({ message: "No se pudo reactivar la orden solicitada" })
            }
        })
}

export {
    getUserOrders,
    getUserOrderDetails,
    create,
    cancelOrder,
    reactivateOrder,
}
// <--------------------> Servicios <-------------------->
import * as subscriptionsService from '../services/subscriptions.services.js';

/**
 * Trae todas las suscripciones de la base de datos y las muestra en la api.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getSubscriptions(req, res) {
    subscriptionsService.getSubscriptions()
        .then(subscriptions => {
            res.status(200).json(subscriptions);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}

/**
 * Trae los datos de una suscripción
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getSubscriptionById(req, res) {
    const id = req.params.id;

    subscriptionsService.getSubscriptionById(id)
        .then(function(subscription) {
            if (subscription) {
                res.status(200).json(subscription)
            } else {
                res.status(404).json({ message: 'No se ha encontrado la suscripción' });
            }
        })
}

/**
 * Crea una nueva suscripción en la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function create(req, res) {
    console.log("Datos recibidos: ", req.body)
    const subscriptionData = {
        ...req.body
    };

    subscriptionsService.saveSubscription(subscriptionData)
        .then(newSubscription => res.status(201).json(newSubscription))
        .catch(error => {
            console.error("Error al guardar la suscripción:", error);
            res.status(500).json({ message: 'Error al guardar la suscripción' });
        });
}

/**
 * Hace la actualización de una suscripción
 * 
 * @param {*} req 
 * @param {*} res 
 */
function update(req, res) {
    console.log("Datos recibidos: ", req.body)

    const id = req.params.id;
    
    const subscriptionData = {
        ...req.body
    };

    subscriptionsService.updateSubscription(id, subscriptionData)
        .then(updatedSubscription => res.status(200).json(updatedSubscription))
        .catch(error => {
            console.error("Error al actualizar la suscripción: ", error);
            res.status(500).json({ message: 'Error al actualizar la suscripción'})
        });
}

/**
 * Elimina los datos de una suscripción
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function deleteOne(req, res) {
    const id = req.params.id;

    try {
        const exist = await subscriptionsService.getSubscriptionById(id)
        if (!exist) {
            return res.status(404).json({ message: "La suscripción no fue encontrada" })
        }

        await subscriptionsService.deleteSubscription(id);
        res.status(200).json({ message: "La suscripción fue eliminada exitosamente!" })
    } catch(error) {
        console.error("Error al eliminar la suscripción: ", error)
        res.status(500).json({ message: "Error al intentar eliminar la suscripción" });
    }

}


export {
    getSubscriptions,
    getSubscriptionById,
    create,
    update,
    deleteOne
}
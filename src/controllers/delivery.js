const deliveryService = require('../services/delivery');


const getDeliveriesByUserId = async (userId, status) => {
    return await deliveryService.getDeliveriesByUserId(userId, status);
};

const createDelivery = async (data) => {
    return await deliveryService.createDelivery(data);
};

module.exports = {
    getDeliveriesByUserId,
    createDelivery
};

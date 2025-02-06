const deliveryFormService = require('../services/deliveryFrom');

const createDeliveryForm = async (requestBody) => {
    return await deliveryFormService.createDeliveryForm(requestBody);
}

const getDeliveryForm = async (formId) => {
    return await deliveryFormService.getDeliveryForm(formId);
}

const updateDeliveryData = async (formId, recipient) => {
    return await deliveryFormService.updateDeliveryData(formId, recipient);
}

module.exports = {
    createDeliveryForm,
    getDeliveryForm,
    updateDeliveryData,
};
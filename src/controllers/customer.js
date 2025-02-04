const customerService = require('../services/customer');

const getCustomer = async (data) => {
    return await customerService.getCustomer(data);
};

module.exports = {
    getCustomer,
};

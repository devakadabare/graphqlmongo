const customerService = require('./src/services/customer/customer');

module.exports.createCustomer = async (event) => await customerService.createCustomer(event.arguments);

const customerService = require('./src/services/customer/customer');
const otpController = require('./src/controllers/otp');

module.exports.createCustomer = async (event) => await customerService.createCustomer(event.arguments);
module.exports.getCustomer = async (event) => await customerService.getCustomer(event.arguments.customerId);

module.exports.sendOtp = async (event) => await otpController.sendOtp(event.arguments);

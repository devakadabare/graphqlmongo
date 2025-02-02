const customerController = require('./src/controllers/customer')
const otpController = require('./src/controllers/otp');

module.exports.createCustomer = async (event) => await customerController.createCustomer(event.arguments);
module.exports.getCustomer = async (event) => await customerController.getCustomer(event.arguments.customerId);
module.exports.sendOtp = async (event) => await otpController.sendOtp(event.arguments);

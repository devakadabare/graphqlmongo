const customerController = require('./src/controllers/customer')
const registrationController = require('./src/controllers/registration');
const otpController = require('./src/controllers/otp');

module.exports.registerCustomer = async (event) => await registrationController.registerCustomer(event.arguments.input);
module.exports.getCustomer = async (event) => await customerController.getCustomer(event.arguments.customerId);
module.exports.sendOtp = async (event) => await otpController.sendOtp(event.arguments.input);

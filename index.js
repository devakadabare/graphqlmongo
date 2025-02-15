const customerController = require('./src/controllers/customer')
const registrationController = require('./src/controllers/registration');
const otpController = require('./src/controllers/otp');
const locationController = require('./src/controllers/location');
const masterDataController = require('./src/controllers/masterData');
const deliveryFormController = require('./src/controllers/deliveryForm');

module.exports.sendOtp = async (event) => await otpController.sendOtp(event.arguments.input);

module.exports.registerCustomer = async (event) => await registrationController.registerCustomer(event.arguments.input);
module.exports.getCustomer = async (event) => await customerController.getCustomer(event.arguments.customerId);

module.exports.createLocation = async (event) => await locationController.createLocation(event.arguments.input);
module.exports.getLocationByUser = async (event) => await locationController.getLocationByUser(event.arguments.userId);
module.exports.getLocation = async (event) => await locationController.getLocation(event.arguments.locationId);

module.exports.getItemTypes = async () => await masterDataController.getItemTypes();

module.exports.createDeliveryForm = async (event) => await deliveryFormController.createDeliveryForm(event.arguments);
module.exports.getDeliveryForm = async (event) => await deliveryFormController.getDeliveryForm(event.arguments.formId);
module.exports.updateDeliveryData = async (event) => await deliveryFormController.updateDeliveryData(event.arguments.formId, event.arguments.recipient);


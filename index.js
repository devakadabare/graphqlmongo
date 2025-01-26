const userService = require('./src/services/user/user');

module.exports.createUser = async (event) => await userService.createUser(event);

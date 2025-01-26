const userService = require('./src/service/user');

module.exports.createUser = async (event) => await userService.createUser(event);

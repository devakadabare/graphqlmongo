const { createUser } = require('./src/service/user');

module.exports.createUser = async (event) => await createUser(event);

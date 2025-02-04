const connectToDatabase = require('../database/database');
const Role = require('../models/role');

const getRoleByName = async (roleName) => {
    try {
        await connectToDatabase();
        const role = await Role.findOne
        ({
            name: roleName
        });

        console.log('Role:', role);
        return role;
    } catch (error) {
        console.error('Error fetching role:', error);
        throw new Error(error.message);
    }
}

module.exports = { getRoleByName };
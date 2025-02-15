const connectToDatabase = require('../database/database');
const User = require('../models/user');

const createUser = async (data) => {

    try {
        await connectToDatabase();

        const { countryCode, mobile, roles } = data;

        // Check if the User exists, if not create a new one
        let existingUser = await User.findOne({ countryCode, mobile });
        if (!existingUser) {
            existingUser = new User({
                countryCode,
                mobile,
                roles: roles || [],
            });
            await existingUser.save();
        }

        return existingUser;
        
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error(error.message);
    }
};

const getUser = async (userId) => {
    try {
        await connectToDatabase();

        const user = await User.findById(userId);
        return user;
    }
    catch (error) {
        console.error('Error fetching user:', error);
        throw new Error(error.message);
    }
}


module.exports = { createUser, getUser };
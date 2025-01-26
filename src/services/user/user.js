const { HTTP_STATUS } = require('../../constants/statusCodes');
const connectToDatabase = require('../../database/database');
const { errorResponse } = require('../../helper/response');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const createUser = async (event) => {
    try {
        await connectToDatabase();

        const requestBody = event.arguments;

        // Check if user already exists
        const existingUser = await User.findOne({ mobile: requestBody.mobile });
        if (existingUser) return errorResponse('user already exists', HTTP_STATUS.CONFLICT);

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(requestBody.password, salt);

        const newUser = new User({
            mobile: requestBody.mobile,
            password: hashedPassword,
            roles: requestBody.roles, // Assuming roles are passed as ObjectIds
        });

        const res = await newUser.save();

        return { _id: res._id, mobile: res.mobile, password: res.password };
    } catch (error) {
        console.error('Error creating user:', error);
        return errorResponse(error.message, HTTP_STATUS.BAD_REQUEST);
    }
};

module.exports = { createUser };

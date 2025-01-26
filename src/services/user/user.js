const connectToDatabase = require('../../database/database');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

export const createUser = async (event) => {
    console.log('====================================');
    console.log(event);
    console.log('====================================');
    try {
        await connectToDatabase();

        const requestBody = JSON.parse(event.body);

        // Check if user already exists
        const existingUser = await User.findOne({ email: requestBody.email });
        if (existingUser) return { statusCode: 400, body: JSON.stringify({ message: 'User already exists' }) };

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(requestBody.password, salt);

        const newUser = new User({
            mobileNumber: requestBody.mobileNumber,
            email: requestBody.email,
            name: requestBody.name,
            gender: requestBody.gender,
            passwordHash: hashedPassword,
            roles: requestBody.roles, // Assuming roles are passed as ObjectIds
        });

        await newUser.save();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully', userId: newUser._id }),
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error creating user', error: error.message }),
        };
    }
};

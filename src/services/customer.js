const connectToDatabase = require('../database/database');
const Customer = require('../models/customer');
const User = require('../models/user');

const createCustomer = async (requestBody) => {
    try {
        await connectToDatabase();

        // Check if the User exists, if not create a new one
        let existingUser = await User.findOne({ mobile: requestBody.mobile });
        if (!existingUser) {
            existingUser = new User({
                mobile: requestBody.mobile,
                roles: requestBody.roles || [],
            });
            await existingUser.save();
        }

        // Check if the Customer for this User already exists
        const existingCustomer = await Customer.findOne({ user: existingUser._id });
        if (existingCustomer) throw new Error('Customer already exists for this User');

        // Create a new Customer
        const newCustomer = new Customer({
            name: requestBody.name,
            email: requestBody.email,
            gender: requestBody.gender,
            user: existingUser._id, // Save the ID of the User
        });

        const savedCustomer = await newCustomer.save();

        // Fetch the customer with populated data
        return await getCustomer(savedCustomer._id);
    } catch (error) {
        console.error('Error creating customer:', error);
        throw new Error(error.message); // This will propagate to GraphQL
    }
};

const getCustomer = async (customerId) => {
    try {
        await connectToDatabase();

        // Find the customer by ID and populate the user field to include user details
        const customer = await Customer.findById(customerId).populate('user');

        return customer;
    } catch (error) {
        console.error('Error fetching customer:', error);
        throw new Error(error.message);
    }
};

module.exports = { createCustomer, getCustomer };

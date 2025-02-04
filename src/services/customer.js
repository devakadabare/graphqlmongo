const connectToDatabase = require('../database/database');
const Customer = require('../models/customer');
const User = require('../models/user');

const createCustomer = async (requestBody) => {
    try {
        await connectToDatabase();

        const { name, email, gender, existingUser } = requestBody;

        // Check if the Customer for this User already exists
        const existingCustomer = await Customer.findOne({ user: existingUser._id });
        if (existingCustomer) throw new Error('Customer already exists for this User');

        // Create a new Customer
        const newCustomer = new Customer({
            name,
            email,
            gender,
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
        const customer = await Customer.findById(customerId)
            .populate({
                path: 'user',
                populate: {
                    path: 'roles', // Populate the roles inside user
                    model: 'Role'
                }
            });

        return customer;
    } catch (error) {
        console.error('Error fetching customer:', error);
        throw new Error(error.message);
    }
};

module.exports = { createCustomer, getCustomer };

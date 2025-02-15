const connectToDatabase = require('../database/database');
const Location = require('../models/locations');

const { getUser } = require('./user');

const createLocation = async (requestBody) => {
    try {
        await connectToDatabase();

        const { name, address, long, lat, details, note, contactName, contactNo, type, userId } = requestBody;

        const user = await getUser(userId);
        if (!user) throw new Error('User not found');

        // Check if the Location for this User already exists
        const existingLocation = await Location.findOne({ user: userId, name });
        if (existingLocation) throw new Error('Location Name already exists for this User');
        

        // Create a new Location
        const newLocation = new Location({
            name,
            address,
            long,
            lat,
            details,
            note,
            contactName,
            contactNo,
            type,
            user: userId, // Save the ID of the User
        });

        const savedLocation = await newLocation.save();

        // Fetch the location with populated data
        return await getLocation(savedLocation._id);
    } catch (error) {
        console.error('Error creating location:', error);
        throw new Error(error.message); // This will propagate to GraphQL
    }
};

const getLocationByUser = async (userId) => {
    try {
        await connectToDatabase();

         // Find the location by User ID
         const locations = await Location.find({ user: userId });

        return locations;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw new Error(error.message);
    }
};

const getLocation = async (locationId) => {
    try {
        await connectToDatabase();

        // Find the location by ID and populate the user field to include user details
        const location = await Location.findById(locationId)
            .populate('user');

        return location;
    }
    catch (error) {
        console.error('Error fetching location:', error);
        throw new Error(error.message);
    }
};


module.exports = { createLocation, getLocationByUser, getLocation };

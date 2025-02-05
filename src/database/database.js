const mongoose = require('mongoose');

let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        console.log('=> Using existing database connection');
        return Promise.resolve();
    }

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = connection.connections[0].readyState;
        console.log('=> Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Database connection failed');
    }
};

//disconnect from database
const disconnectFromDatabase = async () => {
    if (!isConnected) {
        console.log('=> Using existing database connection');
        return Promise.resolve();
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('=> Disconnected from MongoDB');
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
        throw new Error('Database disconnection failed');
    }
};

module.exports = connectToDatabase;

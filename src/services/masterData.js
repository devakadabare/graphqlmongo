const connectToDatabase = require('../database/database');
const ItemType = require('../models/itemType');

const getItemTypes = async () => {
    try {
        await connectToDatabase();
        //get active item types
        const itemTypes = await ItemType.find({ status: 'active' });
        return itemTypes;
    } catch (error) {
        console.error('Error fetching item types:', error);
        throw new Error(error.message);
    }
};

module.exports = { getItemTypes };
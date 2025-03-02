const connectToDatabase = require('../database/database');
const Delivery = require('../models/delivery');
const Driver = require('../models/driver');

const { getUser } = require('./user');
const mongoose = require('mongoose');

/**
 * Create a new delivery with validation
 * @param {Object} requestBody - Delivery details
 * @returns {Object} - Created Delivery
 */
const createDelivery = async (requestBody) => {
    try {
        await connectToDatabase();

        const {
            deliveryType,
            pickup,
            dropoff,
            itemType,
            sender,
            recipient,
            message,
        } = requestBody;

        // Validate required fields
        if (!sender || !mongoose.Types.ObjectId.isValid(sender)) {
            throw new Error('Invalid or missing sender (User ID)');
        }
        if (!deliveryType || !['VENDOR-CUSTOMER', 'CUSTOMER-CUSTOMER', 'CUSTOMER-GUEST'].includes(deliveryType)) {
            throw new Error('Invalid or missing deliveryType');
        }
        if (!pickup || !pickup.contactName || !pickup.contactNo || !pickup.address) {
            throw new Error('Pickup details (contactName, contactNo, address) are required');
        }
        if (!itemType || !mongoose.Types.ObjectId.isValid(itemType)) {
            throw new Error('Invalid or missing itemType');
        }

        if(sender){
            const user = await getUser(sender);
            if (!user) throw new Error('User not found');
        }

        if (recipient && !mongoose.Types.ObjectId.isValid(recipient)) {
            throw new Error('Invalid recipient (User ID)');
        }

        if(recipient){
            const user = await getUser(recipient);
            if (!user) throw new Error('Recipient not found');
        }

        // Create new Delivery
        const newDelivery = new Delivery({
            sender, // Mandatory
            recipient, // Optional
            //vendor: requestBody.vendor || null, // Optional
            driver: null, // Initially null until assigned
            deliveryType,
            pickup,
            dropoff: dropoff || {}, // Optional dropoff details
            itemType,
            message, // Optional message
            status: 'PENDING'
        });

        const savedDelivery = await newDelivery.save();

        return await getDelivery(savedDelivery._id);
    } catch (error) {
        console.error('Error creating delivery:', error);
        throw new Error(error.message);
    }
};

/**
 * Get a delivery by ID
 * @param {String} deliveryId
 * @returns {Object} - Delivery Details
 */
const getDelivery = async (deliveryId) => {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
            throw new Error('Invalid delivery ID');
        }

        const delivery = await Delivery.findById(deliveryId)
            .populate('sender')
            .populate('recipient',)
            //.populate('vendor', 'name')
            .populate('driver', 'user vehicleType isAvailable')
            .populate('itemType', 'name');

        if (!delivery) {
            throw new Error('Delivery not found');
        }

        return delivery;
    } catch (error) {
        console.error('Error fetching delivery:', error);
        throw new Error(error.message);
    }
};

/**
 * Assign a Driver to a Delivery with Validation
 * @param {String} deliveryId - ID of the delivery
 * @param {String} driverId - ID of the driver
 * @returns {Object} - Updated Delivery
 */
const assignDriver = async (deliveryId, driverId) => {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
            throw new Error('Invalid delivery ID');
        }
        if (!mongoose.Types.ObjectId.isValid(driverId)) {
            throw new Error('Invalid driver ID');
        }

        const driver = await Driver.findById(driverId);
        if (!driver) throw new Error('Driver not found');

        if (!driver.isAvailable) throw new Error('Driver is not available');

        const updatedDelivery = await Delivery.findByIdAndUpdate(
            deliveryId,
            { driver: driverId, status: 'ASSIGNED' },
            { new: true }
        ).populate('driver', 'user vehicleType isAvailable');

        if (!updatedDelivery) {
            throw new Error('Delivery not found or failed to update');
        }

        return updatedDelivery;
    } catch (error) {
        console.error('Error assigning driver:', error);
        throw new Error(error.message);
    }
};

/**
 * Update delivery status with validation
 * @param {String} deliveryId - ID of the delivery
 * @param {String} status - New status (PENDING, ASSIGNED, IN_TRANSIT, COMPLETED, CANCELLED)
 * @returns {Object} - Updated Delivery
 */
const updateDeliveryStatus = async (deliveryId, status) => {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
            throw new Error('Invalid delivery ID');
        }
        if (!['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'].includes(status)) {
            throw new Error('Invalid status');
        }

        const updatedDelivery = await Delivery.findByIdAndUpdate(
            deliveryId,
            { status, completedAt: status === 'COMPLETED' ? new Date() : null },
            { new: true }
        ).populate('driver', 'user vehicleType');

        if (!updatedDelivery) {
            throw new Error('Delivery not found or failed to update');
        }

        return updatedDelivery;
    } catch (error) {
        console.error('Error updating delivery status:', error);
        throw new Error(error.message);
    }
};

/**
 * Delete a delivery with validation
 * @param {String} deliveryId - ID of the delivery
 * @returns {Object} - Deleted Delivery
 */
const deleteDelivery = async (deliveryId) => {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
            throw new Error('Invalid delivery ID');
        }

        const deletedDelivery = await Delivery.findByIdAndDelete(deliveryId);

        if (!deletedDelivery) {
            throw new Error('Delivery not found or already deleted');
        }

        return deletedDelivery;
    } catch (error) {
        console.error('Error deleting delivery:', error);
        throw new Error(error.message);
    }
};

/**
 * Get deliveries created by a specific user (customer or vendor)
 * @param {String} userId - ID of the user
 * @returns {Array} - List of deliveries created by the user
 */
const getDeliveriesByUserId = async (userId, status = null) => {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }

        // Build the query to find deliveries where the user is involved
        let query = {
            $or: [
                { sender: userId },
                { recipient: userId }
            ]
        };

        // Apply status filter if provided
        if (status) {
            if (!['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'].includes(status)) {
                throw new Error('Invalid status');
            }
            query.status = status;
        }

        // Find deliveries matching the user and (optional) status
        const deliveries = await Delivery.find(query)
            .populate('sender')
            .populate('recipient')
            .populate('driver', 'user vehicleType isAvailable')
            .populate('itemType', 'name')
            .sort({ createdAt: -1 }); // Sort by newest first

        return deliveries;
    } catch (error) {
        console.error('Error fetching deliveries by user ID:', error);
        throw new Error(error.message);
    }
};



module.exports = {
    createDelivery,
    getDelivery,
    assignDriver,
    updateDeliveryStatus,
    deleteDelivery,
    getDeliveriesByUserId
};

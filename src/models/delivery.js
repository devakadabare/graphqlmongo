const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
    {
        // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who initiated the delivery
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender (if applicable)
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Recipient (if applicable)
        //vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: false }, // Vendor (if applicable)
        driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: false }, // Assigned driver
        deliveryType: {
            type: String,
            enum: ['VENDOR-CUSTOMER', 'CUSTOMER-CUSTOMER', 'CUSTOMER-GUEST'],
            required: true
        },

        pickup: {
            contactName: { type: String, required: true },
            contactNo: { type: String, required: true },
            address: { type: String, required: true },
            unitNo: { type: String, required: false },
            note: { type: String, required: false },
            savedLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: false }
        },

        dropoff: {
            contactName: { type: String, required: false },
            contactNo: { type: String, required: false },
            address: { type: String, required: false },
            unitNo: { type: String, required: false },
            note: { type: String, required: false },
            savedLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: false }
        },

        itemType: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemType', required: true },
        message: { type: String, required: false }, // Optional message for recipient
        
        status: {
            type: String,
            enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'],
            default: 'PENDING'
        },
        estimatedDeliveryTime: { type: Date, required: false },
        completedAt: { type: Date, required: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);

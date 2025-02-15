const mongoose = require('mongoose');

const deliveryFormSchema = new mongoose.Schema(
    {
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },

        pickup: {
            contactName: { type: String, required: true },
            contactNo: { type: String, required: true },
            address: { type: String, required: true },
            unitNo: { type: String, required: false },
            note: { type: String, required: false },
            savedLocation: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Location', 
                required: false 
            } // Optional: If user selects from saved locations
            
        },

        recipient: {
            contactName: { type: String, required: false },
            contactNo: { type: String, required: false },
            address: { type: String, required: false },
            unitNo: { type: String, required: false },
            note: { type: String, required: false },
            savedLocation: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Location', 
                required: false 
            }, // Optional: If user selects from saved locations
            customer: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Customer', 
                required: false 
            } // Optional: If recipient is a registered customer
        },

        itemType: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'ItemType', 
            required: true 
        },

        message: { type: String, required: false }, // Optional message for the recipient

    },
    { timestamps: true }
);

module.exports = mongoose.model('DeliveryForm', deliveryFormSchema);

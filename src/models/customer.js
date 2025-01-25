const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Customer', customerSchema);

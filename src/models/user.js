const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        countryCode: { type: String, required: true }, // e.g., "+1", "+94"
        mobile: { type: String, required: true }, 
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role', // Reference to roles collection
            },
        ],
    },
    { timestamps: true } 
);

// Ensure uniqueness of the combination of countryCode and mobile
userSchema.index({ countryCode: 1, mobile: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        mobileNumber: { type: String, required: true, unique: true }, // monile and country code
        passwordHash: { type: String, required: true },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role', // Reference to roles collection
            },
        ],
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('User', userSchema);

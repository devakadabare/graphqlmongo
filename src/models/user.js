const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        mobile: { type: String, required: true, unique: true }, 
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role', // Reference to roles collection
            },
        ],
    },
    { timestamps: true } 
);

module.exports = mongoose.model('User', userSchema);

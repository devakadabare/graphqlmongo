const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        gender: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);

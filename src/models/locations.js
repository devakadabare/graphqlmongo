const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        long: { type: String, required: true },
        lat: { type: String, required: true },
        details: { type: String, required: false },
        note: { type: String, required: false },
        contactName: { type: String, required: false },
        contactNo: { type: String, required: false },
        type: { type: String, required: true, enum: ['HOME', 'WORK', 'OTHER'], default: 'OTHER' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Location', locationSchema);
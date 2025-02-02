const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        mobile: { type: String, required: true, unique: true },
        otp: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Otp', otpSchema);

const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Relates to the user model
        vehicleType: { type: String, required: true, enum: ['BIKE', 'CAR', 'VAN', 'TRUCK'] },
        licenseNumber: { type: String, required: true, unique: true },
        isAvailable: { type: Boolean, default: true }, // Indicates if the driver is available
        location: {
            lat: { type: Number, required: false },
            long: { type: Number, required: false }
        }
    },
    { timestamps: true }
);

// Ensure a user can be only one driver record
driverSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Driver', driverSchema);

const connectToDatabase = require('../database/database');
const Otp = require('../models/otp');

const OTP_EXPIRY_MINUTES = 2;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

const verifyOtp = async (otpId, countryCode, mobile) => {
    try {
        await connectToDatabase();

        // Find the OTP by ID, countryCode, and mobile number
        const otpRecord = await Otp.findOne({ _id: otpId, countryCode, mobile });

        if (!otpRecord) {
            return false; // OTP not found or mobile number mismatch
        }

        // Calculate expiry time
        const expiryTime = new Date(otpRecord.createdAt);
        expiryTime.setMinutes(expiryTime.getMinutes() + OTP_EXPIRY_MINUTES);

        if (new Date() > expiryTime) {
            return false; // OTP expired
        }

        return true; // OTP is valid
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return false;
    }
};

module.exports = { generateOtp, verifyOtp };

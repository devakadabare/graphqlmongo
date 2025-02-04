const connectToDatabase = require('../database/database');
const Otp = require('../models/otp');

const OTP_EXPIRY_MINUTES = 100;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

const verifyOtp = async (otpId, countryCode, mobile, otp) => {
    try {
        await connectToDatabase();
        // Find the OTP by ID, countryCode, and mobile number
        const otpRecord = await Otp.findOne({ _id: otpId, countryCode, mobile });

        if (!otpRecord) {
            return false; // OTP not found or mobile number mismatch
        }

        if (otpRecord.otp !== otp) {
            return false; // OTP mismatch
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

const sendOtp = async (data) => {
    try {

        console.log('Sending OTP:', data);
        const { countryCode, mobile } = data;

        await connectToDatabase();

        const generatedOtp = generateOtp();

        const newOtp = new Otp({
            countryCode,
            mobile,
            otp: generatedOtp,
        });

        const createdOtp = await newOtp.save();

        return { otpId: createdOtp.id };
    } catch (error) {
        console.error('Error creating OTP:', error);
        throw new Error(error.message);
    }
};


module.exports = { generateOtp, verifyOtp, sendOtp };

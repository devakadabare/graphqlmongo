const connectToDatabase = require('../database/database');
const Otp = require('../models/otp');
const { generateOtp } = require('../util/auth-util');

const sendOtp = async (data) => {
    try {
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

module.exports = { sendOtp };

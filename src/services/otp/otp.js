const connectToDatabase = require('../../database/database');
const Otp = require('../../models/otp');

const sendOtp = async (data) => {
    try {
        const { mobile } = data;

        await connectToDatabase();

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

        const newOtp = new Otp({
            mobile,
            otp: generatedOtp,
        });

        const createdOtp = await newOtp.save();

        return { otpId: createdOtp.id };
    } catch (error) {
        console.error('Error creating otp:', error);
        throw new Error(error.message);
    }
};

module.exports = { sendOtp };

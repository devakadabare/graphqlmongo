const otpService = require('../services/otp/otp');

const sendOtp = async (data) => {
    return await otpService.sendOtp(data);
};

module.exports = { sendOtp };

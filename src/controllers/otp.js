const otpUtil = require('../util/auth-util');

const sendOtp = async (data) => {
    return await otpUtil.sendOtp(data);
};

module.exports = { sendOtp };

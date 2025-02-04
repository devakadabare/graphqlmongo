const customerService = require('../services/customer');
const { verifyOtp } = require('../util/auth-util');

const registerCustomer = async (data) => {
    const { otpId, ...rest } = data;

    const isOtpVerified = await verifyOtp(otpId, rest.mobile);

    if (isOtpVerified) {
        return await customerService.registerCustomer(rest);
    } else {
        console.error('OTP verification failed!');
        return null;
    }
};

const getCustomer = async (data) => {
    return await customerService.getCustomer(data);
};

module.exports = {
    registerCustomer,
    getCustomer,
};

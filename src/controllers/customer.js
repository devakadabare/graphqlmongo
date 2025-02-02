const customerService = require('../services/customer');
const { verifyOtp } = require('../util/auth-util');

const createCustomer = async (data) => {
    const { otpId, ...rest } = data;

    const isOtpVerified = await verifyOtp(otpId, rest.mobile);

    console.log('====================================');
    console.log(isOtpVerified);
    console.log('====================================');

    if (isOtpVerified) {
        return await customerService.createCustomer(rest);
    } else {
        console.error('OTP verification failed!');
        return null;
    }
};

const getCustomer = async (data) => {
    return await customerService.getCustomer(data);
};

module.exports = {
    createCustomer,
    getCustomer,
};

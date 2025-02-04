const { createCustomer, getCustomer} = require('../services/customer');
const { createUser } = require('../services/user');
const { getRoleByName } = require('../services/roles');
const { verifyOtp } = require('../util/auth-util');


const registerCustomer = async (data) => {
    const { otpId,otp, countryCode, mobile,  name, email, gender } = data;

    const isOtpVerified = await verifyOtp(otpId, countryCode, mobile, otp);

    if (isOtpVerified) {

        const roleDetails = await getRoleByName('customer');

        const user = await createUser({ countryCode, mobile, roles: [roleDetails._id], name, email, gender });

        const customer = await createCustomer({name, email, gender, existingUser: user});

        return getCustomer(customer._id);

    } else {
        console.error('OTP verification failed!');
        return null;
    }

};

module.exports = {
    registerCustomer,
}
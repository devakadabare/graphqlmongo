const locationService = require('../services/locations');

const createLocation = async (data) => {
    return await locationService.createLocation(data);
};

const getLocationByUser = async (userId) => {
    return await locationService.getLocationByUser(userId);
};

const getLocation = async (locationId) => {
    return await locationService.getLocation(locationId);
};


module.exports = {
    createLocation,
    getLocationByUser,
    getLocation
};
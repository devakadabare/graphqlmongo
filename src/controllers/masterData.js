const masterDataService = require('../services/masterData');

const getItemTypes = async () => {
    return await masterDataService.getItemTypes();
};

module.exports = {
    getItemTypes
};
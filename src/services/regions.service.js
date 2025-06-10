const regionsRepository = require("../repositories/regions.repository");

exports.getAllRegions = async () => {
    return await regionsRepository.findAll();
};
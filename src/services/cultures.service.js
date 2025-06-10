const culturesRepository = require("../repositories/cultures.repository");

exports.getAllCultures = async () => {
    return await culturesRepository.findAll();
};

exports.getAvailableYears = async () => {
    return await culturesRepository.findYears();
};
const regionsRepository = require("../repositories/regions.repository");
const { entityToModel } = require("../mapping/region.mapping");

exports.getAllRegions = async () => {
    const entities = await regionsRepository.findAll();
    return entities.map(entityToModel);
};

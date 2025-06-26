const geoRepository = require('../repositories/geo.repository');
const path = require('path');

exports.buildRegionStatsGeoJSON = async ({ year, cultureId }) => {
  const stats = await geoRepository.getStatsByRegion({ year, cultureId });

  const features = await Promise.all(
    stats.map(async (stat) => {
      try {
        const geometryPath = path.join(__dirname, '..', 'data', 'geo', `${stat.regionCode}.js`);
        const geometry = require(geometryPath);

        return {
          type: 'Feature',
          geometry,
          properties: {
            regionId: stat.regionId,
            regionName: stat.regionName,
            surfaceHa: stat.surfaceHa,
            yieldQxHa: stat.yieldQxHa,
            productionT: stat.productionT
          }
        };
      } catch (err) {
        console.warn(`❗ Géométrie manquante pour ${stat.regionCode}`);
        return null;
      }
    })
  );

  return {
    type: 'FeatureCollection',
    features: features.filter(Boolean)
  };
};

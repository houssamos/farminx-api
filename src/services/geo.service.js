const geoRepository = require('../repositories/geo.repository');
const { REGIONS_CONFIG } = require('../config/regions.config');

exports.buildRegionStatsGeoJSON = async ({ year, productId }) => {
  const stats = await geoRepository.getStatsByRegion({ year, productId });
  console.log('🎯 Stats régionales reçues :', stats);


  // Suppression des doublons par regionCode
  const seen = new Set();
  const uniqueStats = stats.filter(stat => {
    if (seen.has(stat.regionCode)) return false;
    seen.add(stat.regionCode);
    return true;
  });

  const features = uniqueStats
    .map((stat) => {
      const region = REGIONS_CONFIG[stat.regionCode];

      if (!region || !region.coordinates) {
        console.warn(`⚠️ Région inconnue ou sans géométrie : ${stat.regionCode}`);
        return null;
      }

      const geometry = {
        type: region.type,
        coordinates: region.coordinates
      };

      // On ignore les régions sans données utiles
      if (!stat.surfaceHa && !stat.productionT) return null;

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
    })
    .filter(Boolean); // Exclure les nulls

  return {
    type: 'FeatureCollection',
    features
  };
};
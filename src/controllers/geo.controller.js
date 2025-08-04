const geoService = require('../services/geo.service');

exports.getRegionStatsGeoJSON = async (req, res) => {
  const { year, cultureId } = req.query;
  try {
    const geojson = await geoService.buildRegionStatsGeoJSON({ year: parseInt(year), productId: cultureId });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(geojson);
  } catch (err) {
    console.error('Erreur GeoJSON:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la génération du GeoJSON' });
  }
};
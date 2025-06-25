const geoService = require('../services/geo.service');

exports.getRegionStatsGeoJSON = async (req, res) => {
  const { year, productId } = req.query;
  try {
    const geojson = await geoService.buildRegionStatsGeoJSON({ year: parseInt(year), productId: productId });
    res.setHeader('Content-Type', 'application/geo+json');
    res.status(200).json(geojson);
  } catch (err) {
    console.error('Erreur GeoJSON:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la génération du GeoJSON' });
  }
};
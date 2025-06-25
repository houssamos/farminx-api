const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const geoController = require('../controllers/geo.controller');

router.get("/regions/cultures/:culture/years/:year", statsController.getStatsByRegion);
router.get("/products/:id/summary", statsController.getProductSummary);
router.get("/", statsController.getAgriculturalStats);
router.get('/regions', geoController.getRegionStatsGeoJSON);


module.exports = router;
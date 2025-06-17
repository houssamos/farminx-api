const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");

router.get("/regions/cultures/:culture/years/:year", statsController.getStatsByRegion);
router.get("/products/:id/summary", statsController.getProductSummary);

module.exports = router;
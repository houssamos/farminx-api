const express = require("express");
const router = express.Router();
const regionsController = require("../controllers/regions.controller");

router.get("/", regionsController.getAllRegions);

module.exports = router;
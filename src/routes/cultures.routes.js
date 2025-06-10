const express = require("express");
const router = express.Router();
const culturesController = require("../controllers/cultures.controller");

router.get("/", culturesController.getAllCultures);
router.get("/years", culturesController.getAvailableYears);

module.exports = router;
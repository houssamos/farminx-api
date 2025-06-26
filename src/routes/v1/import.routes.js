const express = require("express");
const multer = require("multer");
const router = express.Router();
const importController = require("../../controllers/import.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), importController.importStatsFromExcel);

module.exports = router;
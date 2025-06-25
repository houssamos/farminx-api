const importService = require("../services/import.service");
const { messageToImportResultDto } = require('../mapping/import.mapping');

exports.importStatsFromExcel = async (req, res) => {
  try {
    await importService.importFromExcelBuffer(req.file.buffer);
    res.status(201).json(messageToImportResultDto("Données importées avec succès."));
  } catch (error) {
    console.error("Erreur d'import:", error);
    res.status(500).json({ error: "Échec de l'importation des données." });
  }
};

const ImportResultDto = require('../dtos/import-result.dto');

function messageToImportResultDto(message) {
  if (!message) return null;
  return new ImportResultDto({ message });
}

module.exports = {
  messageToImportResultDto,
};

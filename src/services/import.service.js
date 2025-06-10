const Excel = require('exceljs');
const regionRepo = require("../repositories/regions.repository");
const productRepo = require("../repositories/products.repository");
const statsRepo = require("../repositories/stats.repository");

exports.importFromExcelBuffer = async (buffer) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet('COP');

  const headerRow = worksheet.getRow(6);
  const headers = {};
  headerRow.eachCell((cell, colNumber) => {
    if (cell.value) headers[cell.value.toString().trim()] = colNumber;
  });

  const libRegCol = headers['LIB_REG2'] || 1;
  const libSaaCol = headers['LIB_SAA'] || headers['LIB_CODE'] || 2;

  for (let rowNumber = 7; rowNumber <= worksheet.lastRow.number; rowNumber++) {
    const row = worksheet.getRow(rowNumber);

    const libReg = row.getCell(libRegCol).value;
    const libSaa = row.getCell(libSaaCol).value;

    if (!libReg || !libSaa) continue;

    const cultureString = libSaa.toString().trim();
    const productParts = cultureString.split(' - ');
    const productName = productParts ? productParts[1].trim() : cultureString;
    const productCode = productParts ? productParts[0].trim() : "-1";

    const regionString = libReg.toString().trim();
    const regionParts = regionString.split(' - ');
    if (regionParts.length < 2 || regionString.includes("FRANCE")) continue;

    const regionCode = regionParts[0].trim();
    const regionName = regionParts[1].trim();

    const region = await regionRepo.upsertRegionByName(regionName, regionCode);
    const product = await productRepo.upsertProduct({ name: productName, category: "COP", unit: "quintal", code: productCode });

    for (let year = 2010; year <= 2024; year++) { //TODO: automatique year
      const surface = parseValue(row.getCell(headers[`SURF_${year}`]));
      const rendement = parseValue(row.getCell(headers[`REND_${year}`]));
      const production = parseValue(row.getCell(headers[`PROD_${year}`]));

      if (surface || rendement || production) {
        await statsRepo.upsertStat({
          regionId: region.id,
          productId: product.id,
          year,
          surface,
          rendement,
          production
        });
      }
    }
  }
};

function parseValue(cell) {
  if (!cell || cell.value == null) return null;
  if (typeof cell.value === 'number') return cell.value;
  if (typeof cell.value === 'string') {
    const clean = cell.value.replace(/\s/g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? null : val;
  }
  return null;
}
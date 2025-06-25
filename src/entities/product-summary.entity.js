class ProductSummaryEntity {
  constructor({ productId, name, totalSurface, avgYield, totalProduction, minYear, maxYear }) {
    this.productId = productId;
    this.name = name;
    this.totalSurface = totalSurface;
    this.avgYield = avgYield;
    this.totalProduction = totalProduction;
    this.minYear = minYear;
    this.maxYear = maxYear;
  }
}
module.exports = ProductSummaryEntity;

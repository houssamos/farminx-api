class CultureSummaryDto {
  constructor({ cultureId, name, totalSurface, avgYield, totalProduction, minYear, maxYear }) {
    this.cultureId = cultureId;
    this.name = name;
    this.totalSurface = totalSurface;
    this.avgYield = avgYield;
    this.totalProduction = totalProduction;
    this.minYear = minYear;
    this.maxYear = maxYear;
  }
}

module.exports = CultureSummaryDto;

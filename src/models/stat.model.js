class Stat {
  constructor({ id, year, surfaceHa, yieldQxHa, productionT, granularity, region, product }) {
    this.id = id;
    this.year = year;
    this.surfaceHa = surfaceHa;
    this.yieldQxHa = yieldQxHa;
    this.productionT = productionT;
    this.granularity = granularity;
    this.region = region;
    this.product = product;
  }
}
module.exports = Stat;

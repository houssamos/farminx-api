class StatEntity {
  constructor({
    id,
    year,
    region_id,
    department_id,
    product_id,
    surface_ha,
    yield_qx_ha,
    production_t,
    granularity,
    regions,
    departments,
    products,
  }) {
    this.id = id;
    this.year = year;
    this.region_id = region_id;
    this.department_id = department_id;
    this.product_id = product_id;
    this.surface_ha = surface_ha;
    this.yield_qx_ha = yield_qx_ha;
    this.production_t = production_t;
    this.granularity = granularity;
    this.regions = regions;
    this.departments = departments;
    this.products = products;
  }
}
module.exports = StatEntity;

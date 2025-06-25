const Stat = require('../models/stat.model');
const ProductSummary = require('../models/product-summary.model');
const Region = require('../models/region.model');
const Culture = require('../models/culture.model');
const StatDto = require('../dtos/stat.dto');
const ProductSummaryDto = require('../dtos/product-summary.dto');
const StatEntity = require('../entities/stat.entity');
const ProductSummaryEntity = require('../entities/product-summary.entity');

function statEntityToModel(entity) {
  if (!entity) return null;
  const region = entity.regions
    ? new Region({ id: entity.regions.id, code: entity.regions.code, name: entity.regions.name })
    : undefined;
  const product = entity.products
    ? new Culture({ id: entity.products.id, name: entity.products.name, code: entity.products.code })
    : undefined;
  return new Stat({
    id: entity.id,
    year: entity.year,
    surfaceHa: entity.surface_ha,
    yieldQxHa: entity.yield_qx_ha,
    productionT: entity.production_t,
    granularity: entity.granularity,
    region,
    product,
  });
}

function productSummaryEntityToModel(entity) {
  if (!entity) return null;
  return new ProductSummary({
    productId: entity.productId,
    name: entity.name,
    totalSurface: entity.totalSurface,
    avgYield: entity.avgYield,
    totalProduction: entity.totalProduction,
    minYear: entity.minYear,
    maxYear: entity.maxYear
  });
}

function statModelToDto(model) {
  if (!model) return null;
  return new StatDto({
    id: model.id,
    year: model.year,
    surfaceHa: model.surfaceHa,
    yieldQxHa: model.yieldQxHa,
    productionT: model.productionT,
    granularity: model.granularity,
    region: model.region,
    product: model.product,
  });
}

function productSummaryModelToDto(model) {
  if (!model) return null;
  return new ProductSummaryDto({
    productId: model.productId,
    name: model.name,
    totalSurface: model.totalSurface,
    avgYield: model.avgYield,
    totalProduction: model.totalProduction,
    minYear: model.minYear,
    maxYear: model.maxYear,
  });
}

module.exports = {
  statEntityToModel,
  productSummaryEntityToModel,
  statModelToDto,
  productSummaryModelToDto,
};


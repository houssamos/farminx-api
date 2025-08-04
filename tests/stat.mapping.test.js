const { statModelToDto } = require('../src/mapping/stat.mapping');
const { modelToDto: regionModelToDto } = require('../src/mapping/region.mapping');
const { modelToDto: cultureModelToDto } = require('../src/mapping/culture.mapping');
const Region = require('../src/models/region.model');
const Culture = require('../src/models/culture.model');
const Stat = require('../src/models/stat.model');

describe('statModelToDto', () => {
  test('converts region and product with mapping', () => {
    const region = new Region({ id: 1, code: 'R', name: 'Region' });
    const product = new Culture({ id: 2, name: 'Prod', code: 'P' });
    const stat = new Stat({
      id: 3,
      year: 2024,
      surfaceHa: 1,
      yieldQxHa: 2,
      productionT: 3,
      granularity: 'region',
      region,
      product
    });

    const dto = statModelToDto(stat);

    expect(dto.region).toEqual(regionModelToDto(region));
    expect(dto.product).toEqual(cultureModelToDto(product));
  });

  test('handles missing region and product', () => {
    const stat = new Stat({
      id: 1,
      year: 2024,
      surfaceHa: 0,
      yieldQxHa: 0,
      productionT: 0,
      granularity: 'region',
      region: null,
      product: null
    });

    const dto = statModelToDto(stat);

    expect(dto.region).toBeNull();
    expect(dto.product).toBeNull();
  });
});

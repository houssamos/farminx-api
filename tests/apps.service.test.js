const bcrypt = require('bcryptjs');

jest.mock('../src/repositories/apps.repository', () => ({
  findByName: jest.fn(),
}));
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'id'),
}));

const appsRepository = require('../src/repositories/apps.repository');
const appsService = require('../src/services/apps.service');

describe('apps.service.authenticate', () => {
  it('returns app when secret matches', async () => {
    const hash = await bcrypt.hash('secret', 10);
    const app = { id: 1, name: 'test', secret: hash };
    appsRepository.findByName.mockResolvedValue(app);

    const result = await appsService.authenticate('test', 'secret');

    expect(result).toEqual(app);
  });

  it('returns null when app not found', async () => {
    appsRepository.findByName.mockResolvedValue(null);

    const result = await appsService.authenticate('missing', 'secret');

    expect(result).toBeNull();
  });

  it('returns null on invalid password', async () => {
    const hash = await bcrypt.hash('secret', 10);
    const app = { id: 1, name: 'test', secret: hash };
    appsRepository.findByName.mockResolvedValue(app);

    const result = await appsService.authenticate('test', 'wrong');

    expect(result).toBeNull();
  });
});

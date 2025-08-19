const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

jest.mock('../src/services/users.service');
jest.mock('../src/controllers/apps.controller', () => ({
  loginApp: jest.fn(),
  registerApp: jest.fn(),
  registerAppApiKey: jest.fn(),
}));
jest.mock('../src/middlewares/auth-universal.middleware', () => jest.fn((req, res, next) => next()));
const usersService = require('../src/services/users.service');
const authRouter = require('../src/routes/v1/auth.routes');

let app;

beforeAll(() => {
  process.env.JWT_SECRET = 'testsecret';
  app = express();
  app.use(express.json());
  app.use('/v1/auth', authRouter);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /v1/auth/change-password', () => {
  test('successfully changes password', async () => {
    usersService.changePassword.mockResolvedValue(true);
    const token = jwt.sign({ id: 'u1' }, process.env.JWT_SECRET);
    const res = await request(app)
      .post('/v1/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: 'old', newPassword: 'newpass' });
    expect(res.status).toBe(204);
    expect(usersService.changePassword).toHaveBeenCalledWith('u1', 'old', 'newpass');
  });

  test('returns 400 when parameters missing', async () => {
    const token = jwt.sign({ id: 'u1' }, process.env.JWT_SECRET);
    const res = await request(app)
      .post('/v1/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: 'old' });
    expect(res.status).toBe(400);
  });

  test('returns 401 when old password is wrong', async () => {
    usersService.changePassword.mockResolvedValue(false);
    const token = jwt.sign({ id: 'u1' }, process.env.JWT_SECRET);
    const res = await request(app)
      .post('/v1/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: 'wrong', newPassword: 'newpass' });
    expect(res.status).toBe(401);
  });
});

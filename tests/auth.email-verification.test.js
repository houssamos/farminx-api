const request = require('supertest');
const express = require('express');
const path = require('path');

jest.mock('../src/services/users.service');
jest.mock('../src/controllers/apps.controller', () => ({
  loginApp: jest.fn(),
  registerApp: jest.fn(),
  registerAppApiKey: jest.fn(),
}));
jest.mock('../src/middlewares/auth-universal.middleware', () => jest.fn((req, res, next) => next()));
const usersService = require('../src/services/users.service');
const emailService = require('../src/services/email.service');
jest.spyOn(emailService, 'sendHtmlNotification').mockResolvedValue();
const authRouter = require('../src/routes/v1/auth.routes');

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/v1/auth', authRouter);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /v1/auth/register', () => {
  test('creates user and sends verification email', async () => {
    usersService.createUser.mockResolvedValue({
      user: { id: 'u1', email: 'a@a.com' },
      verificationToken: 'tok',
    });
    const res = await request(app)
      .post('/v1/auth/register')
      .send({ email: 'a@a.com', password: 'pass123' });
    expect(res.status).toBe(201);
    expect(usersService.createUser).toHaveBeenCalledWith({
      email: 'a@a.com',
      password: 'pass123',
      firstName: undefined,
      lastName: undefined,
    });
    const templatePath = path.join(
      process.cwd(),
      'src/templates/emails/emailVerificationTemplate.html',
    );
    expect(emailService.sendHtmlNotification).toHaveBeenCalledWith(
      expect.objectContaining({ templatePath }),
    );
  });
});

describe('POST /v1/auth/verify-email', () => {
  test('verifies email with valid token', async () => {
    usersService.verifyEmail.mockResolvedValue(true);
    const res = await request(app)
      .post('/v1/auth/verify-email')
      .send({ token: 'tok' });
    expect(res.status).toBe(204);
    expect(usersService.verifyEmail).toHaveBeenCalledWith('tok');
  });

  test('returns 400 when token invalid', async () => {
    usersService.verifyEmail.mockResolvedValue(false);
    const res = await request(app)
      .post('/v1/auth/verify-email')
      .send({ token: 'bad' });
    expect(res.status).toBe(400);
  });

  test('returns 400 when token missing', async () => {
    const res = await request(app).post('/v1/auth/verify-email').send({});
    expect(res.status).toBe(400);
  });
});

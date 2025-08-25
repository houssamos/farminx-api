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

describe('POST /v1/auth/forgot-password', () => {
  test('sends reset email', async () => {
    usersService.requestPasswordReset.mockResolvedValue({ user: { email: 'a@a.com' }, token: 'tok' });
    const res = await request(app).post('/v1/auth/forgot-password').send({ email: 'a@a.com' });
    expect(res.status).toBe(204);
    expect(usersService.requestPasswordReset).toHaveBeenCalledWith('a@a.com');
    const templatePath = path.join(
      process.cwd(),
      'src/templates/emails/passwordResetTemplate.html',
    );
    expect(emailService.sendHtmlNotification).toHaveBeenCalledWith(
      expect.objectContaining({ templatePath }),
    );
  });

  test('returns 400 when email missing', async () => {
    const res = await request(app).post('/v1/auth/forgot-password').send({});
    expect(res.status).toBe(400);
  });
});

describe('POST /v1/auth/reset-password', () => {
  test('resets password with valid token', async () => {
    usersService.resetPassword.mockResolvedValue(true);
    const res = await request(app)
      .post('/v1/auth/reset-password')
      .send({ token: 'tok', password: 'newpass' });
    expect(res.status).toBe(204);
    expect(usersService.resetPassword).toHaveBeenCalledWith('tok', 'newpass');
  });

  test('returns 400 when token invalid', async () => {
    usersService.resetPassword.mockResolvedValue(false);
    const res = await request(app)
      .post('/v1/auth/reset-password')
      .send({ token: 'bad', password: 'newpass' });
    expect(res.status).toBe(400);
  });
});


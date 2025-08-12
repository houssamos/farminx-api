const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

jest.mock('../src/repositories/users.repository');
const usersRepository = require('../src/repositories/users.repository');
const UserEntity = require('../src/entities/user.entity');
const NotificationEntity = require('../src/entities/notification.entity');
const usersRouter = require('../src/routes/v1/users.routes');

let app;

beforeAll(() => {
  process.env.JWT_SECRET = 'testsecret';
  app = express();
  app.use('/v1/users', usersRouter);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /v1/users', () => {
  test('requires admin role', async () => {
    usersRepository.findById.mockResolvedValue(
      new UserEntity({
        id: 'u1',
        email: 'user@test.com',
        password_hash: 'hash',
        first_name: 'User',
        last_name: 'Test',
        role: 'user',
        created_at: new Date(),
      })
    );
    const token = jwt.sign({ id: 'u1' }, process.env.JWT_SECRET);
    const res = await request(app).get('/v1/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test('returns subscription data for admin', async () => {
    usersRepository.findById.mockResolvedValue(
      new UserEntity({
        id: 'a1',
        email: 'admin@test.com',
        password_hash: 'hash',
        first_name: 'Admin',
        last_name: 'Test',
        role: 'admin',
        created_at: new Date(),
      })
    );
    usersRepository.listAllWithNotifications.mockResolvedValue([
      {
        user: new UserEntity({
          id: 'u2',
          email: 'user2@test.com',
          password_hash: 'hash',
          first_name: 'Jane',
          last_name: 'Doe',
          role: 'user',
          created_at: new Date('2024-01-01T00:00:00Z'),
        }),
        notification: new NotificationEntity({
          id: 'n1',
          user_id: 'u2',
          stats: true,
          marketplace: false,
          created_at: new Date('2024-06-01T00:00:00Z'),
        }),
      },
    ]);
    const token = jwt.sign({ id: 'a1' }, process.env.JWT_SECRET);
    const res = await request(app).get('/v1/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 'u2',
        email: 'user2@test.com',
        firstName: 'Jane',
        lastName: 'Doe',
        subscribed: true,
        subscriptionDate: '2024-06-01T00:00:00.000Z',
      },
    ]);
  });
});

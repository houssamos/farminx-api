const request = require('supertest');
const express = require('express');
const path = require('path');

describe('notificationsService.sendTemplatedEmail', () => {
  let notificationsService;
  let emailService;

  beforeEach(() => {
    jest.resetModules();
    jest.doMock('../src/services/email.service', () => ({
      sendHtmlNotification: jest.fn(),
    }));
    notificationsService = require('../src/services/notifications.service');
    emailService = require('../src/services/email.service');
  });

  test('uses stats template for stats notifications', async () => {
    emailService.sendHtmlNotification.mockResolvedValue();
    const result = await notificationsService.sendTemplatedEmail({
      type: 'stats',
      subject: 'Stats Update',
      variables: { product: 'Wheat', year: 2024, link: 'http://stats' },
      emails: ['user@test.com'],
    });
    expect(emailService.sendHtmlNotification).toHaveBeenCalledWith({
      to: 'user@test.com',
      subject: 'Stats Update',
      templatePath: path.join(
        process.cwd(),
        'src/templates/emails/statsTemplate.html',
      ),
      variables: { product: 'Wheat', year: 2024, link: 'http://stats' },
    });
    expect(result).toEqual({ sent: 1, skipped: 0 });
  });

  test('uses marketplace template for marketplace notifications', async () => {
    emailService.sendHtmlNotification.mockResolvedValue();
    const result = await notificationsService.sendTemplatedEmail({
      type: 'marketplace',
      subject: 'New Item',
      variables: { name: 'Tractor', link: 'http://market' },
      emails: ['user@test.com'],
    });
    expect(emailService.sendHtmlNotification).toHaveBeenCalledWith({
      to: 'user@test.com',
      subject: 'New Item',
      templatePath: path.join(
        process.cwd(),
        'src/templates/emails/marketplaceTemplate.html',
      ),
      variables: { name: 'Tractor', link: 'http://market' },
    });
    expect(result).toEqual({ sent: 1, skipped: 0 });
  });

  test('counts sent and skipped emails', async () => {
    emailService.sendHtmlNotification.mockImplementation(({ to }) => {
      if (to === 'ok@test.com') return Promise.resolve();
      return Promise.reject(new Error('fail'));
    });
    const result = await notificationsService.sendTemplatedEmail({
      type: 'stats',
      subject: 'Stats Update',
      variables: { product: 'Corn', year: 2023, link: 'http://stats' },
      emails: ['ok@test.com', 'fail@test.com'],
    });
    expect(result).toEqual({ sent: 1, skipped: 1 });
  });
});

describe('POST /v1/notifications/send validations', () => {
  let app;
  let notificationsService;

  beforeEach(() => {
    jest.resetModules();
    jest.doMock('../src/services/notifications.service', () => ({
      sendTemplatedEmail: jest.fn().mockResolvedValue({ sent: 0, skipped: 0 }),
    }));
    notificationsService = require('../src/services/notifications.service');
    const notificationsController = require('../src/controllers/notifications.controller');
    app = express();
    app.use(express.json());
    app.post('/v1/notifications/send', notificationsController.send);
  });

  test('requires type', async () => {
    const res = await request(app).post('/v1/notifications/send').send({ subject: 'Hello' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Type et sujet requis' });
  });

  test('requires subject', async () => {
    const res = await request(app).post('/v1/notifications/send').send({ type: 'stats' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Type et sujet requis' });
  });

  test('requires product, year and link for stats', async () => {
    const res = await request(app)
      .post('/v1/notifications/send')
      .send({ type: 'stats', subject: 'S', product: 'p', year: 2023 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Produit, année et lien requis' });
  });

  test('requires link for marketplace', async () => {
    const res = await request(app)
      .post('/v1/notifications/send')
      .send({ type: 'marketplace', subject: 'S' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Lien requis' });
  });

  test('returns sent and skipped counts on success', async () => {
    notificationsService.sendTemplatedEmail.mockResolvedValue({ sent: 2, skipped: 1 });
    const res = await request(app)
      .post('/v1/notifications/send')
      .send({
        type: 'stats',
        subject: 'S',
        product: 'p',
        year: 2023,
        link: 'http://example.com',
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ sent: 2, skipped: 1 });
    expect(notificationsService.sendTemplatedEmail).toHaveBeenCalledWith({
      type: 'stats',
      subject: 'S',
      product: 'p',
      year: 2023,
      link: 'http://example.com',
    });
  });
});


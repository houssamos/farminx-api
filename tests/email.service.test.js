jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));
let nodemailer;

describe('email.service', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    nodemailer = require('nodemailer');
  });

  test('creates Gmail OAuth2 transporter', () => {
    process.env.EMAIL_USER = 'user@gmail.com';
    process.env.GOOGLE_CLIENT_ID = 'clientId';
    process.env.GOOGLE_CLIENT_SECRET = 'clientSecret';
    process.env.GOOGLE_REFRESH_TOKEN = 'refresh';

    require('../src/services/email.service');

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });
  });

  test('sendBulkEmail uses EMAIL_USER when EMAIL_FROM missing', async () => {
    process.env.EMAIL_USER = 'user@gmail.com';
    delete process.env.EMAIL_FROM;
    const sendMail = jest.fn().mockResolvedValue();
    nodemailer.createTransport.mockReturnValue({ sendMail });

    const emailService = require('../src/services/email.service');

    await emailService.sendBulkEmail(['a@test.com'], 'subject', 'body', '<p>body</p>');

    expect(sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: 'a@test.com',
      subject: 'subject',
      text: 'body',
      html: '<p>body</p>',
    });
  });

  test('sendBulkEmail uses EMAIL_FROM when defined', async () => {
    process.env.EMAIL_USER = 'user@gmail.com';
    process.env.EMAIL_FROM = 'Farm <farm@example.com>';
    const sendMail = jest.fn().mockResolvedValue();
    nodemailer.createTransport.mockReturnValue({ sendMail });

    const emailService = require('../src/services/email.service');

    await emailService.sendBulkEmail(['a@test.com'], 'subject', 'body', '<p>body</p>');

    expect(sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_FROM,
      to: 'a@test.com',
      subject: 'subject',
      text: 'body',
      html: '<p>body</p>',
    });
  });

  test('sendBulkEmail forwards HTML to the transporter', async () => {
    process.env.EMAIL_USER = 'user@gmail.com';
    delete process.env.EMAIL_FROM;
    const sendMail = jest.fn().mockResolvedValue();
    nodemailer.createTransport.mockReturnValue({ sendMail });

    const emailService = require('../src/services/email.service');

    await emailService.sendBulkEmail(
      ['a@test.com'],
      'subject',
      'plain body',
      '<strong>HTML body</strong>',
    );

    expect(sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: 'a@test.com',
      subject: 'subject',
      text: 'plain body',
      html: '<strong>HTML body</strong>',
    });
  });

  test('buildStatsAvailableEmail returns subject, text and html', () => {
    const emailService = require('../src/services/email.service');
    const { subject, text, html } = emailService.buildStatsAvailableEmail(
      'http://example.com/stats',
      ['blé', 'maïs'],
      2023,
    );

    expect(subject).toBe('Nouvelles statistiques disponibles');
    expect(text).toBe(
      'Les statistiques pour blé, maïs 2023 sont disponibles : http://example.com/stats'
    );
    expect(html).toContain('<h1>Statistiques disponibles</h1>');
    expect(html).toContain(
      '<p>Les statistiques pour blé, maïs 2023 sont maintenant disponibles.</p>',
    );
    expect(html).toContain(
      '<p><a href="http://example.com/stats">http://example.com/stats</a></p>',
    );
  });
});


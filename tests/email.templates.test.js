const path = require('path');

jest.mock('../src/utils/mailer', () => ({
  sendMail: jest.fn(),
}));

const mailer = require('../src/utils/mailer');
const emailService = require('../src/services/email.service');

describe('emailService.sendHtmlNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('compiles stats template with variables', async () => {
    await emailService.sendHtmlNotification({
      to: 'user@test.com',
      subject: 'Stats',
      templatePath: path.join(process.cwd(), 'src/templates/emails/statsTemplate.html'),
      variables: { product: 'Wheat', year: 2024, link: 'http://stats' },
    });

    expect(mailer.sendMail).toHaveBeenCalledWith({
      to: 'user@test.com',
      subject: 'Stats',
      html: expect.stringContaining('Wheat'),
    });
    const html = mailer.sendMail.mock.calls[0][0].html;
    expect(html).toContain('2024');
    expect(html).toContain('http://stats');
  });

  test('compiles marketplace template with variables', async () => {
    await emailService.sendHtmlNotification({
      to: 'user@test.com',
      subject: 'Market',
      templatePath: path.join(process.cwd(), 'src/templates/emails/marketplaceTemplate.html'),
      variables: { name: 'Tractor', link: 'http://market' },
    });

    expect(mailer.sendMail).toHaveBeenCalledWith({
      to: 'user@test.com',
      subject: 'Market',
      html: expect.stringContaining('Tractor'),
    });
    const html = mailer.sendMail.mock.calls[0][0].html;
    expect(html).toContain('http://market');
  });

  test('compiles email verification template with variables', async () => {
    await emailService.sendHtmlNotification({
      to: 'user@test.com',
      subject: 'Verify',
      templatePath: path.join(process.cwd(), 'src/templates/emails/emailVerificationTemplate.html'),
      variables: { name: 'Alice', link: 'http://verify' },
    });

    expect(mailer.sendMail).toHaveBeenCalledWith({
      to: 'user@test.com',
      subject: 'Verify',
      html: expect.stringContaining('Alice'),
    });
    const html = mailer.sendMail.mock.calls[0][0].html;
    expect(html).toContain('http://verify');
  });

  test('compiles password reset template with variables', async () => {
    await emailService.sendHtmlNotification({
      to: 'user@test.com',
      subject: 'Reset',
      templatePath: path.join(process.cwd(), 'src/templates/emails/passwordResetTemplate.html'),
      variables: { name: 'Bob', link: 'http://reset' },
    });

    expect(mailer.sendMail).toHaveBeenCalledWith({
      to: 'user@test.com',
      subject: 'Reset',
      html: expect.stringContaining('Bob'),
    });
    const html = mailer.sendMail.mock.calls[0][0].html;
    expect(html).toContain('http://reset');
  });
});

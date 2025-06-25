const AppRegisterResponseDto = require('../dtos/app-register-response.dto');
const AppRegisterKeyResponseDto = require('../dtos/app-register-key-response.dto');
const LoginResponseDto = require('../dtos/login-response.dto');

function appModelToRegisterResponseDto(app) {
  if (!app) return null;
  return new AppRegisterResponseDto({ id: app.id, name: app.name });
}

function appModelToRegisterKeyResponseDto(app) {
  if (!app) return null;
  return new AppRegisterKeyResponseDto({ id: app.id, name: app.name, apiKey: app.apiKey });
}

function tokenToLoginResponseDto(token) {
  if (!token) return null;
  return new LoginResponseDto({ token });
}

module.exports = {
  appModelToRegisterResponseDto,
  appModelToRegisterKeyResponseDto,
  tokenToLoginResponseDto,
};

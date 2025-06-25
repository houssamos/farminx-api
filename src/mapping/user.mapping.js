const User = require('../models/user.model');
const LoginResponseDto = require('../dtos/login-response.dto');
const RegisterResponseDto = require('../dtos/register-response.dto');

function entityToModel(entity) {
  if (!entity) return null;
  return new User({
    id: entity.id,
    email: entity.email,
    firstName: entity.first_name,
    lastName: entity.last_name,
    role: entity.role,
  });
}

function tokenToLoginResponseDto(token) {
  if (!token) return null;
  return new LoginResponseDto({ token });
}

function userModelToRegisterResponseDto(model) {
  if (!model) return null;
  return new RegisterResponseDto({ id: model.id, email: model.email });
}

module.exports = {
  entityToModel,
  tokenToLoginResponseDto,
  userModelToRegisterResponseDto,
};


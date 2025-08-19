class UserEntity {
  constructor({
    id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    created_at,
    password_reset_token,
    password_reset_expires,
  }) {
    this.id = id;
    this.email = email;
    this.password_hash = password_hash;
    this.first_name = first_name;
    this.last_name = last_name;
    this.role = role;
    this.created_at = created_at;
    this.password_reset_token = password_reset_token;
    this.password_reset_expires = password_reset_expires;
  }
}
module.exports = UserEntity;

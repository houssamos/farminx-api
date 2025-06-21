class User {
  constructor({ id, email, firstName, lastName, role }) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
  }
}
module.exports = User;

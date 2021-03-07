/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.token = null;
    this.actionDate = null;
    this.dateOfBirth = null;
    this.status = null;
    Object.assign(this, data);
  }
}
export default User;

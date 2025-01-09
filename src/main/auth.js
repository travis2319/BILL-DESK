import { DBHandler } from './dbHandler';
import bcrypt from 'bcrypt';

export class Auth {
   dbHandler;

  constructor(dbHandler) {
    this.dbHandler = dbHandler;
  }

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS Users (
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;
    await this.dbHandler.run(query);
  }

  async insertUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
    await this.dbHandler.run(query, [username, email, hashedPassword]);
  }

  async getUserByEmailAndPassword(email, password) {
    const query = 'SELECT * FROM Users WHERE email = ?';
    const user = await this.dbHandler.get(query, [email]);
  if (!user) return null;
  console.log(user.name+"password is:"+user.password);
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;

  }

  async getAllUsers() {
    const query = 'SELECT * FROM Users';
    return await this.dbHandler.all(query);
  }

  async checkUserExists(email) {
    const query = 'SELECT * FROM Users WHERE email = ?';
    const user = await this.dbHandler.get(query, [email]);
    return !!user;
  }

  async updateUserPassword(email, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE Users SET password = ? WHERE email = ?';
    await this.dbHandler.run(query, [hashedPassword, email]);
  }
}

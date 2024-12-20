import sqlite3 from 'sqlite3';
import { app } from 'electron';
import { join } from 'path';

export class DBHandler {
   db;

  constructor(dbName = 'data.db') {
    const userDataPath = app.getPath('userData');
    const dbPath = join(userDataPath, dbName);
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('Error connecting to database:', err);
      else console.log(`Database connection established: ${dbPath}`);
    });
  }

  run(query, params) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (err) => {
        if (err) reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  get(query, params= []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  all(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) console.error('Error closing database connection:', err);
      else console.log('Database connection closed');
    });
  }
}

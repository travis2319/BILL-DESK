import sqlite3 from 'sqlite3'
import { app } from 'electron'
import { join } from 'path'

export function createDatabaseConnection() {
  const userDataPath = app.getPath('userData')
  const dbPath = join(userDataPath, 'data.db')
  const db = new sqlite3.Database(dbPath)
  console.log('Database connection established:', dbPath)
  return db
}

export function createTable(db) {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS Users(
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
      );
    `, (err) => {
      if (err) console.error('Error creating table:', err)
      else console.log('Table "Users" is ready')
    })
  })
}

export function insertData(db, name, email, password) {
  const stmt = db.prepare('INSERT INTO Users (username, email, password) VALUES (?,?,?)')
  stmt.run(name, email, password, (err) => {
    if (err) console.error('Error inserting data:', err)
    else console.log('Data inserted successfully')
  })
  stmt.finalize()
}

export function retrieveData(db, email, password) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, username, email, password FROM Users WHERE email = ?', [email], (err, row) => {
      if (err) reject({ success: false, error: err.message })
      else if (!row) resolve({ success: false, message: 'User not found' })
      else if (row.password !== password) resolve({ success: false, message: 'Invalid password' })
      else resolve({ success: true, user: { id: row.id, username: row.username, email: row.email } })
    })
  })
}

export function retrieveAllData(db){
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Users', (err, rows) => {
      if (err) {
        console.error('Error retrieving data:', err);
        reject({ success: false, error: err.message });
      }
      else {
        console.log('Retrieved data:', rows);
        resolve({success: true, data: rows })
      }
    });
  })
  }

export function closeDatabaseConnection(db) {
  db.close((err) => {
    if (err) console.error('Error closing database connection:', err)
    else console.log('Database connection closed')
  })
}

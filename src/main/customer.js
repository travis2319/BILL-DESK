import { DBHandler } from "./dbHandler";

export class Customer {
   dbHandler;
  constructor(dbHandler) {
    this.dbHandler = dbHandler;
  }

  // Create Customers table
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS Customers (
        CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerName TEXT ,
        PhoneNumber TEXT,
        Email TEXT UNIQUE NOT NULL
      );
    `;
    await this.dbHandler.run(query);
  }

  // Get all customers
  async getAllCustomers(){
    const query = `SELECT * FROM Customers`;
    return await this.dbHandler.all(query); // Use `all` to fetch all rows
  }

  // Add a new customer
  async addCustomer(customerName, phoneNumber , email){
    const query = `
      INSERT INTO Customers (CustomerName, PhoneNumber, Email)
      VALUES (?, ?, ?)
    `;
    const result = await this.dbHandler.run(query, [customerName, phoneNumber, email]);
    return result.lastID; // Return the ID of the newly inserted customer
  }

  // Get a customer by email
  async getCustomerByEmail(email) {
    const query = `SELECT CustomerID FROM Customers WHERE Email = ?`;
     const result = await this.dbHandler.get(query, [email]); // Use `get` to fetch a single row
     return result ? result.CustomerID : null;
  }
}
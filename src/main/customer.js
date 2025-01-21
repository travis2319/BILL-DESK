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
        CustomerName TEXT,
        PhoneNumber TEXT UNIQUE NOT NULL,
        Email TEXT
      );
    `;
    await this.dbHandler.run(query);
  }

  // Get all customers
  async getAllCustomers() {
    const query = `SELECT * FROM Customers`;
    return await this.dbHandler.all(query);
  }

  // Add a new customer
  async addCustomer(customerName, phoneNumber, email) {
    const query = `
      INSERT INTO Customers (CustomerName, PhoneNumber, Email)
      VALUES (?, ?, ?)
    `;
    const result = await this.dbHandler.run(query, [customerName, phoneNumber, email]);
    return result.lastID; // Return the ID of the newly inserted customer
  }

  // Get customer by phone number (return full details)
  async getCustomerByPhone(phoneNumber) {
    const query = `SELECT * FROM Customers WHERE PhoneNumber = ?`;
    const result = await this.dbHandler.get(query, [phoneNumber]);
    return result || null; // Return full customer details or null if not found
  }

  // Update customer details
  async updateCustomer(phoneNumber, customerName, email) {
    const query = `
      UPDATE Customers 
      SET CustomerName = ?, Email = ?
      WHERE PhoneNumber = ?
    `;
    const result = await this.dbHandler.run(query, [customerName, email, phoneNumber]);
    return result.changes > 0; // Return true if any row was updated
  }
}

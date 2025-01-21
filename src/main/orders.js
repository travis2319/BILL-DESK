import { DBHandler } from "./dbHandler";

export class Orders {
  dbHandler;

  constructor(dbHandler) {
    this.dbHandler = dbHandler;
  }

  async createTables() {
    const ordersTableQuery = `
      CREATE TABLE IF NOT EXISTS Orders (
        OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER,
        CustomerName TEXT ,
        PhoneNumber TEXT NOT NULL,
        Email TEXT,
        OrderTimestamp DATETIME NOT NULL,
        TotalAmount DECIMAL(10,2),
        SubTotal DECIMAL(10,2),
        cgstAmount DECIMAL(10,2),
        sgstAmount DECIMAL(10,2),
        sgstRate DECIMAL(10,2),
        cgstRate DECIMAL(10,2)
      );
    `;
    try {
      await this.dbHandler.run(ordersTableQuery);
    } catch (err) {
      console.error("Error creating Orders table:", err);
      throw err;
    }
  }

  async createOrder(
    userID,
    customerName,
    phoneNumber,
    email,
    orderTimestamp,
    totalAmount,
    subTotal,
    cgstAmount,
    sgstAmount,
    cgstRate,
    sgstRate
  ) {
    const insertOrderQuery = `
      INSERT INTO Orders (UserID, CustomerName, PhoneNumber, Email, OrderTimestamp, TotalAmount, SubTotal, cgstAmount, sgstAmount, cgstRate, sgstRate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      // Insert the order
      await this.dbHandler.run(insertOrderQuery, [
        userID,
        customerName,
        phoneNumber,
        email,
        orderTimestamp,
        totalAmount,
        subTotal,
        cgstAmount,
        sgstAmount,
        cgstRate,
        sgstRate
      ]);

      // Fetch the last inserted order ID
      const fetchOrderIDQuery = `
        SELECT OrderID 
        FROM Orders
        WHERE UserID = ? AND PhoneNumber = ? AND OrderTimestamp = ?
        ORDER BY OrderID DESC
        LIMIT 1
      `;
      const result = await this.dbHandler.get(fetchOrderIDQuery, [
        userID,
        phoneNumber,
        orderTimestamp,
      ]);

      if (!result) {
        throw new Error("Failed to retrieve OrderID after insert.");
      }

      return result.OrderID;
    } catch (err) {
      console.error("Error creating order:", err);
      throw err;
    }
  }

  async getAllOrders() {
    const query = `
      SELECT 
        o.OrderID, 
        o.CustomerName,
        o.PhoneNumber,
        o.Email,
        o.UserID,
        o.OrderTimestamp, 
        o.TotalAmount, 
        o.SubTotal, 
        o.cgstAmount,
        o.sgstAmount,
        o.cgstRate,
        o.sgstRate,
        group_concat(oi.ItemName, ', ') AS ItemNames,
        group_concat(oi.Quantity, ', ') AS Quantities
      FROM Orders o
      LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
      GROUP BY o.OrderID
      ORDER BY o.OrderID DESC;
    `;
    try {
      return await this.dbHandler.all(query);
    } catch (err) {
      console.error("Error fetching orders:", err);
      throw err;
    }
  }

  async getOrder(orderId) {
    const query = `
      SELECT 
        o.OrderID,
        o.OrderTimestamp,
        o.TotalAmount,
        o.SubTotal,
        o.cgstAmount,
        o.sgstAmount,
        o.cgstRate,
        o.sgstRate,
        o.CustomerName,
        o.Email AS CustomerEmail,
        o.PhoneNumber,
        oi.ItemName,
        oi.Quantity,
        m.Price AS ItemPrice
      FROM Orders o
      LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
      LEFT JOIN MenuItems m ON oi.ItemName = m.ItemName
      WHERE o.OrderID = ?`;

    try {
      const rows = await this.dbHandler.all(query, [orderId]);

      if (rows.length > 0) {
        const orderDetails = {
          OrderID: rows[0].OrderID,
          TimeStamp: rows[0].OrderTimestamp,
          TotalAmount: rows[0].TotalAmount,
          SubTotal: rows[0].SubTotal,
          cgstAmount: rows[0].cgstAmount || 0.00,
          sgstAmount: rows[0].sgstAmount || 0.00,
          CustomerName: rows[0].CustomerName || 'N/A',
          Email: rows[0].CustomerEmail || 'N/A',
          PhoneNumber: rows[0].PhoneNumber || 'N/A',
          Items: rows.map(row => ({
            ItemName: row.ItemName || 'N/A',
            ItemPrice: row.ItemPrice || 0.00,
            Quantity: row.Quantity || 0
          })),
          cgstRate: rows[0].cgstRate || 0.00,
          sgstRate: rows[0].sgstRate || 0.00
        };

        return orderDetails;
      } else {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  }
}

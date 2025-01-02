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
        UserID INTEGER NOT NULL,
        CustomerId INTEGER NOT NULL,
        OrderTimestamp DATETIME NOT NULL,
        TotalAmount DECIMAL(10,2),
        SubTotal DECIMAL(10,2),
        cgstAmount DECIMAL(10,2),
        sgstAmount DECIMAL(10,2),
        sgstRate DECIMAL(10,2),
        cgstRate DECIMAL(10,2),
        FOREIGN KEY (UserID) REFERENCES Users(UserID),
        FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId)
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
    customerId,
    orderTimestamp,
    totalAmount,
    subTotal,
    cgstAmount,
    sgstAmount,
    cgstRate,
    sgstRate
  ) {
    const insertOrderQuery = `
      INSERT INTO Orders (UserID, CustomerId, OrderTimestamp, TotalAmount, SubTotal, cgstAmount, sgstAmount, cgstRate, sgstRate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      // Insert the order
      await this.dbHandler.run(insertOrderQuery, [
        userID,
        customerId,
        orderTimestamp,
        totalAmount,
        subTotal,
        cgstAmount,
        sgstAmount,
        cgstRate,
        sgstRate // Fixed variable name from sgstRates to sgstRate
      ]);

      // Fetch the last inserted order ID
      const fetchOrderIDQuery = `
        SELECT OrderID 
        FROM Orders
        WHERE UserID = ? AND CustomerId = ? AND OrderTimestamp = ?
        ORDER BY OrderID DESC
        LIMIT 1
      `;
      const result = await this.dbHandler.get(fetchOrderIDQuery, [
        userID,
        customerId,
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
        c.CustomerID,
        c.CustomerName,
        c.PhoneNumber,
        c.Email,
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
      JOIN Customers c ON o.CustomerId = c.CustomerID
      LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
      GROUP BY o.OrderID, c.CustomerID
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
        c.CustomerName,
        c.Email AS CustomerEmail,
        c.PhoneNumber,
        oi.ItemName,
        oi.Quantity,
        m.Price AS ItemPrice
      FROM Orders o
      JOIN Customers c ON o.CustomerId = c.CustomerID
      LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
      LEFT JOIN MenuItems m ON oi.ItemName = m.ItemName
      WHERE o.OrderID = ?`;

    try {
      const rows = await this.dbHandler.all(query, [orderId]);

      if (rows.length > 0) {
        // Transform the result into a more structured format if necessary
        const orderDetails = {
          OrderID: rows[0].OrderID,
          TimeStamp: rows[0].OrderTimestamp,
          TotalAmount: rows[0].TotalAmount,
          SubTotal: rows[0].SubTotal,
          cgstAmount: rows[0].cgstAmount || 0.00, // Default value if not found
          sgstAmount: rows[0].sgstAmount || 0.00, // Default value if not found
          CustomerName: rows[0].CustomerName || 'N/A', // Handle missing customer names gracefully
          Email: rows[0].CustomerEmail || 'N/A', // Handle missing email gracefully
          PhoneNumber: rows[0].PhoneNumber || 'N/A', // Handle missing phone number gracefully
          Items: rows.map(row => ({
            ItemName: row.ItemName || 'N/A', // Handle missing item names gracefully
            ItemPrice: row.ItemPrice || 0.00, // Default price if not found
            Quantity: row.Quantity || 0 // Default quantity if not found
          })),
          cgstRate: rows[0].cgstRate || 0.00, // Default rate if not found
          sgstRate: rows[0].sgstRate || 0.00 // Default rate if not found
        };

        return orderDetails; // Return structured order details
      } else {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  }
}

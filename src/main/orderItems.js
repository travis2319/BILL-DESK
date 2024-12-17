import { DBHandler } from "./dbHandler";

export class OrderItems {
   dbHandler;

  constructor(dbHandler) {
    this.dbHandler = dbHandler;
  }

  // Create the `OrderItems` table if it does not already exist
  async createTables() {
    const orderItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS OrderItems (
        OrderItemID INTEGER PRIMARY KEY AUTOINCREMENT,
        OrderID INTEGER NOT NULL,
        ItemName TEXT NOT NULL,
        Quantity INTEGER NOT NULL,
        FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
      );
    `;
    try {
      await this.dbHandler.run(orderItemsTableQuery);
    } catch (err) {
      console.error("Error creating OrderItems table:", err);
      throw err;
    }
  }

  // Insert multiple order items for a specific order
  async createOrderItems(orderID, items) {
    if (items.length === 0) {
      throw new Error("No items provided for the order.");
    }

    const insertItemQuery = `
      INSERT INTO OrderItems (OrderID, ItemName, Quantity)
      VALUES (?, ?, ?)
    `;

    try {
      for (const item of items) {
        const { name, quantity } = item;
        if (quantity <= 0) {
          throw new Error(`Invalid quantity for item: ${name}. Quantity must be greater than zero.`);
        }
        await this.dbHandler.run(insertItemQuery, [orderID, name, quantity]);
      }
    } catch (err) {
      console.error("Error inserting order items:", err);
      throw err;
    }
  }

  // Fetch all items for a specific order
  async getOrderItems(orderID) {
    const query = `
      SELECT OrderItemID, ItemName, Quantity
      FROM OrderItems
      WHERE OrderID = ?
    `;
    try {
      return await this.dbHandler.all(query, [orderID]);
    } catch (err) {
      console.error("Error fetching order items:", err);
      throw err;
    }
  }
}

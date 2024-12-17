import { DBHandler } from './dbHandler';

export class Analytics {
   dbHandler;

  constructor(dbHandler) {
    this.dbHandler = dbHandler;
  }

  // Creates views to summarize user orders
  async createViews() {
    const query = `
      CREATE VIEW IF NOT EXISTS UserOrderSummary AS
      SELECT
      u.UserID,
      u.username,
      COUNT(o.OrderID) AS TotalOrders,
      SUM(o.TotalAmount) AS TotalRevenue,
      SUM(oi.Quantity) AS TotalProductsSold,
      COUNT(DISTINCT o.CustomerID) AS TotalCustomers
      FROM Users u
      LEFT JOIN Orders o ON u.UserID = o.UserID
      LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
      GROUP BY u.UserID, u.username;
    `;
    await this.dbHandler.run(query);
  }

  // Fetches the summarized user order data from the view
  async getUserOrderSummary() {
    const query = 'SELECT * FROM UserOrderSummary';
    return await this.dbHandler.all(query);
  }
}

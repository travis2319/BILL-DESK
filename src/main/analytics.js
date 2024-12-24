import { DBHandler } from './dbHandler';

export class Analytics {
   dbHandler;

  constructor(dbHandler) {
    this.dbHandler = dbHandler;
  }

  // Creates views to summarize user orders
  async createViews() {
    const query = `
     CREATE VIEW IF NOT EXISTS OrderSummary AS
  SELECT
    COUNT(o.OrderID) AS TotalOrders,
    SUM(o.TotalAmount) AS TotalRevenue,
    SUM(oi.Quantity) AS TotalProductsSold,
    COUNT(DISTINCT o.CustomerID) AS TotalCustomers
  FROM Orders o
  LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID;
    `;
    await this.dbHandler.run(query);
  }

  // Fetches the summarized user order data from the view
  async getUserOrderSummary() {
    const query = 'SELECT SUM(TotalAmount) AS TotalRevenue,COUNT(OrderID) AS TotalOrders from Orders;';
    return await this.dbHandler.all(query);
  }
}


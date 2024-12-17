import { DBHandler } from './dbHandler';

export class Analytics {
   dbHandler;

  constructor(dbHandler) {
    this.dbHandler = dbHandler;
  }

  async createViews() {
    const query = `
      
    `;
    await this.dbHandler.run(query);
  }

  async getUserOrderSummary() {
    const query = 'SELECT * FROM UserOrderSummary';
    return await this.dbHandler.all(query);
  }
}

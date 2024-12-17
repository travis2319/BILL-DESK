import { DBHandler } from "./dbHandler";

export class Menu{
    dbHandler;

    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    async createTable() {
        const query = `
          CREATE TABLE IF NOT EXISTS MenuItems (
          ItemID INTEGER PRIMARY KEY AUTOINCREMENT,
          ItemName TEXT NOT NULL,
          Price INTEGER NOT NULL,
          Quantity INTEGER NOT NULL,
          IsAvailable BOOLEAN DEFAULT TRUE
          );
        `;
        await this.dbHandler.run(query);
      }

      async createMenu(ItemName, Price,Quantity,IsAvailable) {
        const query = 'INSERT INTO MenuItems (ItemName, Price, Quantity, IsAvailable) VALUES (?, ?, ?, ?)';
        await this.dbHandler.run(query, [ItemName, Price, Quantity, IsAvailable])
      }
    
      async getAllMenu() {
        const query = 'SELECT * FROM MenuItems;';
        return await this.dbHandler.all(query);
      }
      
      async getMenuNames() {
        const query = 'SELECT ItemName, Price FROM MenuItems;';
        return await this.dbHandler.all(query);
      }
}
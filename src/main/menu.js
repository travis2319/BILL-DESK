import { DBHandler } from "./dbHandler";

export class Menu {
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

    async createMenu(ItemName, Price, Quantity, IsAvailable) {
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

    async deleteItem(ItemID) {
        const query = 'DELETE FROM MenuItems WHERE ItemID = ?';
        return await this.dbHandler.run(query, [ItemID]);
    }

    async updateMenuField(ItemID, ItemName, Price,Quantity,IsAvailable) {
        // Validate field name to prevent SQL injection
        const validFields = ['ItemName', 'Price', 'Quantity', 'IsAvailable'];
        if (!validFields.includes(field)) {
            throw new Error('Invalid field name');
        }

        const query = `UPDATE MenuItems SET ${field} = ? WHERE ItemID = ?`;
        return await this.dbHandler.run(query, [value, ItemID]);
    }

    // Optional: Bulk update method if needed
    async updateMenuItem(ItemID, ItemName, Price, Quantity, IsAvailable) {
        const query = `
            UPDATE MenuItems 
            SET ItemName = ?, 
                Price = ?, 
                Quantity = ?, 
                IsAvailable = ?
            WHERE ItemID = ?
        `;
        return await this.dbHandler.run(query, [ItemName, Price, Quantity, IsAvailable, ItemID]);
    }

    // Optional: Method to check if menu item exists
    async menuItemExists(ItemID) {
        const query = 'SELECT COUNT(*) as count FROM MenuItems WHERE ItemID = ?';
        const result = await this.dbHandler.get(query, [ItemID]);
        return result.count > 0;
    }
}
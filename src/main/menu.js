import { DBHandler } from "./dbHandler";

export class Menu {
    dbHandler;

    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    // Create the MenuItems table if it doesn't exist
    async createTable() {
        const query = `
          CREATE TABLE IF NOT EXISTS MenuItems (
            ItemID INTEGER PRIMARY KEY AUTOINCREMENT,
            ItemName TEXT NOT NULL,
            Price INTEGER NOT NULL,
            Quantity INTEGER NOT NULL,
            QuantityType TEXT NOT NULL
          );
        `;
        await this.dbHandler.run(query);
    }

    // Insert a new menu item into the table
    async createMenu(ItemName, Price, Quantity, QuantityType) {
        const query = `
            INSERT INTO MenuItems (ItemName, Price, Quantity, QuantityType) 
            VALUES (?, ?, ?, ?)
        `;
        await this.dbHandler.run(query, [ItemName, Price, Quantity, QuantityType]);
    }

    // Fetch all menu items
    async getAllMenu() {
        const query = 'SELECT * FROM MenuItems;';
        return await this.dbHandler.all(query);
    }

    // Fetch only menu names and prices
    async getMenuNames() {
        const query = 'SELECT ItemName, Price, Quantity, QuantityType FROM MenuItems;';
        return await this.dbHandler.all(query);
    }

    // Delete a menu item by ID
    async deleteItem(ItemID) {
        const query = 'DELETE FROM MenuItems WHERE ItemID = ?';
        return await this.dbHandler.run(query, [ItemID]);
    }

    // Update a single field of a menu item
    async updateMenuField(ItemID, field, value) {
        // Validate field name to prevent SQL injection
        // const validFields = ['ItemName', 'Price', 'Quantity', 'IsAvailable'];
        // if (!validFields.includes(field)) {
        //     throw new Error(`Invalid field name: ${field}`);
        // }

        // Validate ItemID and value
        if (!ItemID || value === undefined || value === null) {
            throw new Error('Invalid ItemID or value for update.');
        }

        const query = `UPDATE MenuItems SET ${field} = ? WHERE ItemID = ?`;
        return await this.dbHandler.run(query, [value, ItemID]);
    }

    // Optional: Update all fields for a specific menu item
    async updateMenuItem(ItemID, ItemName, Price, Quantity, QuantityType) {
        const query = `
            UPDATE MenuItems 
            SET ItemName = ?, 
                Price = ?, 
                Quantity = ?, 
                QuantityType = ?
            WHERE ItemID = ?
        `;
        return await this.dbHandler.run(query, [ItemName, Price, Quantity, QuantityType, ItemID]);
    }

    // Optional: Check if a menu item exists
    async menuItemExists(ItemID) {
        const query = 'SELECT COUNT(*) as count FROM MenuItems WHERE ItemID = ?';
        const result = await this.dbHandler.get(query, [ItemID]);
        return result.count > 0;
    }
}

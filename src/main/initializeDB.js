import { DBHandler } from './dbHandler';
import { Auth } from './auth';
import { Orders } from './orders';
import { Menu } from './menu';
import { Customer } from './customer'
import { OrderItems } from './orderItems';

export async function initializeDatabase(dbHandler){
    const auth = new Auth(dbHandler);
  const orders = new Orders(dbHandler);
  const orderItems = new OrderItems(dbHandler)
  const menu = new Menu(dbHandler);
  const customer =  new Customer(dbHandler);
  try {
    // Call the method to create all necessary tables
    await auth.createTable();
    await orders.createTables();
    await orderItems.createTables();
    await menu.createTable();
    await customer.createTable();
    console.log("table created successfully");
    
  } catch (error) {
    console.error('Error initializing database:', error);
    // Handle error as needed (e.g., show a dialog or log it)
  }
}

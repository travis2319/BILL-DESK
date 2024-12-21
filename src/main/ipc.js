import { ipcMain } from 'electron';
import { DBHandler } from './dbHandler';
import { Auth } from './auth';
import { Orders } from './orders';
import { Menu } from './menu';
import { Customer } from './customer';
import { OrderItems } from './orderItems';
import { Analytics } from './analytics';

export const handleIPC = (dbHandler) => {
  const auth = new Auth(dbHandler);
  const orders = new Orders(dbHandler);
  const menu = new Menu(dbHandler);
  const customer = new Customer(dbHandler);
  const orderItems = new OrderItems(dbHandler)
  const analytics = new Analytics(dbHandler);
  
  ipcMain.handle('auth-create-user', async (_, username, email, password) => {
    try {
      await auth.createTable();
      await auth.insertUser(username, email, password);
      return { success: true, message: 'User added successfully' };
    } catch (err) {
      return { success: false, error: err };
    }
  });

  ipcMain.handle('auth-get-users', async () => {
    try {
      return { success: true, users: await auth.getAllUsers() };
    } catch (err) {
      return { success: false, error: err };
    }
  });

  ipcMain.handle('auth-get-user', async (_, email, password) => {
    try {
      const user = await auth.getUserByEmailAndPassword(email, password);
      if (!user) return { success: false, message: 'Invalid email or password' };
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err };
    }
  });

  ipcMain.handle('order-create', async (_,  userID, orderTimestamp, totalAmount, subTotal, taxAmount,taxRate, items ) => {
    try {
      await orders.createTables();
      // console.log(items);
      console.log(userID, orderTimestamp, totalAmount, subTotal, taxAmount, items,taxRate );
      
      await orders.createOrder(userID, orderTimestamp, totalAmount, subTotal, taxAmount, items);
      return { success: true, message: 'Order and items created successfully' };
    } catch (err) {
      return { success: false, error: err };
    }
  });
  
  ipcMain.handle('order-get-All', async () => {
    try {
      const allOrders = await orders.getAllOrders();
      return { success: true, orders: allOrders };
    } catch (err) {
      console.error("Error in IPC handler:", err);
      return { success: false, error: err.message || err };
    }
  });

  ipcMain.handle('order-get-ById', async(_,orderID)=>{
    try{
      const order = await orders.getOrder(orderID);
      return {success:true, order:order};
    }catch(err){
      return {success:false,error: err.message || err}
    }
  })

  ipcMain.handle('menu-create', async(_,ItemName,Price,Quantity,Status)=>{
    try{

      console.log(ItemName,Price,Quantity,Status);
       await menu.createTable();
       
       await menu.createMenu(ItemName, Price, Quantity, Status);
       return {success:true,message: 'Items was added successfully'}
    }catch(err){
      return {success:false,error:err||err}
    }
  })

  ipcMain.handle('get-all-menu', async(_,)=>{
    try{
      const menuItems = await menu.getAllMenu();
      return {success: true, MenuItems: menuItems}
    }catch (err){
      return { success: false, error: err || err };
    }
  })

  ipcMain.handle('get-menu-names', async(_,)=>{
    try{
      const menuItems = await menu.getMenuNames();
      return {success: true, MenuItems: menuItems}
    }catch (err){
      return { success: false, error: err || err };
    }
  })

  ipcMain.handle('update-menu-item', async (event, updatedItem) => {
    try {
      await menu.updatedItem(ItemID, field, value);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('delete-menu-item', async (_, itemId) => {
    try {
     await menu.deleteItem(itemId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });


  ipcMain.handle('handle-order',async (_,
      customerName,
      phoneNumber,
      email,
      userID,
      orderTimestamp,
      totalAmount,
      subTotal,
      taxAmount,
      taxRate,
      items
    ) => {
      try {
        // Ensure the items array is not empty
        if (items.length === 0) {
          return { success: false, message: "Order must include at least one item." };
        }
  
        // Check or create customer
        let customerID = await customer.getCustomerByEmail(email);
        if (!customerID) {
          customerID = await customer.addCustomer(customerName, phoneNumber, email);
          customerID = await customer.getCustomerByEmail(email);
        }
  
        // Create order and get the order ID
        const orderID = await orders.createOrder(
          userID,
          customerID,
          orderTimestamp,
          totalAmount,
          subTotal,
          taxAmount,
          taxRate
        );
  
        // Create order items using OrderItems class
        await orderItems.createOrderItems(orderID, items);
  
        return { success: true, message: "Order created successfully" };
      } catch (err) {
        console.error("Error handling order:", err);
        return { success: false, error: err };
      }
    }
  );
  
  ipcMain.handle('get-analytics', async () => {
    try {
      // Fetch the user order summary
      await analytics.createViews();
      const summary = await analytics.getUserOrderSummary();
      console.log(summary);
      
      return summary; // Return the summary data to the renderer process
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to fetch analytics data'); // Propagate the error to the renderer
    }
  });

  ipcMain.on('route-changed', (event, pathname) => {
    console.log(`Route changed to: ${pathname}`);
    if (mainWindow) {
      mainWindow.reload(); // Reload the BrowserWindow
    }
  });
};

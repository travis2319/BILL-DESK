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

  ipcMain.handle('check-user-exists', async (_, email) => {
    try{
      return {success:true,exists: await auth.checkUserExists(email)}
    }catch(err){
      return {success:false,error:err}
    }
});

ipcMain.handle('update-password', async (_, { email, newPassword }) => {
  try {
      await auth.updateUserPassword(email, newPassword);
      return { success: true };
  } catch (error) {
      return { success: false, error: error.message };
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

  ipcMain.handle('get-multiple-orders', async(_,orderID)=>{
    try{

      return {success:true,orders:orders}
    }catch(err){
      return {success:false,error:err}
    }
  })

  ipcMain.handle('menu-create', async(_,ItemName,Price,Quantity,QuantityType)=>{
    try{

      console.log(ItemName,Price,Quantity,QuantityType);
       await menu.createTable();
       
       await menu.createMenu(ItemName, Price, Quantity, QuantityType);
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

  ipcMain.handle("update-menu-field", async (event, { menuId, field, value }) => {
    try {
      // Validate inputs
      if (!menuId || !field) {
        throw new Error("Menu ID and field are required.");
      }
  
      // Update the menu item using the appropriate function
      await menu.updateMenuField(menuId, field, value);
  
      return { success: true }; // Return success response
    } catch (error) {
      console.error("Error updating menu item:", error);
      return { success: false, error: error.message }; // Return error response
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


  ipcMain.handle('handle-order', async (_, 
    customerName, 
    phoneNumber, 
    email, 
    userID, 
    orderTimestamp, 
    totalAmount, 
    subTotal, 
    cgstAmount, 
    sgstAmount, 
    cgstRate, 
    sgstRate, 
    items
  ) => {
    try {
      // Ensure the items array is not empty
      if (items.length === 0) {
        return { success: false, message: "Order must include at least one item." };
      }
      
      // Check if the customer exists
      let existingCustomer = await customer.getCustomerByPhone(phoneNumber);
      let customerID;
      
      if (existingCustomer) {
        customerID = existingCustomer.CustomerID; // Extract the correct ID
      
        // Check if name or email needs to be updated
        if (
          (customerName && existingCustomer.CustomerName !== customerName) || 
          (email && existingCustomer.Email !== email)
        ) {
          await customer.updateCustomer(phoneNumber, customerName || existingCustomer.CustomerName, email || existingCustomer.Email);
        }
      } else {
        // If customer doesn't exist, create a new one
        customerID = await customer.addCustomer(customerName, phoneNumber, email);
        const newCustomer = await customer.getCustomerByPhone(phoneNumber);
        customerID = newCustomer.CustomerID;
      }
  
      // Create order and get the order ID
      const orderID = await orders.createOrder(
        userID,
        customerID,
        orderTimestamp,
        totalAmount,
        subTotal,
        cgstAmount,
        sgstAmount,
        cgstRate,
        sgstRate
      );
  
      // Create order items using OrderItems class
      await orderItems.createOrderItems(orderID, items);
  
      return { success: true, message: "Order created successfully" };
    } catch (err) {
      console.error("Error handling order:", err);
      return { success: false, error: err.message || err };
    }
  });
  
  
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

// import * as XLSX from 'xlsx';

// const generateExcel = async (OrdersIDs) => {
//     try {
//         // Fetch data from electron renderer for multiple orders
//         const response = await window.electron.renderer.invoke('orders-get-ById', OrdersIDs);

//         // Check if the response was successful
//         if (!response.success) {
//             throw new Error(response.error);
//         }

//         const ordersData = response.orders; // Assuming this returns an array of order objects

//         // Create a new workbook
//         const workbook = XLSX.utils.book_new();

//         // Format the data for Excel
//         const formattedData = ordersData.map(order => ({
//             'Order ID': order.OrderID,
//             'Order Timestamp': order.TimeStamp,
//             'Tax Rate': order.TaxRate,
//             'Customer Name': order.CustomerName,
//             'Customer Email': order.Email,
//             'Customer Phone Number': order.PhoneNumber,
//             'Items': JSON.stringify(order.Items) // Convert items to JSON string for simplicity
//         }));

//         // Convert data to worksheet
//         const worksheet = XLSX.utils.json_to_sheet(formattedData);

//         // Add worksheet to workbook
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

//         // Generate buffer
//         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

//         // Save file
//         const fileName = `Orders_${new Date().toISOString().split('T')[0]}.xlsx`;
//         await window.electron.renderer.invoke('save-file', {
//             fileName,
//             buffer: excelBuffer
//         });

//         return {
//             success: true,
//             message: `Excel file generated successfully: ${fileName}`
//         };
//     } catch (error) {
//         console.error('Error generating Excel:', error);
//         return {
//             success: false,
//             message: `Failed to generate Excel file: ${error.message}`
//         };
//     }
// };

// export default generateExcel;

import * as XLSX from 'xlsx';

const generateExcel = (orders) => {
  // Preprocess the orders to properly format the Items field
  const formattedOrders = orders.map((order) => {
    const itemsString = order.Items && order.Items.length > 0
      ? order.Items.map(
          (item) =>
            `${item.ItemName} (Price: ${item.ItemPrice}, Qty: ${item.Quantity})`
        ).join('; ') // Combine all items into a single string
      : 'N/A'; // Default if no items are found

    return {
      OrderID: order.OrderID,
      TimeStamp: order.TimeStamp,
      CustomerName: order.CustomerName,
      Email: order.Email,
      PhoneNumber: order.PhoneNumber,
      TotalAmount: order.TotalAmount,
      SubTotal: order.SubTotal,
      TaxRate: order.TaxRate,
      Items: itemsString, // Flattened items as a string
    };
  });

  // Convert the formatted data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedOrders);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  // Write the workbook to a file
  XLSX.writeFile(workbook, 'orders.xlsx');
};

export default generateExcel;

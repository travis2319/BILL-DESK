import React, { useState, useEffect } from "react";
import { generatePDF } from "./generatePDF"; // Import the PDF generation function

const DataTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Type assertion for the response
        const response = await window.electron.ipcRenderer.invoke("order-get-All");
        
        if (response.success && response.orders) {
          setOrders(response.orders);
        } else {
          setError(response.error || "Failed to fetch orders");
        }
      } catch (err) {
        // More robust error handling
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Render error state if applicable
  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error: {error}
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
          }} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6">
      <h1 className="font-medium text-xl mb-3">Orders</h1>
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg shadow overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  {[
                    'OrderID', 
                    'Customer Name', 
                    'Phone Number', 
                    'Email', 
                    'Order Timestamp', 
                    'Total Amount', 
                    'Sub Total', 
                    'Tax Amount', 
                    'Item Name', 
                    'Quantity', 
                    'Invoice'
                  ].map((header) => (
                    <th 
                      key={header}
                      scope="col" 
                      className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 ${
                        header === 'Invoice' ? 'text-end' : ''
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-4 text-center text-sm text-gray-800 dark:text-neutral-200">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.OrderID}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                        {order.OrderID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        {order.CustomerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        {order.PhoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        {order.Email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        {order.OrderTimestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        ${order.TotalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        ${order.SubTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        ${order.TaxAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        {order.ItemNames}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        {order.Quantities}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-blue-600 font-bold hover:text-blue-800">
                        <button
                          type="button"
                          onClick={() => generatePDF(order)}
                          className="inline-flex items-center gap-x-2 px-3 py-1 border rounded-lg border-transparent bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 text-white"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-6 py-4 text-center text-sm text-gray-800 dark:text-neutral-200">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
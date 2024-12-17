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
    <h1 className="font-semibold text-2xl mb-5 text-dark-700 dark:text-dark-400">Orders</h1>
    <div className="overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="border border-blue-200 rounded-xl shadow-md overflow-hidden dark:border-blue-800">
          <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-800">
            <thead className="bg-blue-100 dark:bg-blue-900">
              <tr>
                {[
                  "Order ID",
                  "Customer Name",
                  "Phone",
                  "Email",
                  "Timestamp",
                  "Total",
                  "Sub Total",
                  "Tax",
                  "Items",
                  "Qty",
                  "Invoice",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className={`px-4 py-3 text-left text-sm font-semibold text-blue-800 uppercase dark:text-blue-300 ${
                      header === "Invoice" ? "text-center" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-200 dark:divide-blue-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-6 py-4 text-center text-blue-500 dark:text-blue-300"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.OrderID}
                    className="hover:bg-blue-50 dark:hover:bg-blue-800 transition-all"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-blue-900 dark:text-blue-300">
                      {order.OrderID}
                    </td>
                    <td className="px-4 py-3 text-blue-800 dark:text-blue-300">
                      {order.CustomerName}
                    </td>
                    <td className="px-4 py-3 text-blue-800 dark:text-blue-300">
                      {order.PhoneNumber}
                    </td>
                    <td className="px-4 py-3 truncate max-w-[120px] text-blue-800 dark:text-blue-300">
                      {order.Email}
                    </td>
                    <td className="px-4 py-3 text-blue-800 dark:text-blue-300">
                      {order.OrderTimestamp}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">
                      ${order.TotalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-blue-800 dark:text-blue-300">
                      ${order.SubTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-blue-800 dark:text-blue-300">
                      ${order.TaxAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-blue-800 dark:text-blue-300">
                      {order.ItemNames}
                    </td>
                    <td className="px-4 py-3 text-blue-800 dark:text-blue-300">
                      {order.Quantities}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => generatePDF(order)}
                        className="inline-flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="px-6 py-4 text-center text-dark-500 dark:text-dark-300"
                  >
                    No orders found.
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
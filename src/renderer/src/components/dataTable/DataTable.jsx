
import React, { useState, useEffect } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import ErrorDisplay from "./ErrorDisplay";
import { generatePDF } from "./generatePDF";
import generateExcel from "./generateExcel";

const DataTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke("order-get-All");
        if (response.success && response.orders) {
          // console.log(response.orders);
          setOrders(response.orders);
        } else {
          setError(response.error || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Select all orders on the current page
  const handleSelectAll = () => {
    const currentOrderIDs = currentOrders.map((order) => order.OrderID);
    const areAllSelected = currentOrderIDs.every((id) => selectedOrders.has(id));
    
    setSelectedOrders((prev) => {
      const updated = new Set(prev);
      if (areAllSelected) {
        currentOrderIDs.forEach((id) => updated.delete(id));
      } else {
        currentOrderIDs.forEach((id) => updated.add(id));
      }
      return updated;
    });
  };

  // Select or deselect a single order
  const handleSelect = (id) => {
    setSelectedOrders((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  // Generate a PDF for a single order
  const handleGeneratePDF = async (orderId) => {
    try {
      const response = await window.electron.ipcRenderer.invoke("order-get-ById", orderId);
      if (response.success && response.order) {
        console.log(response.order);
        
        await generatePDF(response.order);
      } else {
        console.error(`Failed to generate PDF for Order ${orderId}: ${response.error}`);
      }
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  // Bulk download PDFs for selected orders
  const handleBulkDownload = async () => {
    try {
      for (const orderId of selectedOrders) {
        const response = await window.electron.ipcRenderer.invoke("order-get-ById", orderId);
        if (response.success && response.order) {
          await generatePDF(response.order);
        }
      }
      console.log(`Successfully downloaded PDFs for selected orders.`);
      setSelectedOrders(new Set());
    } catch (err) {
      console.error("Error in bulk download:", err);
    }
  };

  // Bulk download selected orders as Excel
const handleBulkExcelDownload = async () => {
  try {
    const selectedOrdersData = [];

    for (const orderId of selectedOrders) {
      const response = await window.electron.ipcRenderer.invoke("order-get-ById", orderId);
      console.log("bulk excel:");
      console.log(response);
      
      if (response.success && response.order) {
        selectedOrdersData.push(response.order);
      }
    }

    if (selectedOrdersData.length > 0) {
      await generateExcel(selectedOrdersData); // Call the generateExcel function
      console.log("Successfully downloaded Excel file for selected orders.");
    } else {
      console.warn("No data available to export.");
    }

    setSelectedOrders(new Set()); // Clear selection after download
  } catch (err) {
    console.error("Error in bulk Excel download:", err);
  }
};

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  if (error) {
    return <ErrorDisplay error={error} setError={setError} setLoading={setLoading} />;
  }

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-semibold text-2xl text-dark-700 dark:text-dark-400">Orders</h1>
        {selectedOrders.size > 0 && (
  <div className="flex gap-4">
    <button
      onClick={handleBulkDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Download Selected PDFs ({selectedOrders.size})
    </button>
    <button
      onClick={handleBulkExcelDownload}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Download Selected Excel ({selectedOrders.size})
    </button>
  </div>
)}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="border border-blue-200 rounded-xl shadow-md overflow-hidden dark:border-blue-800">
            <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-800">
              <TableHeader
                currentOrders={currentOrders}
                selectedOrders={selectedOrders}
                handleSelectAll={handleSelectAll}
              />
              <tbody className="divide-y divide-blue-200 dark:divide-blue-800">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-4 text-center text-blue-500 dark:text-blue-300">
                      Loading orders...
                    </td>
                  </tr>
                ) : currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <TableRow
                      key={order.OrderID}
                      order={order}
                      selectedOrders={selectedOrders}
                      handleSelect={handleSelect}
                      handleGeneratePDF={handleGeneratePDF}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="px-6 py-4 text-center text-dark-500 dark:text-dark-300">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;



// import React, { useState, useEffect } from "react";
// import { generatePDF } from "./generatePDF"; // Import the PDF generation function

// const DataTable = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5; // Set how many items you want per page

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await window.electron.ipcRenderer.invoke("order-get-All");
        
//         if (response.success && response.orders) {
//           setOrders(response.orders);
//         } else {
//           setError(response.error || "Failed to fetch orders");
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An unexpected error occurred");
//         console.error("Error fetching orders:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // Function to handle receipt generation
//   const handleGeneratePDF = async (orderID) => {
//     try {
//       const response = await window.electron.ipcRenderer.invoke("order-get-ById", orderID);
//       if (response.success && response.order) {
//         await generatePDF(response.order);
//       } else {
//         console.error(response.error || "Failed to fetch order details for PDF generation");
//       }
//     } catch (error) {
//       console.error("Error fetching order details for PDF:", error);
//     }
//   };

//   // Calculate total pages
//   const totalPages = Math.ceil(orders.length / itemsPerPage);

//   // Get current orders for the page
//   const indexOfLastOrder = currentPage * itemsPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

//   // Render error state if applicable
//   if (error) {
//     return (
//       <div className="p-6 text-red-600">
//         Error: {error}
//         <button 
//           onClick={() => {
//             setError(null);
//             setLoading(true);
//           }} 
//           className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col p-6">
//       <h1 className="font-semibold text-2xl mb-5 text-dark-700 dark:text-dark-400">Orders</h1>
//       <div className="overflow-x-auto">
//         <div className="min-w-full inline-block align-middle">
//           <div className="border border-blue-200 rounded-xl shadow-md overflow-hidden dark:border-blue-800">
//             <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-800">
//               <thead className="bg-blue-100 dark:bg-blue-900">
//                 <tr>
//                   {[
//                     "Order ID",
//                     "Customer Name",
//                     "Phone",
//                     "Email",
//                     "Timestamp",
//                     "Total",
//                     "Sub Total",
//                     "Tax",
//                     "Items",
//                     "Qty",
//                     "Invoice",
//                   ].map((header) => (
//                     <th
//                       key={header}
//                       scope="col"
//                       className={`px-4 py-3 text-left text-sm font-semibold text-white uppercase dark:text-white ${
//                         header === "Invoice" ? "text-center" : ""
//                       }`}
//                     >
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-blue-200 dark:divide-blue-800">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={11} className="px-6 py-4 text-center text-blue-500 dark:text-blue-300">
//                       Loading orders...
//                     </td>
//                   </tr>
//                 ) : currentOrders.length > 0 ? (
//                   currentOrders.map((order) => (
//                     <tr key={order.OrderID} className="hover:bg-blue-50 dark:hover:bg-blue-300 transition-all">
//                       <td className="px-4 py-3 whitespace-nowrap text-black dark:text-black">{order.OrderID}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.CustomerName}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.PhoneNumber}</td>
//                       <td className="px-4 py-3 truncate max-w-[120px] text-black dark:text-black">{order.Email}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.OrderTimestamp}</td>
//                       <td className="px-4 py-3 font-semibold text-black dark:text-black">{order.TotalAmount.toFixed(2)}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.SubTotal.toFixed(2)}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.TaxAmount.toFixed(2)}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.ItemNames}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.Quantities}</td>
//                       <td className="px-4 py-3 text-center">
//                         <button
//                           onClick={() => handleGeneratePDF(order.OrderID)}
//                           className="inline-flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
//                         >
//                           Receipt
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={11} className="px-6 py-4 text-center text-dark-500 dark:text-dark-300">
//                       No orders found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="flex justify-between p-4">
//                 <button 
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
//                 >
//                   Previous
//                 </button>

//                 {/* Page Numbers */}
//                 {Array.from({ length: totalPages }, (_, index) => (
//                   <button 
//                     key={index + 1} 
//                     onClick={() => setCurrentPage(index + 1)} 
//                     className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-400'} text-white`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}

//                 <button 
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;

// import React, { useState, useEffect } from "react";
// import { generatePDF } from "./generatePDF";

// const DataTable = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrders, setSelectedOrders] = useState(new Set());
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await window.electron.ipcRenderer.invoke("order-get-All");
//         if (response.success && response.orders) {
//           setOrders(response.orders);
//         } else {
//           setError(response.error || "Failed to fetch orders");
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An unexpected error occurred");
//         console.error("Error fetching orders:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // Function to handle bulk receipt generation
//   const handleBulkDownload = async () => {
//     try {
//       for (const orderID of selectedOrders) {
//         const response = await window.electron.ipcRenderer.invoke("order-get-ById", orderID);
//         if (response.success && response.order) {
//           await generatePDF(response.order);
//         }
//       }
//       setSelectedOrders(new Set());
//     } catch (error) {
//       console.error("Error generating bulk PDFs:", error);
//     }
//   };

//   // Handle single receipt generation
//   const handleGeneratePDF = async (orderID) => {
//     try {
//       const response = await window.electron.ipcRenderer.invoke("order-get-ById", orderID);
//       if (response.success && response.order) {
//         await generatePDF(response.order);
//       }
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     }
//   };

//   // Handle checkbox selection
//   const handleSelect = (orderID) => {
//     const newSelected = new Set(selectedOrders);
//     if (newSelected.has(orderID)) {
//       newSelected.delete(orderID);
//     } else {
//       newSelected.add(orderID);
//     }
//     setSelectedOrders(newSelected);
//   };

//   // Handle select all for current page
//   const handleSelectAll = () => {
//     const currentPageOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
//     const allSelected = currentPageOrders.every(order => selectedOrders.has(order.OrderID));
    
//     if (allSelected) {
//       const newSelected = new Set(selectedOrders);
//       currentPageOrders.forEach(order => newSelected.delete(order.OrderID));
//       setSelectedOrders(newSelected);
//     } else {
//       const newSelected = new Set(selectedOrders);
//       currentPageOrders.forEach(order => newSelected.add(order.OrderID));
//       setSelectedOrders(newSelected);
//     }
//   };

//   // Calculate pagination
//   const totalPages = Math.ceil(orders.length / itemsPerPage);
//   const indexOfLastOrder = currentPage * itemsPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

//   if (error) {
//     return (
//       <div className="p-6 text-red-600">
//         Error: {error}
//         <button 
//           onClick={() => {
//             setError(null);
//             setLoading(true);
//           }} 
//           className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col p-6 ">
//       <div className="flex justify-between items-center mb-5">
//         <h1 className="font-semibold text-2xl text-dark-700 dark:text-dark-400">Orders</h1>
//         {selectedOrders.size > 0 && (
//           <button
//             onClick={handleBulkDownload}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Download Selected ({selectedOrders.size})
//           </button>
//         )}
//       </div>
      
//       <div className="overflow-x-auto">
//         <div className="min-w-full inline-block align-middle">
//           <div className="border border-blue-200 rounded-xl shadow-md overflow-hidden dark:border-blue-800">
//             <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-800">
//               <thead className="bg-blue-100 dark:bg-blue-900">
//                 <tr>
//                   <th className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={currentOrders.length > 0 && currentOrders.every(order => selectedOrders.has(order.OrderID))}
//                       onChange={handleSelectAll}
//                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                     />
//                   </th>
//                   {[
//                     "Order ID",
//                     "Customer Name",
//                     "Phone",
//                     "Email",
//                     "Timestamp",
//                     "Total",
//                     "Sub Total",
//                     "Tax",
//                     "Items",
//                     "Qty",
//                     "Invoice",
//                   ].map((header) => (
//                     <th
//                       key={header}
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-semibold text-white uppercase dark:text-white"
//                     >
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-blue-200 dark:divide-blue-800">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={12} className="px-6 py-4 text-center text-blue-500 dark:text-blue-300">
//                       Loading orders...
//                     </td>
//                   </tr>
//                 ) : currentOrders.length > 0 ? (
//                   currentOrders.map((order) => (
//                     <tr key={order.OrderID} className="hover:bg-blue-50 dark:hover:bg-blue-300 transition-all">
//                       <td className="px-4 py-3">
//                         <input
//                           type="checkbox"
//                           checked={selectedOrders.has(order.OrderID)}
//                           onChange={() => handleSelect(order.OrderID)}
//                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                         />
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-black dark:text-black">{order.OrderID}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.CustomerName}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.PhoneNumber}</td>
//                       <td className="px-4 py-3 truncate max-w-[120px] text-black dark:text-black">{order.Email}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.OrderTimestamp}</td>
//                       <td className="px-4 py-3 font-semibold text-black dark:text-black">{order.TotalAmount.toFixed(2)}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.SubTotal.toFixed(2)}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.TaxAmount.toFixed(2)}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.ItemNames}</td>
//                       <td className="px-4 py-3 text-black dark:text-black">{order.Quantities}</td>
//                       <td className="px-4 py-3 text-center">
//                         <button
//                           onClick={() => handleGeneratePDF(order.OrderID)}
//                           className="inline-flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
//                         >
//                           Receipt
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={12} className="px-6 py-4 text-center text-dark-500 dark:text-dark-300">
//                       No orders found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             {totalPages > 1 && (
//               <div className="flex justify-between p-4">
//                 <button 
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
//                 >
//                   Previous
//                 </button>

//                 {Array.from({ length: totalPages }, (_, index) => (
//                   <button 
//                     key={index + 1} 
//                     onClick={() => setCurrentPage(index + 1)} 
//                     className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-400'} text-white`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}

//                 <button 
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;





// import React, { useState, useEffect } from "react";
// import TableHeader from "./TableHeader";
// import TableRow from "./TableRow";
// import Pagination from "./Pagination";
// import ErrorDisplay from "./ErrorDisplay";

// const DataTable = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrders, setSelectedOrders] = useState(new Set());

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await window.electron.ipcRenderer.invoke("order-get-All");
//         if (response.success && response.orders) {
//           setOrders(response.orders);
//         } else {
//           setError(response.error || "Failed to fetch orders");
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An unexpected error occurred");
//         console.error("Error fetching orders:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleSelectAll = () => {
//     const currentOrderIDs = currentOrders.map(order => order.OrderID);
//     if (currentOrderIDs.every(id => selectedOrders.has(id))) {
//       setSelectedOrders(prev => {
//         const updated = new Set(prev);
//         currentOrderIDs.forEach(id => updated.delete(id));
//         return updated;
//       });
//     } else {
//       setSelectedOrders(prev => {
//         const updated = new Set(prev);
//         currentOrderIDs.forEach(id => updated.add(id));
//         return updated;
//       });
//     }
//   };

//   const handleSelect = (id) => {
//     setSelectedOrders(prev => {
//       const updated = new Set(prev);
//       if (updated.has(id)) {
//         updated.delete(id);
//       } else {
//         updated.add(id);
//       }
//       return updated;
//     });
//   };

//   const handleGeneratePDF = async (orderId) => {
//     try {
//       // Replace with the actual logic to generate a PDF
//       const response = await window.electron.ipcRenderer.invoke("order-get-ById", orderID);
// if (response.success) {
//         console.log(`PDF for Order ${orderId} generated successfully.`);
//       } else {
//         console.error(`Failed to generate PDF for Order ${orderId}: ${response.error}`);
//       }
//     } catch (err) {
//       console.error("Error generating PDF:", err);
//     }
//   };

//   const handleBulkDownload = async (selectedOrders) => {
//     try {
//       const orderIds = Array.from(selectedOrders);
//       // Replace with the actual logic for bulk downloading
//         const response = await window.electron.ipcRenderer.invoke("order-get-ById", orderID);
// if (response.success) {
//         console.log(`Bulk download successful for Orders: ${orderIds.join(", ")}`);
//       } else {
//         console.error(`Failed to download selected orders: ${response.error}`);
//       }
//     } catch (err) {
//       console.error("Error in bulk download:", err);
//     }
//   };

//   const totalPages = Math.ceil(orders.length / itemsPerPage);
//   const indexOfLastOrder = currentPage * itemsPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

//   if (error) {
//     return <ErrorDisplay error={error} setError={setError} setLoading={setLoading} />;
//   }

//   return (
//     <div className="flex flex-col p-6 ">
//       <div className="flex justify-between items-center mb-5">
//         <h1 className="font-semibold text-2xl text-dark-700 dark:text-dark-400">Orders</h1>
//         {selectedOrders.size > 0 && (
//           <button
//             onClick={() => handleBulkDownload(selectedOrders)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Download Selected ({selectedOrders.size})
//           </button>
//         )}
//       </div>

//       <div className="overflow-x-auto">
//         <div className="min-w-full inline-block align-middle">
//           <div className="border border-blue-200 rounded-xl shadow-md overflow-hidden dark:border-blue-800">
//             <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-800">
//               <TableHeader
//                 currentOrders={currentOrders}
//                 selectedOrders={selectedOrders}
//                 handleSelectAll={handleSelectAll}
//               />
//               <tbody className="divide-y divide-blue-200 dark:divide-blue-800">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={12} className="px-6 py-4 text-center text-blue-500 dark:text-blue-300">
//                       Loading orders...
//                     </td>
//                   </tr>
//                 ) : currentOrders.length > 0 ? (
//                   currentOrders.map((order) => (
//                     <TableRow
//                       key={order.OrderID}
//                       order={order}
//                       selectedOrders={selectedOrders}
//                       handleSelect={handleSelect}
//                       handleGeneratePDF={handleGeneratePDF}
//                     />
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={12} className="px-6 py-4 text-center text-dark-500 dark:text-dark-300">
//                       No orders found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             {totalPages > 1 && (
//               <Pagination
//                 totalPages={totalPages}
//                 currentPage={currentPage}
//                 setCurrentPage={setCurrentPage}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default DataTable;
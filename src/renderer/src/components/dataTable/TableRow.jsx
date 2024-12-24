const TableRow = ({ order, selectedOrders, handleSelect, handleGeneratePDF }) => (
    <tr key={order.OrderID} className="hover:bg-blue-50 dark:hover:bg-blue-300 transition-all">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selectedOrders.has(order.OrderID)}
          onChange={() => handleSelect(order.OrderID)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-black dark:text-black">{order.OrderID}</td>
      <td className="px-4 py-3 text-black dark:text-black">{order.CustomerName}</td>
      <td className="px-4 py-3 text-black dark:text-black">{order.PhoneNumber}</td>
      <td className="px-4 py-3 truncate max-w-[120px] text-black dark:text-black">{order.Email}</td>
      <td className="px-4 py-3 text-black dark:text-black">{order.OrderTimestamp}</td>
      <td className="px-4 py-3 font-semibold text-black dark:text-black">{order.TotalAmount.toFixed(2)}</td>
      <td className="px-4 py-3 text-black dark:text-black">{order.SubTotal.toFixed(2)}</td>
      <td className="px-4 py-3 text-black dark:text-black">{order.TaxAmount.toFixed(2)}</td>
      <td className="px-4 py-3 text-black dark:text-black">{order.ItemNames}</td>
      <td className="px-4 py-3 text-black dark:text-black">{order.Quantities}</td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => handleGeneratePDF(order.OrderID)}
          className="inline-flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
        >
          Receipt
        </button>
      </td>
    </tr>
  );

export default TableRow;
const TableHeader = ({ currentOrders, selectedOrders, handleSelectAll }) => (
    <thead className="bg-blue-100 dark:bg-blue-900">
      <tr>
        <th className="px-4 py-3">
          <input
            type="checkbox"
            checked={currentOrders.length > 0 && currentOrders.every(order => selectedOrders.has(order.OrderID))}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </th>
        {[
          "Order ID",
          "Customer Name",
          "Phone",
          "Email",
          "Timestamp",
          "Total",
          "Sub Total",
          "TaxAmount",
          "TaxRate",
          "Items",
          "Qty",
          "Invoice",
        ].map((header) => (
          <th
            key={header}
            scope="col"
            className="px-4 py-3 text-left text-sm font-semibold text-white uppercase dark:text-white"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
  export default TableHeader;
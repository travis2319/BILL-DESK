import React, { useState, useEffect } from "react";
import MenuModal from './MenuModal';

const MenuTable = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke("get-all-menu");
        if (response.success) {
          setMenus(response.MenuItems);
          setError(null);
        } else {
          setError(response.error || "Failed to fetch menu items");
          console.error("Failed to fetch menu items:", response.error);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        console.error("Error fetching menu items:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddMenuItem = (newItem) => {
    setMenus((prevMenus) => [...prevMenus, newItem]);
    setIsDialogOpen(false);
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-800 dark:text-neutral-200">
            Loading...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-sm text-red-600">
            Error: {error}
          </td>
        </tr>
      );
    }

    if (menus.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-800 dark:text-neutral-200">
            No menu items found
          </td>
        </tr>
      );
    }

    return menus.map((menu) => (
      <tr key={menu.ItemID}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
          {menu.ItemID}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {menu.ItemName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {menu.Price.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {menu.Quantity}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {menu.IsAvailable ? 'Available' : 'Unavailable'}
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex flex-col h-screen">
      <MenuModal 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onAdd={handleAddMenuItem}
      />
      <div className="flex justify-between items-center p-6">
        <h2 className="font-medium text-xl">Menu Items</h2>
        <button 
          onClick={() => setIsDialogOpen(true)} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Add Menu Item
        </button>
      </div>
      <div className="m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg shadow overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Menu ID</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Name</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Price</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {renderTableContent()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuTable;
import React, { useState, useEffect } from "react";
import MenuModal from './MenuModal';

const MenuTable = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenuItems = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleUpdateField = async (itemId, field, value) => {
    try {
      const response = await window.electron.ipcRenderer.invoke("update-menu-field", {
        menuId: itemId,
        field,
        value
      });

      if (response.success) {
        setMenus(prevMenus =>
          prevMenus.map(menu =>
            menu.ItemID === itemId
              ? { ...menu, [field]: value }
              : menu
          )
        );
        setError(null);
      } else {
        setError(response.error || `Failed to update ${field}`);
        console.error(`Failed to update ${field}:`, response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error(`Error updating ${field}:`, errorMessage);
    }
  };

  const handleAddMenuItem = async (newItem) => {
    setMenus((prevMenus) => [...prevMenus, newItem]);
    setIsDialogOpen(false);
    await fetchMenuItems(); // Refresh the list after adding
  };

  const handleDeleteMenuItem = async (itemId) => {
    try {
      const response = await window.electron.ipcRenderer.invoke("delete-menu-item", itemId);
      if (response.success) {
        await fetchMenuItems(); // Refresh the menu items after successful deletion
        setError(null);
      } else {
        setError(response.error || "Failed to delete menu item");
        console.error("Failed to delete menu item:", response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error("Error deleting menu item:", errorMessage);
    }
  };

  const handleEditClick = (menu) => {
    console.log(menu);
    setEditingItem({
      menuId: menu.ItemID,
      menuName: menu.ItemName,
      price: menu.Price,
      quantity: menu.Quantity,
      quantityType: menu.QuantityType
    });
    setIsDialogOpen(true);
  };

  const handleEditSubmit = async (editedFields) => {
    const { menuId } = editingItem;
    
    try {
      // Update each field individually
      for (const [field, value] of Object.entries(editedFields)) {
        if (value !== undefined) {
          await handleUpdateField(menuId, field, value);
        }
      }
      
      setIsDialogOpen(false);
      setEditingItem(null);
      await fetchMenuItems(); // Refresh the list after editing
    } catch (err) {
      console.error("Error during update:", err);
      setError("Failed to update one or more fields");
    }
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
          <td colSpan={5} className="px-6 py-4 text-center text-bold font-sm text-dark-800 dark:text-dark-500">
            No menu items found
          </td>
        </tr>
      );
    }

    return menus.map((menu) => (
      <tr key={menu.ItemID} className="bg-blue-200 hover:bg-blue-300">
        <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-dark-800 dark:text-dark-800">
          {menu.ItemID}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-800 dark:text-dark-800">
          {menu.ItemName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-800 dark:text-dark-800">
          {menu.Price.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-800 dark:text-dark-800">
          {menu.Quantity} {menu.QuantityType}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-800 dark:text-dark-800">
          <div className="flex space-x-4">
            <button
              onClick={() => handleEditClick(menu)}
              className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteMenuItem(menu.ItemID)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-700"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex flex-col h-screen">
      <MenuModal 
        isOpen={isDialogOpen} 
        onClose={() => {
          setIsDialogOpen(false);
          setEditingItem(null);
        }} 
        onAdd={handleAddMenuItem}
        onEdit={handleEditSubmit}
        editingItem={editingItem}
      />
      <div className="flex justify-between items-center p-6">
        <h2 className="font-semibold text-2xl text-dark-700 dark:text-dark-400">Menu Items</h2>
        <button 
          onClick={() => setIsDialogOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
        >
          Add Menu Item
        </button>
      </div>
      <div className="m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-blue-200 rounded-xl shadow-md overflow-hidden dark:border-blue-700">
            <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-800">
              <thead>
                <tr className="bg-blue-900">
                  <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-white uppercase">
                    Menu ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-white uppercase">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-white uppercase">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-white uppercase">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-white uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200 dark:divide-blue-700">
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
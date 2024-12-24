import { useState, useEffect } from 'react';
import Modal from 'react-modal';

const MenuModal = ({ isOpen, onClose, onAdd, onEdit, editingItem }) => {
  const [item, setItem] = useState({
    ItemName: '',
    Price: 0,
    Quantity: 1,
    IsAvailable: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Populate the form when editingItem is provided
  useEffect(() => {
    if (editingItem) {
      setItem({
        ItemName: editingItem.menuName || '',
        Price: editingItem.price || 0,
        Quantity: editingItem.quantity || 1,
        IsAvailable: editingItem.isAvailable ?? true,
      });
    } else {
      resetForm(); // Reset if not editing
    }
  }, [editingItem]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Validate numeric inputs
      if (isNaN(item.Price) || isNaN(item.Quantity)) {
        alert('Please enter valid numeric values for price and quantity.');
        return;
      }

      if (editingItem) {
        // Editing existing item
        await onEdit({
          menuId: editingItem.menuId,
          menuName: item.ItemName,
          price: item.Price,
          quantity: item.Quantity,
          isAvailable: item.IsAvailable,
        });
      } else {
        // Adding new item
        const response = await window.electron.ipcRenderer.invoke('menu-create', item.ItemName, item.Price, item.Quantity, item.IsAvailable);
        
        if (response.success) {
          onAdd({
            ...item,
            ItemID: response.ItemID, // Assuming the backend returns the new item's ID
          });
          resetForm();
        } else {
          alert(response.error || 'Failed to add menu item');
        }
      }
    } catch (error) {
      console.error('Error submitting menu item:', error);
      alert('An unexpected error occurred while submitting the menu item');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setItem({ ItemName: '', Price: 0, Quantity: 1, IsAvailable: true });
  };

  const handleInputChange = (field, value) => {
    setItem(prevItem => ({ ...prevItem, [field]: value }));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name
              <input
                type="text"
                value={item.ItemName}
                onChange={(e) => handleInputChange('ItemName', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter item name"
                disabled={isLoading}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
              <input
                type="number"
                value={item.Price}
                onChange={(e) => handleInputChange('Price', parseFloat(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter price"
                min="0"
                step="0.01"
                disabled={isLoading}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
              <input
                type="number"
                value={item.Quantity}
                onChange={(e) => handleInputChange('Quantity', parseInt(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter quantity"
                min="0"
                disabled={isLoading}
              />
            </label>
          </div>

          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={item.IsAvailable}
                onChange={(e) => handleInputChange('IsAvailable', e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
                disabled={isLoading}
              />
              <span className="ml-2 text-gray-700">Available</span>
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (editingItem ? 'Saving...' : 'Adding...') : (editingItem ? 'Save Changes' : 'Add Item')}
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MenuModal;

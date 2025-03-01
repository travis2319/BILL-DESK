import { useState, useEffect } from 'react';
import Modal from 'react-modal';

const predefinedTypes = ['kg', 'pieces', 'plate', 'bowl'];

const MenuModal = ({ isOpen, onClose, onAdd, onEdit, editingItem }) => {
  const [item, setItem] = useState({
    ItemName: '',
    Price: 0,
    Quantity: 1,
    QuantityType: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      console.log('Editing item:', editingItem); // Debug log for editing item
      setItem({
        // ItemID: editingItem.ItemID,
        ItemName: editingItem.menuName || '',
        Price: editingItem.price || 0,
        Quantity: editingItem.quantity || 1,
        QuantityType: editingItem.quantityType || '',
      });
    } else {
      resetForm();
    }
  }, [editingItem]);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      console.log('Submitting item:', item); // Debug log for item being submitted

      if (isNaN(item.Price) || item.Price < 0 || isNaN(item.Quantity) || item.Quantity < 1) {
        alert('Please enter valid numeric values for price (>= 0) and quantity (>= 1).');
        return;
      }

      if (editingItem) {
        await onEdit({
          ItemID: editingItem.ItemID,
          ItemName: item.ItemName,
          price: item.Price,
          quantity: item.Quantity,
          quantityType: item.QuantityType,
        });
      } else {
        const response = await window.electron.ipcRenderer.invoke('menu-create', item.ItemName, item.Price, item.Quantity, item.QuantityType);

        if (response.success) {
          onAdd({
            ...item,
            ItemID: response.ItemID,
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
    console.log('Resetting form'); // Debug log for resetting form
    setItem({ ItemName: '', Price: 0, Quantity: 1, QuantityType: '' });
  };

  const handleInputChange = (field, value) => {
    console.log(`Changing ${field} to ${value}`); // Debug log for input changes
    setItem((prevItem) => ({ ...prevItem, [field]: value }));
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
                aria-label="Item Name"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
              <input
                type="number"
                value={item.Price}
                onChange={(e) => handleInputChange('Price', Math.max(0, parseFloat(e.target.value)))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter price"
                min="0"
                step="0.01"
                disabled={isLoading}
                aria-label="Price"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
              <input
                type="number"
                value={item.Quantity}
                onChange={(e) => handleInputChange('Quantity', Math.max(1, parseInt(e.target.value)))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter quantity"
                min="1"
                disabled={isLoading}
                aria-label="Quantity"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Type
              <select
                value={item.QuantityType}
                onChange={(e) => handleInputChange('QuantityType', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={isLoading}
                aria-label="Quantity Type"
              >
                <option value="" disabled>Select quantity type</option>
                {predefinedTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className={`flex-1 px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
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

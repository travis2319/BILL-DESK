import { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Assumes you're using react-modal
import { format } from 'date-fns';

const OrderModal = ({ isOpen, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: '1', price: 0 }]); // Added price field
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [currentItemInput, setCurrentItemInput] = useState('');
  const [currentItemIndex, setCurrentItemIndex] = useState(null); // Track which item index is being edited

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('get-menu-names');
        
        if (response.success) {
          console.log(response.MenuItems);
          setMenuItems(response.MenuItems);
        }
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        setMenuItems([]);
      }
    };
    if (isOpen) {
      fetchMenuItems();
    }
  }, [isOpen]);

  // Filter menu items based on current input
  useEffect(() => {
    if (currentItemInput) {
      const filtered = menuItems.filter(item =>
        item.ItemName.toLowerCase().includes(currentItemInput.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    } else {
      setFilteredMenuItems([]);
    }
  }, [currentItemInput, menuItems]);

  const resetForm = () => {
    console.log('Resetting form');
    setCustomerName('');
    setPhoneNumber('');
    setEmail('');
    setItems([{ name: '', quantity: '1', price: 0 }]); // Reset items
    setCurrentItemInput('');
    setFilteredMenuItems([]);
    setCurrentItemIndex(null);
  };

  const handleAddItem = () => {
    // Create a new item with default values
    const newItem = { name: '', quantity: '1', price: 0 };
    
    // Add the new item to the items array
    setItems([...items, newItem]);
    
    // Reset current input and filtered items
    resetCurrentItem();
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    console.log(`Updating item at index ${index}, field: ${field}, value: ${value}`);
    const newItems = [...items];

    // Update quantity and calculate new price if field is 'quantity'
    if (field === 'quantity') {
        const quantity = parseInt(value, 10);
        newItems[index].quantity = isNaN(quantity) ? 1 : quantity; // Default to 1 if NaN
        newItems[index].price = newItems[index].price; // Keep the original price
    } else {
        newItems[index][field] = value;
    }

    // If the item has a name (and thus a price), update the total price based on quantity
    if (newItems[index].name) {
        const menuItem = menuItems.find(item => item.ItemName === newItems[index].name);
        if (menuItem) {
            newItems[index].price = menuItem.Price * newItems[index].quantity; // Update price based on quantity
        }
    }

    setItems(newItems);
    console.log('Updated items:', newItems);
};


  const resetCurrentItem = () => {
    setCurrentItemInput(''); // Clear input after adding
    setFilteredMenuItems([]); // Clear filtered items
    setCurrentItemIndex(null); // Reset current item index
  };

  const handleSelectMenuItem = (menuItem) => {
    if (currentItemIndex !== null) {
      const newItems = [...items];
      newItems[currentItemIndex].name = menuItem.ItemName; // Set selected menu item's name
      newItems[currentItemIndex].price = menuItem.Price; // Set selected menu item's price
      setItems(newItems);
      resetCurrentItem(); // Reset input and filtered items
    }
  };

  const handleSubmit = async () => {
    // Filter out incomplete items
    const validItems = items.filter(item => item.name && item.quantity);
    if (validItems.length === 0) {
      alert('Please add at least one valid item.');
      return;
    }
    const subTotal = validItems.reduce((total, item) => total + (parseFloat(item.quantity) * item.price), 0);
    const taxAmount = subTotal * 0.1; // Assuming tax is 10% of subtotal
    const totalAmount = subTotal + taxAmount; // Total amount is subtotal plus tax
    // Prepare order data
    const orderData = {
      customerName,
      phoneNumber,
      email,
      items: validItems.map(item => ({
        name: item.name,
        quantity: parseInt(item.quantity, 10),
        price: item.price,
      })),
      orderTimestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      userID: 1,
      totalAmount,
      subTotal,
      taxAmount
    };

    console.log('Order Taken:', orderData);

    try {
      // Send order to main process via IPC
      const result = await window.electron.ipcRenderer.invoke(
        'handle-order',
        orderData.customerName,
        orderData.phoneNumber,
        orderData.email,
        orderData.userID,
        orderData.orderTimestamp,
        orderData.totalAmount,
        orderData.subTotal,
        orderData.taxAmount,
        orderData.items
      );

      if (result.success) {
        console.log(result.message);
        alert(result.message);
        resetForm();
        onClose();
      } else {
        console.error('Failed to create order:', result);
        alert('Failed to create order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order');
    }
  };

  const handleClose = () => {
    console.log('Closing modal');
    resetForm();
    onClose();
  };

  console.log('Modal is open:', isOpen);

  return (
    <Modal isOpen={isOpen} onRequestClose={handleClose} ariaHideApp={false}>
      <div className="p-6 bg-gray-100 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create Order</h2>
        
        {/* Customer Information */}
        <div className="mb-4 flex flex-wrap space-x-4">
          <label className="block text-sm font-medium text-gray-700 w-1/3">
            Customer Name:
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700 w-1/3">
            Phone Number:
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700 w-1/3">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </label>
        </div>

        {/* Items Section */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Item Name:
                {/* Autocomplete Input */}
                <input
                  type="text"
                  value={item.name || currentItemInput}
                  onChange={(e) => {
                    handleItemChange(index, 'name', e.target.value); 
                    setCurrentItemInput(e.target.value); 
                    setCurrentItemIndex(index); // Track which index is being edited
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {/* Displaying Filtered Menu Items */}
                {filteredMenuItems.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 mt-1 max-h-[150px] overflow-auto z-[1000]">
                    {filteredMenuItems.map((menuItem, i) => (
                      <li key={i} 
                          onClick={() => handleSelectMenuItem(menuItem)} 
                          className="px-3 py-2 hover:bg-gray-200 cursor-pointer">
                        {menuItem.ItemName}
                      </li>
                    ))}
                  </ul>
                )}
              </label>

              {/* Price Display */}
              <div className="block text-sm font-bold text-gray700 w-[100px]">
                Price: {item.price.toFixed(2)} {/* Display the price of the item */}
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Quantity:
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="mt-1 block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </label>
              
              <button
                onClick={() => handleDeleteItem(index)}
                className="px-2 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={handleAddItem} // Correctly adds a new item here
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[100px]"
          >
            Add Item
          </button>
        </div>

        {/* Submit and Close Buttons */}
        <div className="flex space-x-[10px]">
          <button
            onClick={handleSubmit}
            className="px-[20px] py-[10px] bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-[2px] focus:ring-green-[600]"
          >
            Submit Order
          </button>
          <button
            onClick={handleClose}
            className="px-[20px] py-[10px] bg-gray-600 text-white rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-[2px] focus:ring-gray-[600]"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;

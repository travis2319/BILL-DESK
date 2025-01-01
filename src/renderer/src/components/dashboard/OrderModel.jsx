import { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Assumes you're using react-modal
import { format } from 'date-fns';

const OrderModal = ({ isOpen, onClose }) => {
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [items, setItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    const [currentItemQuantity, setCurrentItemQuantity] = useState(1);
    const [taxRate, setTaxRate] = useState(2.5); // Default tax rate

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await window.electron.ipcRenderer.invoke('get-menu-names');
                if (response.success) {
                    console.log(response.MenuItems);
                    
                    setMenuItems(response.MenuItems);
                    setSelectedMenuItem(response.MenuItems[0]?.ItemName || '');
                }
            } catch (error) {
                console.error('Failed to fetch menu items:', error);
            }
        };

        if (isOpen) {
            fetchMenuItems();
        }
    }, [isOpen]);

    useEffect(() => {
        console.log('OrderModal rendered');
    }, []);

    const handleAddItem = () => {
        const selectedItem = menuItems.find(item => item.ItemName === selectedMenuItem);
        if (selectedItem) {
            const existingItemIndex = items.findIndex(item => item.name === selectedItem.ItemName);
            if (existingItemIndex > -1) {
                const newItems = [...items];
                newItems[existingItemIndex].quantity += currentItemQuantity;
                newItems[existingItemIndex].price += selectedItem.Price * currentItemQuantity;
                setItems(newItems);
            } else {
                setItems([
                    ...items,
                    {
                        name: selectedItem.ItemName,
                        quantity: currentItemQuantity,
                        quantityType: selectedItem.QuantityType,
                        displayQuantity: selectedItem.QuantityType === 'kg'
                        ? `${selectedItem.QuantityType}`
                        : `(${currentItemQuantity * selectedItem.Quantity} ${selectedItem.QuantityType})`,
                        price: selectedItem.Price * currentItemQuantity,
                    },
                ]);
            }
            setCurrentItemQuantity(1); // Reset quantity input
        } else {
            alert('Please select a valid item from the menu.');
        }
    };
    

    const handleDeleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotal = () => {
        const subTotal = items.reduce((total, item) => total + item.price, 0);
        const taxAmount = subTotal * (taxRate / 100);
        return subTotal + taxAmount;
    };

    const handleSubmit = async () => {
        const orderData = {
            customerName,
            phoneNumber,
            email,
            items,
            orderTimestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            userID: 1,
            totalAmount: calculateTotal(),
            subTotal: items.reduce((total, item) => total + item.price, 0),
            taxAmount: items.reduce((total, item) => total + item.price, 0) * (taxRate / 100),
            taxRate,
        };

        try {
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
                orderData.taxRate,
                orderData.items
            );
            
            if (result.success) {
                alert(result.message);
                resetForm(); // Reset form on successful order submission
                onClose();
            } else {
                alert('Failed to create order');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Error submitting order');
        }
    };

    const resetForm = () => {
        console.log('Resetting form state');
        setCustomerName('');
        setPhoneNumber('');
        setEmail('');
        setItems([]);
        setSelectedMenuItem(menuItems[0]?.ItemName || '');
        setTaxRate(2.5); // Reset tax rate to default
        setCurrentItemQuantity(1); // Reset quantity input
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={handleClose} ariaHideApp={false}>
            <div className="p-6 bg-gray-100 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4">Create Order</h2>
                
                <div className="mb-4 flex flex-wrap lg:flex-nowrap space-x-4">
                    <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
                        Customer Name:
                        <input 
                            type="text" 
                            value={customerName} 
                            onChange={(e) => setCustomerName(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
                        Phone Number:
                        <input 
                            type="text" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
                        Email:
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Add Item:</label>
                    <div className="flex space-x-2 items-center">
                        <select 
                            value={selectedMenuItem} 
                            onChange={(e) => setSelectedMenuItem(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            {menuItems.map((item, index) => (
                                <option key={index} value={item.ItemName}>{item.ItemName}</option>
                            ))}
                        </select>
                        <input 
                            type="number" 
                            value={currentItemQuantity} 
                            onChange={(e) => setCurrentItemQuantity(Number(e.target.value))} 
                            className="mt-1 block w-20 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Qty" 
                            min="1" 
                        />
                        <button onClick={handleAddItem} className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Item</button>
                    </div>
                </div>

                <table className="w-full mb-4 border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">Item Name</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">{item.name}</td>
                                <td className="px-4 py-2">
                                {item.quantity} {item.displayQuantity}
                                </td>
                                <td className="px-4 py-2">{item.price.toFixed(2)}</td>
                                <td className="px-4 py-2 text-center">
                                    <button onClick={() => handleDeleteItem(index)} className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Tax Input and Total Display */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700">Tax (%):</label>
                        <input 
                            type="number" 
                            value={taxRate} 
                            onChange={(e) => setTaxRate(Number(e.target.value))} 
                            placeholder="Enter tax rate" 
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>

                    {/* Total Amount Display */}
                    <div className="flex flex-col items-end">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-xl font-bold">{calculateTotal().toFixed(2)}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Submit Order</button>
                    <button onClick={handleClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default OrderModal;

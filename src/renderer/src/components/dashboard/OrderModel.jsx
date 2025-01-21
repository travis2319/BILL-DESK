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
    const [cgstRate, setCgstRate] = useState(2.5); // CGST Rate
    const [sgstRate, setSgstRate] = useState(2.5); // SGST Rate
    const [message, setMessage] = useState('');


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
                        displayQuantity: selectedItem.QuantityType === 'kg' ? `${selectedItem.QuantityType}` : `(${currentItemQuantity * selectedItem.Quantity} ${selectedItem.QuantityType})`,
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
        const cgstAmount = subTotal * (cgstRate / 100);
        const sgstAmount = subTotal * (sgstRate / 100);
        return subTotal + cgstAmount + sgstAmount;
    };

    const handleSubmit = async () => {
        if (!phoneNumber) {
            setMessage('Phone Number is required');
            return;
        }
    
        if (items.length === 0) {
            setMessage('Please add at least one item to the order');
            return;
        }
        console.log(items);
    
        const sanitizedemail = email || '';
        const sanitizedcustomerName = customerName || '';
    
        const subtotal = items.reduce((total, item) => total + item.price, 0);
        const cgstAmount = subtotal * (cgstRate / 100);
        const sgstAmount = subtotal * (sgstRate / 100);
    
        const orderData = {
            customerName: sanitizedcustomerName,
            phoneNumber,
            email: sanitizedemail,
            items,
            orderTimestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            userID: 1,
            totalAmount: calculateTotal(),
            subTotal: subtotal,
            cgstAmount,
            sgstAmount,
            cgstRate,
            sgstRate
        };
        console.log('Order Data:', orderData);
    
        try {
            // Send the entire orderData object instead of individual parameters
            const result = await window.electron.ipcRenderer.invoke('handle-order', orderData);
            
            if (result.success) {
                setMessage(result.message);
                resetForm(); // Reset form on successful order submission
                // onClose();
            } else {
                setMessage('Failed to create order');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            setMessage('Error submitting order');
        }
    };

    const resetForm = () => {
        console.log('Resetting form state');
        setCustomerName('');
        setPhoneNumber('');
        setEmail('');
        setItems([]);
        setSelectedMenuItem(menuItems[0]?.ItemName || '');
        setCgstRate(2.5); // Reset tax rate to default
        setSgstRate(2.5); // Reset tax rate to default
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
                {/* Display message here */}
                {message && (
                    <div className="mb-4 text-red-700 text-center">
                        {message}
                        {/* {setTimeout(() => setMessage(''), 10000)} */}
                    </div>
                )}
                <div className="mb-4 flex flex-wrap lg:flex-nowrap space-x-4 justify-center">
                    <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
                        Customer Name:
                        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
                        Phone Number:
                        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
                        Email:
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </label>
                </div>
                <div className="mb-4 text-center">
                    <label className="block text-sm font-medium text-gray-700">Add Item:</label>
                    <div className="flex space-x-2 items-center justify-center">
                        <select value={selectedMenuItem} onChange={(e) => setSelectedMenuItem(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            {menuItems.map((item, index) => (
                                <option key={index} value={item.ItemName}>{item.ItemName}</option>
                            ))}
                        </select>
                        <input type="number" value={currentItemQuantity} onChange={(e) => setCurrentItemQuantity(Number(e.target.value))} className="mt-1 block w-20 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Qty" min="1" />
                        <button onClick={handleAddItem} className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Item</button>
                    </div>
                </div>
                <table className="w-full mb-4 border text-center">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Item Name</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">{item.name}</td>
                                <td className="px-4 py-2">{item.quantity} {item.displayQuantity}</td>
                                <td className="px-4 py-2">{item.price.toFixed(2)}</td>
                                <td className="px-4 py-2">
                                    <button onClick={() => handleDeleteItem(index)} className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-start w-full">
                    {/* Left side tax inputs */}
                    <div className="flex gap-x-4 mb-4">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700">CGST (%):</label>
                            <input type="number" value={cgstRate} onChange={(e) => setCgstRate(Number(e.target.value))} placeholder="Enter CGST rate" min="0" className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700">SGST (%):</label>
                            <input type="number" value={sgstRate} onChange={(e) => setSgstRate(Number(e.target.value))} placeholder="Enter SGST rate" min="0" className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    {/* Right side total */}
                    <div className="flex flex-col items-end space-y-2">
                        {/* Calculate subtotal once */}
                        {items.length > 0 && (
                            <>
                                {(() => {
                                    const subtotal = items.reduce((total, item) => total + item.price, 0);
                                    return (
                                        <>
                                            <div className="flex justify-between w-full">
                                                <span className="text-gray-600">Subtotal:</span>
                                                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between w-full">
                                                <span className="text-gray-600">CGST ({cgstRate}%):</span>
                                                <span className="font-medium">₹{((subtotal * cgstRate) / 100).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between w-full">
                                                <span className="text-gray-600">SGST ({sgstRate}%):</span>
                                                <span className="font-medium">₹{((subtotal * sgstRate) / 100).toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-2 mt-1 w-full">
                                                <div className="flex justify-between">
                                                    <span className="text-lg font-semibold">Total:</span>
                                                    <span className="text-lg font-bold">₹{calculateTotal().toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </>
                        )}
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

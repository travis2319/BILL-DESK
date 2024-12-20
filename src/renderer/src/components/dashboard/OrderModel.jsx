// import { useState, useEffect } from 'react';
// import Modal from 'react-modal'; // Assumes you're using react-modal
// import { format } from 'date-fns';

// const OrderModal = ({ isOpen, onClose }) => {
//     const [customerName, setCustomerName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [email, setEmail] = useState('');
//     const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
//     const [menuItems, setMenuItems] = useState([]);
//     const [filteredMenuItems, setFilteredMenuItems] = useState([]);
//     const [currentItemIndex, setCurrentItemIndex] = useState(null);

//     useEffect(() => {
//         const fetchMenuItems = async () => {
//             try {
//                 const response = await window.electron.ipcRenderer.invoke('get-menu-names');
//                 if (response.success) {
//                     setMenuItems(response.MenuItems);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch menu items:', error);
//                 setMenuItems([]);
//             }
//         };

//         if (isOpen) {
//             fetchMenuItems();
//         }
//     }, [isOpen]);

//     const handleAddItem = () => {
//         setItems([...items, { name: '', quantity: 1, price: 0 }]);
//     };

//     const handleItemChange = (index, field, value) => {
//         const newItems = [...items];

//         if (field === 'quantity') {
//             const quantity = parseInt(value, 10);
//             newItems[index].quantity = isNaN(quantity) ? 1 : quantity;
//         } else {
//             newItems[index][field] = value;
//             if (field === 'name') {
//                 const menuItem = menuItems.find(item => item.ItemName === value);
//                 if (menuItem) {
//                     newItems[index].price = menuItem.Price * newItems[index].quantity;
//                 }
//             }
//         }

//         setItems(newItems);
//     };

//     const handleDeleteItem = (index) => {
//         setItems(items.filter((_, i) => i !== index));
//     };

//     const calculateTotal = () => {
//         return items.reduce((total, item) => total + item.quantity * item.price, 0);
//     };

//     const handleSubmit = async () => {
//         const validItems = items.filter(item => item.name && item.quantity > 0);

//         if (validItems.length === 0) {
//             alert('Please add at least one valid item.');
//             return;
//         }

//         const subTotal = calculateTotal();
//         const taxAmount = subTotal * 0.1; // Assuming tax is 10% of subtotal
//         const totalAmount = subTotal + taxAmount;

//         console.log({
//             customerName,
//             phoneNumber,
//             email,
//             items: validItems,
//             subTotal,
//             taxAmount,
//             totalAmount,
//         });

//         // Reset form and close modal
//         resetForm();
//         onClose();
//     };

//     const resetForm = () => {
//         setCustomerName('');
//         setPhoneNumber('');
//         setEmail('');
//         setItems([{ name: '', quantity: 1, price: 0 }]);
//     };

//     return (
//         <Modal isOpen={isOpen} onRequestClose={onClose}>
//             <h2>Create Order</h2>
//             <form>
//                 <label>
//                     Customer Name:
//                     <input
//                         type="text"
//                         value={customerName}
//                         onChange={(e) => setCustomerName(e.target.value)}
//                     />
//                 </label>
//                 <label>
//                     Phone Number:
//                     <input
//                         type="text"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                     />
//                 </label>
//                 <label>
//                     Email:
//                     <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </label>
//                 <h3>Items</h3>
//                 {items.map((item, index) => (
//                     <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
//                         <input
//                             type="text"
//                             placeholder="Item Name"
//                             value={item.name}
//                             onChange={(e) => handleItemChange(index, 'name', e.target.value)}
//                         />
//                         <input
//                             type="number"
//                             placeholder="Quantity"
//                             value={item.quantity}
//                             onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
//                             style={{ marginLeft: '10px' }}
//                         />
//                         <button
//                             type="button"
//                             onClick={() => handleDeleteItem(index)}
//                             style={{ marginLeft: '10px' }}
//                         >
//                             Delete
//                         </button>
//                     </div>
//                 ))}
//                 <button type="button" onClick={handleAddItem}>
//                     Add Item
//                 </button>
//                 <h4>Total: {calculateTotal()}</h4>
//                 <button type="button" onClick={handleSubmit}>
//                     Submit Order
//                 </button>
//             </form>
//         </Modal>
//     );
// };

// export default OrderModal;


// import { useState, useEffect } from 'react';
// import Modal from 'react-modal'; // Assumes you're using react-modal
// import { format } from 'date-fns';

// const OrderModal = ({ isOpen, onClose }) => {
//     const [customerName, setCustomerName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [email, setEmail] = useState('');
//     const [items, setItems] = useState([]);
//     const [menuItems, setMenuItems] = useState([]);
//     const [filteredMenuItems, setFilteredMenuItems] = useState([]);
//     const [currentItemInput, setCurrentItemInput] = useState('');

//     useEffect(() => {
//         const fetchMenuItems = async () => {
//             try {
//                 const response = await window.electron.ipcRenderer.invoke('get-menu-names');
//                 if (response.success) {
//                     setMenuItems(response.MenuItems);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch menu items:', error);
//             }
//         };

//         if (isOpen) {
//             fetchMenuItems();
//         }
//     }, [isOpen]);

//     useEffect(() => {
//         if (currentItemInput) {
//             const filtered = menuItems.filter(item =>
//                 item.ItemName.toLowerCase().includes(currentItemInput.toLowerCase())
//             );
//             setFilteredMenuItems(filtered);
//         } else {
//             setFilteredMenuItems([]);
//         }
//     }, [currentItemInput]);

//     const handleAddItem = (menuItem) => {
//         const existingItemIndex = items.findIndex(item => item.name === menuItem.ItemName);

//         if (existingItemIndex > -1) {
//             const newItems = [...items];
//             newItems[existingItemIndex].quantity += 1;
//             newItems[existingItemIndex].price += menuItem.Price;
//             setItems(newItems);
//         } else {
//             setItems([...items, { name: menuItem.ItemName, quantity: 1, price: menuItem.Price }]);
//         }
//         setCurrentItemInput('');
//         setFilteredMenuItems([]);
//     };

//     const handleDeleteItem = (index) => {
//         const newItems = items.filter((_, i) => i !== index);
//         setItems(newItems);
//     };

//     const handleSubmit = async () => {
//         const subTotal = items.reduce((total, item) => total + item.price, 0);
//         const taxAmount = subTotal * 0.1; // Assuming 10% tax
//         const totalAmount = subTotal + taxAmount;

//         const orderData = {
//             customerName,
//             phoneNumber,
//             email,
//             items,
//             orderTimestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
//             userID: 1,
//             totalAmount,
//             subTotal,
//             taxAmount,
//         };

//         try {
//             const result = await window.electron.ipcRenderer.invoke(
//                 'handle-order',
//                 orderData.customerName,
//                 orderData.phoneNumber,
//                 orderData.email,
//                 orderData.userID,
//                 orderData.orderTimestamp,
//                 orderData.totalAmount,
//                 orderData.subTotal,
//                 orderData.taxAmount,
//                 orderData.items
//             );

//             if (result.success) {
//                 alert(result.message);
//                 resetForm();
//                 onClose();
//             } else {
//                 alert('Failed to create order');
//             }
//         } catch (error) {
//             console.error('Error submitting order:', error);
//             alert('Error submitting order');
//         }
//     };

//     const resetForm = () => {
//         setCustomerName('');
//         setPhoneNumber('');
//         setEmail('');
//         setItems([]);
//         setCurrentItemInput('');
//         setFilteredMenuItems([]);
//     };

//     const handleClose = () => {
//         resetForm();
//         onClose();
//     };

//     return (
//         <Modal isOpen={isOpen} onRequestClose={handleClose} ariaHideApp={false}>
//             <div className="p-6 bg-gray-100 rounded-xl shadow-md">
//                 <h2 className="text-2xl font-bold mb-4">Create Order</h2>
//                 <div className="mb-4 flex flex-wrap lg:flex-nowrap space-x-4">
//                     <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
//                         Customer Name:
//                         <input
//                             type="text"
//                             value={customerName}
//                             onChange={(e) => setCustomerName(e.target.value)}
//                             className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                         />
//                     </label>
//                     <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
//                         Phone Number:
//                         <input
//                             type="text"
//                             value={phoneNumber}
//                             onChange={(e) => setPhoneNumber(e.target.value)}
//                             className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                         />
//                     </label>
//                     <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
//                         Email:
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                         />
//                     </label>
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700">
//                         Add Item:
//                         <input
//                             type="text"
//                             value={currentItemInput}
//                             onChange={(e) => setCurrentItemInput(e.target.value)}
//                             className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         {filteredMenuItems.length > 0 && (
//                             <ul className="absolute bg-white border rounded-md shadow-md max-h-40 overflow-auto mt-1">
//                                 {filteredMenuItems.map((menuItem, index) => (
//                                     <li
//                                         key={index}
//                                         onClick={() => handleAddItem(menuItem)}
//                                         className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
//                                     >
//                                         {menuItem.ItemName}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </label>
//                 </div>
//                 <table className="w-full mb-4 border">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="px-4 py-2 text-left">Item Name</th>
//                             <th className="px-4 py-2 text-left">Quantity</th>
//                             <th className="px-4 py-2 text-left">Price</th>
//                             <th className="px-4 py-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {items.map((item, index) => (
//                             <tr key={index}>
//                                 <td className="px-4 py-2">{item.name}</td>
//                                 <td className="px-4 py-2">{item.quantity}</td>
//                                 <td className="px-4 py-2">{item.price.toFixed(2)}</td>
//                                 <td className="px-4 py-2 text-center">
//                                     <button
//                                         onClick={() => handleDeleteItem(index)}
//                                         className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <div className="flex space-x-4">
//                     <button
//                         onClick={handleSubmit}
//                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                     >
//                         Submit Order
//                     </button>
//                     <button
//                         onClick={handleClose}
//                         className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default OrderModal;

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

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await window.electron.ipcRenderer.invoke('get-menu-names');
                if (response.success) {
                    setMenuItems(response.MenuItems);
                    setSelectedMenuItem(response.MenuItems[0]?.ItemName || ''); // Set the first item as the default
                }
            } catch (error) {
                console.error('Failed to fetch menu items:', error);
            }
        };

        if (isOpen) {
            fetchMenuItems();
        }
    }, [isOpen]);

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
                        price: selectedItem.Price * currentItemQuantity,
                    },
                ]);
            }
            setCurrentItemQuantity(1);
        } else {
            alert('Please select a valid item from the menu.');
        }
    };

    const handleDeleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = async () => {
        const subTotal = items.reduce((total, item) => total + item.price, 0);
        const taxAmount = subTotal * 0.1; // Assuming 10% tax
        const totalAmount = subTotal + taxAmount;

        const orderData = {
            customerName,
            phoneNumber,
            email,
            items,
            orderTimestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            userID: 1,
            totalAmount,
            subTotal,
            taxAmount,
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
                orderData.items
            );

            if (result.success) {
                alert(result.message);
                resetForm();
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
        setCustomerName('');
        setPhoneNumber('');
        setEmail('');
        setItems([]);
        setSelectedMenuItem(menuItems[0]?.ItemName || '');
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
                    <label className="block text-sm font-medium text-gray-700">
                        Add Item:
                        <div className="flex space-x-2 items-center">
                            <select
                                value={selectedMenuItem}
                                onChange={(e) => setSelectedMenuItem(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                {menuItems.map((item) => (
                                    <option key={item.ItemID} value={item.ItemName}>
                                        {item.ItemName}
                                    </option>
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
                            <button
                                onClick={handleAddItem}
                                className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Add Item
                            </button>
                        </div>
                    </label>
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
                                <td className="px-4 py-2">{item.quantity}</td>
                                <td className="px-4 py-2">{item.price.toFixed(2)}</td>
                                <td className="px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleDeleteItem(index)}
                                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex space-x-4">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Submit Order
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default OrderModal;


// import { useState, useEffect } from 'react';
// import Modal from 'react-modal'; // Assumes you're using react-modal
// import { format } from 'date-fns';

// const OrderModal = ({ isOpen, onClose }) => {
//     const [customerName, setCustomerName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [email, setEmail] = useState('');
//     const [items, setItems] = useState([{ name: '', quantity: '1', price: 0 }]);
//     const [menuItems, setMenuItems] = useState([]);
//     const [filteredMenuItems, setFilteredMenuItems] = useState([]);
//     const [currentItemInput, setCurrentItemInput] = useState('');
//     const [currentItemIndex, setCurrentItemIndex] = useState(null);

//     useEffect(() => {
//         const fetchMenuItems = async () => {
//             try {
//                 const response = await window.electron.ipcRenderer.invoke('get-menu-names');
//                 if (response.success) {
//                     console.log(response.MenuItems);
//                     setMenuItems(response.MenuItems);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch menu items:', error);
//                 setMenuItems([]);
//             }
//         };

//         if (isOpen) {
//             fetchMenuItems();
//         }
//     }, [isOpen]);

//     useEffect(() => {
//         if (currentItemInput) {
//             const filtered = menuItems.filter(item =>
//                 item.ItemName.toLowerCase().includes(currentItemInput.toLowerCase())
//             );
//             setFilteredMenuItems(filtered);
//         } else {
//             setFilteredMenuItems([]);
//         }
//     }, [currentItemInput]);

//     const resetForm = () => {
//         console.log('Resetting form');
//         setCustomerName('');
//         setPhoneNumber('');
//         setEmail('');
//         setItems([{ name: '', quantity: '1', price: 0 }]);
//         setCurrentItemInput('');
//         setFilteredMenuItems([]);
//         setCurrentItemIndex(null);
//     };

//     const handleAddItem = () => {
//         const newItem = { name: '', quantity: '1', price: 0 };
//         setItems([...items, newItem]);
//         resetCurrentItem();
//     };

//     const handleDeleteItem = (index) => {
//         const newItems = items.filter((_, i) => i !== index);
//         setItems(newItems);
//     };

//     const handleItemChange = (index, field, value) => {
//         console.log(`Updating item at index ${index}, field: ${field}, value: ${value}`);
//         const newItems = [...items];

//         if (field === 'quantity') {
//             const quantity = parseInt(value, 10);
//             newItems[index].quantity = isNaN(quantity) ? 1 : quantity;
//             // Update price based on quantity if the item has a name
//             if (newItems[index].name) {
//                 const menuItem = menuItems.find(item => item.ItemName === newItems[index].name);
//                 if (menuItem) {
//                     newItems[index].price = menuItem.Price * newItems[index].quantity;
//                 }
//             }
//         } else {
//             newItems[index][field] = value;
//             // Update price if the item has a name
//             if (newItems[index].name) {
//                 const menuItem = menuItems.find(item => item.ItemName === newItems[index].name);
//                 if (menuItem) {
//                     newItems[index].price = menuItem.Price;
//                 }
//             }
//         }

//         setItems(newItems);
//         console.log('Updated items:', newItems);
//     };

//     const resetCurrentItem = () => {
//         setCurrentItemInput('');
//         setFilteredMenuItems([]);
//         setCurrentItemIndex(null);
//     };

//     const handleSelectMenuItem = (menuItem) => {
//         if (currentItemIndex !== null) {
//             const newItems = [...items];
//             newItems[currentItemIndex].name = menuItem.ItemName;
//             newItems[currentItemIndex].price = menuItem.Price;
//             setItems(newItems);
//             resetCurrentItem();
//         }
//     };

//     const handleSubmit = async () => {
//         const validItems = items.filter(item => item.name && item.quantity);
        
//         if (validItems.length === 0) {
//             alert('Please add at least one valid item.');
//             return;
//         }

//         const subTotal = validItems.reduce((total, item) => total + (parseFloat(item.quantity) * item.price), 0);
//         const taxAmount = subTotal * 0.1; // Assuming tax is 10% of subtotal
//         const totalAmount = subTotal + taxAmount;

//         // Prepare order data
//         const orderData = {
//             customerName,
//             phoneNumber,
//             email,
//             items: validItems.map(item => ({
//                 name: item.name,
//                 quantity: parseInt(item.quantity, 10),
//                 price: item.price,
//             })),
//             orderTimestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
//             userID: 1,
//             totalAmount,
//             subTotal,
//             taxAmount,
//         };

//         console.log('Order Taken:', orderData);

//         try {
//             // Send order to main process via IPC
//             const result = await window.electron.ipcRenderer.invoke(
//                 'handle-order',
//                 orderData.customerName,
//                 orderData.phoneNumber,
//                 orderData.email,
//                 orderData.userID,
//                 orderData.orderTimestamp,
//                 orderData.totalAmount,
//                 orderData.subTotal,
//                 orderData.taxAmount,
//                 orderData.items
//             );

//             if (result.success) {
//                 console.log(result.message);
//                 alert(result.message);
//                 resetForm();
//                 onClose();
//             } else {
//                 console.error('Failed to create order:', result);
//                 alert('Failed to create order');
//             }
//         } catch (error) {
//             console.error('Error submitting order:', error);
//             alert('Error submitting order');
//         }
//     };

//     const handleClose = () => {
//         console.log('Closing modal');
//         resetForm();
//         onClose();
//     };

//     // console.log('Modal is open:', isOpen);

//     return (
//       <Modal isOpen={isOpen} onRequestClose={handleClose} ariaHideApp={false}>
//           <div className="p-6 bg-gray-100 rounded-xl shadow-md">
//               <h2 className="text-2xl font-bold mb-4">Create Order</h2>
//               {/* Customer Information */}
//               <div className="mb-4 flex flex-wrap lg:flex-nowrap space-x-4">
//     <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
//         Customer Name:
//         <input 
//             type="text" 
//             value={customerName} 
//             onChange={(e) => setCustomerName(e.target.value)} 
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
//         />
//     </label>
//     <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
//         Phone Number:
//         <input 
//             type="text" 
//             value={phoneNumber} 
//             onChange={(e) => setPhoneNumber(e.target.value)} 
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
//         />
//     </label>
//     <label className="block text-sm font-medium text-gray-700 lg:w-1/3 w-full">
//         Email:
//         <input 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
//         />
//     </label>
// </div>

//               {/* Items Section */}
//               <div className="mb-4">
//                   <h3 className="text-lg font-medium mb-2">Items</h3>
//                   {items.map((item, index) => (
//                       <div key={index} className="flex items-center space-x-4 mb-2">
//                           <label className="block text-sm font-medium text-gray-700">
//                               Item Name:
//                               <input 
//                                   type="text" 
//                                   value={item.name || currentItemInput} 
//                                   onChange={(e) => { 
//                                       handleItemChange(index, 'name', e.target.value); 
//                                       setCurrentItemInput(e.target.value); 
//                                       setCurrentItemIndex(index); 
//                                   }} 
//                                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
//                               />
//                               {/* Displaying Filtered Menu Items */}
//                               {filteredMenuItems.length > 0 && (
//                                   <ul className="absolute bg-white border border-gray-300 mt-1 max-h-[150px] overflow-auto z-[1000]">
//                                       {filteredMenuItems.map((menuItem, i) => (
//                                           <li key={i} onClick={() => handleSelectMenuItem(menuItem)} className="px-3 py-2 hover:bg-gray-200 cursor-pointer">
//                                               {menuItem.ItemName}
//                                           </li>
//                                       ))}
//                                   </ul>
//                               )}
//                           </label>
//                           {/* Price Display */}
//                           <div className="block text-sm font-bold text-gray700 w-[100px]">Price: {item.price.toFixed(2)}</div>
//                           <label className="block text-sm font-medium text-gray-700">
//                               Quantity:
//                               <input 
//                                   type="number" 
//                                   value={item.quantity} 
//                                   onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
//                                   className="mt-1 block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
//                               />
//                           </label>
//                           <button onClick={() => handleDeleteItem(index)} className="px-2 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Delete</button>
//                       </div>
//                   ))}
//                   <button onClick={handleAddItem} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[100px]">Add Item</button>
//               </div>
//               {/* Submit and Close Buttons */}
//               <div className="flex space-x-[10px]">
//                   <button onClick={handleSubmit} className="px-[20px] py-[10px] bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-[2px] focus:ring-green-[600]">Submit Order</button>
//                   <button onClick={handleClose} className="px-[20px] py-[10px] bg-gray-600 text-white rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-[2px] focus:ring-gray-[600]">Close</button>
//               </div>
//           </div>
//       </Modal>
//     );
// };

// export default OrderModal;

// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';

// const OrderModal = ({ isOpen, onClose }) => {
//   // Contact form state
//   const [contactInfo, setContactInfo] = useState({
//     name: '',
//     phone: '',
//     email: '',
//   });

//   // Menu item state
//   const [menuItems, setMenuItems] = useState([]);
//   const [currentItem, setCurrentItem] = useState({
//     itemName: '',
//     quantity: '',
//   });

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const response = await window.electron.ipcRenderer.invoke('get-menu-names');
//         if (response.success) {
//           console.log(response.MenuItems);
//           setMenuItems(response.MenuItems);
//         }
//       } catch (error) {
//         console.error('Failed to fetch menu items:', error);
//         setMenuItems([]);
//       }
//     };

//     if (isOpen) {
//       fetchMenuItems();
//     }
//   }, [isOpen]);

//   // Handle contact info changes
//   const handleContactChange = (e) => {
//     const { name, value } = e.target;
//     setContactInfo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle menu item input changes
//   const handleItemChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentItem(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Add item to the list
//   const handleAddItem = () => {
//     if (currentItem.itemName && currentItem.quantity) {
//       setMenuItems(prev => [...prev, { ...currentItem, id: Date.now() }]);
//       setCurrentItem({ itemName: '', quantity: '' });
//     }
//   };

//   // Remove item from the list
//   const handleRemoveItem = (id) => {
//     setMenuItems(prev => prev.filter(item => item.id !== id));
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
//       overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//     >
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-semibold">Menu Order Form</h2>
//       </div>

//       {/* Contact Information Section */}
//       <div className="space-y-4 mb-6">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//             Name
//           </label>
//           <input
//             id="name"
//             name="name"
//             value={contactInfo.name}
//             onChange={handleContactChange}
//             placeholder="Enter your name"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//             Phone Number
//           </label>
//           <input
//             id="phone"
//             name="phone"
//             type="tel"
//             value={contactInfo.phone}
//             onChange={handleContactChange}
//             placeholder="Enter phone number"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//             Email
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             value={contactInfo.email}
//             onChange={handleContactChange}
//             placeholder="Enter email address"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Menu Items Section */}
//       <div className="space-y-4 mb-6">
//         <div>
//           <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
//             Menu Item
//           </label>
//           <div className="flex space-x-2">
//             <input
//               id="itemName"
//               name="itemName"
//               value={currentItem.itemName}
//               onChange={handleItemChange}
//               placeholder="Enter item name"
//               className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               id="quantity"
//               name="quantity"
//               type="number"
//               value={currentItem.quantity}
//               onChange={handleItemChange}
//               placeholder="Qty"
//               className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handleAddItem}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Display Menu Items */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Added Items
//           </label>
//           <div className="space-y-2 max-h-40 overflow-y-auto">
//             {menuItems.map(item => (
//               <div key={item.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
//                 <span className="text-gray-800">{item.itemName} ({item.quantity})</span>
//                 <button
//                   onClick={() => handleRemoveItem(item.id)}
//                   className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-end space-x-2">
//         <button
//           onClick={onClose}
//           className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={() => {
//             console.log('Submitted:', { contactInfo, menuItems });
//             onClose();
//           }}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Submit Order
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default OrderModal;
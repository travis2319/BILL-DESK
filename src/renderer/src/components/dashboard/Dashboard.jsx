import { useState, useEffect } from 'react';
import { Users, IndianRupee, ShoppingCart, Package, Plus } from 'lucide-react';
import OrderModal from './OrderModel';
import MetricsCard from './MetricsCard';
import SalesChart from './SalesChart';
import RevenueChart from './RevenueChart';
// import { ipcRenderer } from 'electron'; // Import ipcRenderer

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
];

const revenueData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Books', value: 200 },
  { name: 'Others', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Initialize analyticsData as an object with default values
  const [analyticsData, setAnalyticsData] = useState({
    TotalUsers: 0,
    TotalRevenue: 0,
    TotalOrders: 0,
    ProductsSold: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await window.electron.ipcRenderer.invoke('get-analytics');
        console.log('Fetched analytics data:', data[0]);
        
        setAnalyticsData({
          TotalUsers: data[0].TotalCustomers || 0,
          TotalRevenue: data[0].TotalRevenue || 0,
          TotalOrders: data[0].TotalOrders || 0,
          ProductsSold: data[0].ProductsSold || 0
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } 
    };

    fetchAnalytics();
  }, []);

  // Calculate total revenue including GST

  return (
    <div className="w-full bg-gray-100 p-6">
      <OrderModal 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        key={isDialogOpen ? 'open' : 'closed'}
      />

      <div className="container mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
            <Plus className="h-5 w-5" />
            Add Order
          </button> 
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <>
            <MetricsCard 
              icon={IndianRupee} 
              label="Total Revenue" 
              value={`₹${analyticsData.TotalRevenue}`}
              color="green" 
            />
            <MetricsCard 
              icon={ShoppingCart} 
              label="Total Orders" 
              value={`${analyticsData.TotalOrders}`}
              color="purple" 
            />
          </>
        </div>

        

        {/* Uncomment to display charts */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart data={salesData} />
          <RevenueChart data={revenueData} colors={COLORS} />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;

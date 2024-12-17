import { useState } from 'react';
import { Users, IndianRupee, ShoppingCart, Package, Plus } from 'lucide-react';
import OrderModal from './OrderModel';
import MetricsCard from './MetricsCard';
import SalesChart from './SalesChart';
import RevenueChart from './RevenueChart';

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
const metrics = [
  { icon: Users, label: 'Total Users', value: '2,456', color: 'blue' },
  { icon: IndianRupee, label: 'Total Revenue', value: '₹2,45,600', color: 'green' },
  { icon: ShoppingCart, label: 'Total Orders', value: '1,234', color: 'purple' },
  { icon: Package, label: 'Products Sold', value: '5,678', color: 'orange' },
];

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="w-full bg-gray-100 p-6">
      <OrderModal 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricsCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart data={salesData} />
          <RevenueChart data={revenueData} colors={COLORS} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// import React from 'react'
import {
  Cuboid,
  Home,
  LayoutList,
  LogOut,
  Settings 
} from 'lucide-react';
import { Link } from 'react-router';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 p-6 h-screen">
        <h1 className="text-2xl font-bold mb-6">Billing System</h1>
        <div className="space-y-4">
          <Link to="/home" className="flex items-center space-x-2">
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/logs" className="flex items-center space-x-2">
            <Cuboid size={20} />
            <span>Orders</span>
          </Link>
          <Link to="/menu" className="flex items-center space-x-2">
            <LayoutList size={20} />
            <span>Menu Items</span>
          </Link>
          {/* <Link to="/settings" className="flex items-center space-x-2">
            <Settings  size={20} />
            <span>Settings</span>
          </Link> */}
          <Link to="/" className="flex items-center space-x-2">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </div>
  )}

export default Sidebar
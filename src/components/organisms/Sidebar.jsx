import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Employees", href: "/employees", icon: "Users" },
    { name: "Departments", href: "/departments", icon: "Building" },
    { name: "Logger", href: "/logger", icon: "FileText" },
    { name: "Manage", href: "/manage", icon: "Building2" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
  ];

  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="Users" className="text-white" size={20} />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">StaffHub Pro</h1>
            <p className="text-sm text-gray-600">Employee Management</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <ApperIcon name={item.icon} className="mr-3 flex-shrink-0" size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex-shrink-0 px-4 pt-4 border-t border-gray-200">
          <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="text-primary-600" size={16} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-600">System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
          >
            <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-between px-6 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ApperIcon name="Users" className="text-white" size={20} />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900">StaffHub Pro</h1>
                    <p className="text-sm text-gray-600">Employee Management</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" size={20} className="text-gray-500" />
                </button>
              </div>
              
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} className="mr-3 flex-shrink-0" size={18} />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;
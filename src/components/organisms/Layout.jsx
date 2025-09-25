import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header 
          onMobileMenuToggle={() => setSidebarOpen(true)}
          title="StaffHub Pro"
          subtitle="Employee Management System"
          user={user}
          onLogout={logout}
        />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
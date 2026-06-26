import React, { useState } from 'react';
import Sidebar from '../components/dashboard/sidebar'; // Importa el componente Sidebar
import Navbar from '../components/dashboard/navbar';   // Importa el componente Navbar
import { FiHome, FiPieChart, FiUsers, FiSettings } from 'react-icons/fi';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Inicio');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
        />

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-4 mt-16 max-w-screen-lg mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

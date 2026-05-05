import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const HomeLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      
      <Navbar onMenuClick={() => setIsOpen(true)} />

      <div className="flex flex-1 overflow-hidden">    
        <Sidebar open={isOpen} onClose={() => setIsOpen(false)} />
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
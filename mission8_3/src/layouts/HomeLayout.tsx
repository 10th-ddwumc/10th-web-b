import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../hooks/useSidebar";

const HomeLayout = () => {
  const { isOpen, open, close } = useSidebar();

  return (
    <div className="h-screen flex flex-col">
      
      <Navbar onMenuClick={open} />

      <div className="flex flex-1 overflow-hidden">    
        <Sidebar open={isOpen} onClose={close} />
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
// src/layouts/RootLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import "../styles/Layout.css";

const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="layout-body">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {isSidebarOpen && (
          <button
            type="button"
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="사이드바 닫기"
          />
        )}

        <main className="layout-main">
          <Outlet />
        </main>
      </div>

      <button
        type="button"
        className="floating-button"
        onClick={() => navigate("/lp/new")}
      >
        +
      </button>
    </div>
  );
};

export default RootLayout;
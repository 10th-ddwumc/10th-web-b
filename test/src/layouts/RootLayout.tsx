// src/layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import LpEditorModal from "../components/lp/LpEditorModal";
import useSidebar from "../hooks/useSidebar";
import "../styles/Layout.css";
import "../styles/LpModal.css";

const RootLayout = () => {
  const { isOpen, close, toggle } = useSidebar();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="app-layout">
      <Header onToggleSidebar={toggle} />

      <div className="layout-body">
        <Sidebar isOpen={isOpen} onClose={close} />

        <button
          type="button"
          className={`sidebar-overlay ${isOpen ? "show" : ""}`}
          onClick={close}
          aria-label="사이드바 닫기"
        />

        <main className="layout-main">
          <Outlet />
        </main>
      </div>

      <button
        type="button"
        className="floating-button"
        onClick={() => setIsCreateModalOpen(true)}
      >
        +
      </button>

      {isCreateModalOpen && (
        <LpEditorModal
          mode="create"
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RootLayout;
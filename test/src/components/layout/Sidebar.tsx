// src/components/layout/Sidebar.tsx
import { Link } from "react-router-dom";
import { clearTokens, getAccessToken } from "../../utils/token";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const isLogin = !!getAccessToken();

  const handleQuit = () => {
    clearTokens();
    window.location.href = "/";
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <nav className="sidebar-menu">
        <Link to="/" onClick={onClose}>
          🔍 찾기
        </Link>
        <Link to="/mypage" onClick={onClose}>
          👤 마이페이지
        </Link>
      </nav>

      {isLogin && (
        <button type="button" className="quit-button" onClick={handleQuit}>
          탈퇴하기
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
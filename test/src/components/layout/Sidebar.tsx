// src/components/layout/Sidebar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { clearTokens, getAccessToken } from "../../utils/token";
import { withdraw } from "../../api/auth";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const isLogin = !!getAccessToken();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const withdrawMutation = useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      setIsConfirmOpen(false);
      alert("탈퇴가 완료되었습니다.");
      clearTokens();
      onClose();
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error(error);
      setIsConfirmOpen(false);
      alert("탈퇴에 실패했습니다.");
    },
  });

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <nav className="sidebar-menu">
          <Link to="/search" onClick={onClose}>
            🔍 찾기
          </Link>
          <Link to="/mypage" onClick={onClose}>
            👤 마이페이지
          </Link>
        </nav>

        {isLogin && (
          <button
            type="button"
            className="quit-button"
            onClick={() => setIsConfirmOpen(true)}
          >
            탈퇴하기
          </button>
        )}
      </aside>

      {isConfirmOpen && (
        <div
          className="confirm-backdrop"
          onClick={() => setIsConfirmOpen(false)}
        >
          <section
            className="confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <p>정말 탈퇴하시겠습니까?</p>
            <div>
              <button
                type="button"
                disabled={withdrawMutation.isPending}
                onClick={() => withdrawMutation.mutate()}
              >
                예
              </button>
              <button
                type="button"
                disabled={withdrawMutation.isPending}
                onClick={() => setIsConfirmOpen(false)}
              >
                아니오
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Sidebar;
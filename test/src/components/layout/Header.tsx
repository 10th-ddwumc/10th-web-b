// src/components/layout/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { clearTokens, getAccessToken, getUserName } from "../../utils/token";
import { logout } from "../../api/auth";

type HeaderProps = {
  onToggleSidebar: () => void;
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [userName, setUserName] = useState(getUserName());

  useEffect(() => {
    const syncAuth = () => {
      setAccessToken(getAccessToken());
      setUserName(getUserName());
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-change", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-change", syncAuth);
    };
  }, []);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearTokens();
      navigate("/");
    },
  });

  return (
    <header className="main-header">
      <div className="header-left">
        <button
          type="button"
          className="hamburger-button"
          onClick={onToggleSidebar}
          aria-label="사이드바 열기"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>

        <Link to="/" className="header-logo">
          돌려돌려LP판
        </Link>
      </div>

      <div className="header-right">
        <button type="button" className="search-button">
          🔍
        </button>

        {accessToken ? (
          <>
            <span className="welcome-text">
              {userName ?? "사용자"}님 반갑습니다.
            </span>
            <button
              type="button"
              className="header-text-button"
              onClick={() => logoutMutation.mutate()}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-login-button">
              로그인
            </Link>
            <Link to="/signup" className="header-signup-button">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
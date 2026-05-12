// src/components/Header.tsx
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        돌려돌려LP판
      </Link>

      <div className="header-right">
        <Link to="/login" className="header-login">
          로그인
        </Link>
        <Link to="/signup" className="header-signup">
          회원가입
        </Link>
      </div>
    </header>
  );
};

export default Header;
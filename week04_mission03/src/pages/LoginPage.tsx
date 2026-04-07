import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";

function LoginPage() {
  const navigate = useNavigate();
  const { values, errors, handleChange, validateAll, isValid } = useForm();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogin = () => {
    const result = validateAll();

    if (!result) return;

    alert("로그인 성공");
  };

  const handleSignupPage = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <header className="top-bar">
        <div className="logo">돌려돌려LP판</div>

        <div className="top-buttons">
          <button className="top-btn login-btn">로그인</button>
          <button className="top-btn signup-btn" onClick={handleSignupPage}>
            회원가입
          </button>
        </div>
      </header>

      <main className="login-main">
        <div className="login-box">
          <button className="back-button" onClick={handleGoBack}>
            &lt;
          </button>

          <h2 className="login-title">로그인</h2>

          <button className="google-button">
            <span className="google-icon">G</span>
            <span>구글 로그인</span>
          </button>

          <div className="divider">
            <div className="line"></div>
            <span>OR</span>
            <div className="line"></div>
          </div>

          <input
            type="email"
            placeholder="이메일을 입력해주세요!"
            className={`login-input ${errors.email ? "input-error" : ""}`}
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            placeholder="비밀번호를 입력해주세요!"
            className={`login-input ${errors.password ? "input-error" : ""}`}
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <button
            className={`submit-button ${isValid ? "active-button" : ""}`}
            onClick={handleLogin}
            disabled={!isValid}
          >
            로그인
          </button>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
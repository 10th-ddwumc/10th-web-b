// src/pages/LoginPage.tsx
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const { values, touched, errors, isValid, handleChange, handleBlur } =
    useForm({
      email: "",
      password: "",
    });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) return;

    console.log("로그인 정보:", values);
  };

  return (
    <main className="login-page">
      <section className="login-box">
        <div className="login-title-row">
          <button
            type="button"
            className="login-back-button"
            onClick={() => navigate(-1)}
            aria-label="이전 페이지로 이동"
          >
            ‹
          </button>
          <h1 className="login-title">로그인</h1>
        </div>

        <button type="button" className="google-login-button">
          <span className="google-icon">G</span>
          <span>구글 로그인</span>
        </button>

        <div className="login-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력해주세요!"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <p className="login-error">{errors.email}</p>
            )}
          </div>

          <div className="login-input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요!"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <p className="login-error">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="login-submit-button"
            disabled={!isValid}
          >
            로그인
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
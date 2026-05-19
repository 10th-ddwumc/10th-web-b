// src/pages/LoginPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useForm from "../hooks/useForm";
import { login, redirectToGoogleLogin } from "../api/auth";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const stateFrom = (location.state as { from?: string } | null)?.from;
  const from =
    stateFrom && stateFrom !== "/login" && !stateFrom.includes("undefined")
      ? stateFrom
      : "/";

  const { values, touched, errors, isValid, handleChange, handleBlur } =
    useForm({
      email: "",
      password: "",
    });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      console.log("로그인 성공:", result);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) return;

    loginMutation.mutate(values);
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

        <button
          type="button"
          className="google-login-button"
          onClick={redirectToGoogleLogin}
        >
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
            disabled={!isValid || loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
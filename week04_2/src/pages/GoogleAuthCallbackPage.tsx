// src/pages/GoogleCallbackPage.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setTokens } from "../utils/token";

const GoogleAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      alert("구글 로그인이 완료되었습니다.");
      navigate("/");
      return;
    }

    alert("구글 로그인에 실패했습니다.");
    navigate("/login");
  }, [navigate, searchParams]);

  return <main>구글 로그인 처리 중...</main>;
};

export default GoogleAuthCallbackPage;

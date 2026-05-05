import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useNavigate } from "react-router-dom";

const GoogleLoginRedirectPage = () => {
    const navigate = useNavigate();
    const { setItem: setAccessToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken,
    );
    const { setItem: setRefreshToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken,
    );

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

        if (accessToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            
            // 로컬 스토리지에 저장된 리다이렉트 경로가 있으면 사용, 없으면 마이페이지로 이동
            const redirectPath = localStorage.getItem("login_redirect") || "/my";
            localStorage.removeItem("login_redirect"); // 사용 후 삭제
            
            navigate(redirectPath, { replace: true });
        }
    }, [setAccessToken, setRefreshToken, navigate]);
    return <div>구글 로그인 리다이렉트 화면</div>;
};
export default GoogleLoginRedirectPage;
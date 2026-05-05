import { useContext, useState, createContext, type PropsWithChildren, useEffect } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signinData: RequestSigninDto) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const { getItem: getAccessTokenFromStorage,
        setItem: setAccessTokeninStorage,
        removeItem: removeAccessTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const { getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokeninStorage,
        removeItem: removeRefreshTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage(),
    );

    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage(),
    );

    // 다른 탭에서 로그아웃/로그인 시 상태 동기화
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === LOCAL_STORAGE_KEY.accessToken) {
                const newToken = event.newValue ? JSON.parse(event.newValue) : null;
                setAccessToken(newToken);
                if (!newToken) {
                    // 로그아웃 된 경우 메인으로 리다이렉트 (보안 강화)
                    window.location.href = "/";
                }
            }
            if (event.key === LOCAL_STORAGE_KEY.refreshToken) {
                const newToken = event.newValue ? JSON.parse(event.newValue) : null;
                setRefreshToken(newToken);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = async (signinData: RequestSigninDto): Promise<boolean> => {
        try {
            const { data } = await postSignin(signinData);

            if (data) {
                const newAccessToken: string = data.accessToken;
                const newRefreshToken: string = data.refreshToken;

                setAccessTokeninStorage(newAccessToken);
                setRefreshTokeninStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                alert("로그인 성공");
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("error", error);
            alert("로그인 실패");
            return false;
        }
    };

    const logout = async () => {
        try {
            await postLogout();
        }
        catch (error) {
            console.error("로그아웃 에러 (서버):", error);
        } finally {
            // 서버 응답과 관계없이 클라이언트의 인증 상태는 반드시 해제해야 함 (보안)
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            
            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 되었습니다.");
            window.location.href = "/"; // 메인 페이지로 이동하여 상태 확실히 초기화
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context: AuthContextType = useContext(AuthContext);
    if (!context) {
        throw new Error("cannot found AuthContext");
    }
    return context;
}
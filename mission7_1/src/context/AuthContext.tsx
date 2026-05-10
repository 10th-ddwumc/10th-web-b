import { useContext, useState, createContext, type PropsWithChildren, useEffect } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    setAccessToken: (token: string | null) => void;
    setRefreshToken: (token: string | null) => void;
    login: (signinData: RequestSigninDto) => Promise<boolean>;
    logout: (redirectPath?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        getAccessTokenFromStorage() ?? null,
    );

    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage() ?? null,
    );

    const handleSetAccessToken = (token: string | null) => {
        if (token) {
            setAccessTokeninStorage(token);
        } else {
            removeAccessTokenFromStorage();
        }
        setAccessToken(token);
    };

    const handleSetRefreshToken = (token: string | null) => {
        if (token) {
            setRefreshTokeninStorage(token);
        } else {
            removeRefreshTokenFromStorage();
        }
        setRefreshToken(token);
    };

    // 다른 탭에서 로그아웃/로그인 시 상태 동기화
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === LOCAL_STORAGE_KEY.accessToken) {
                try {
                    const newToken = event.newValue ? JSON.parse(event.newValue) : null;
                    setAccessToken(newToken);
                    if (!newToken) {
                        // 로그아웃 된 경우 메인으로 리다이렉트 (보안 강화)
                        window.location.href = "/";
                    }
                } catch (error) {
                    console.error("Storage sync error:", error);
                }
            }
            if (event.key === LOCAL_STORAGE_KEY.refreshToken) {
                try {
                    const newToken = event.newValue ? JSON.parse(event.newValue) : null;
                    setRefreshToken(newToken);
                } catch (error) {
                    console.error("Storage sync error:", error);
                }
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

                handleSetAccessToken(newAccessToken);
                handleSetRefreshToken(newRefreshToken);

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

    const logout = async (redirectPath: string = "/") => {
        try {
            await postLogout();
        }
        catch (error) {
            console.error("로그아웃 에러 (서버):", error);
        } finally {
            // 서버 응답과 관계없이 클라이언트의 인증 상태는 반드시 해제해야 함 (보안)
            handleSetAccessToken(null);
            handleSetRefreshToken(null);

            alert("로그아웃 되었습니다.");
            window.location.href = redirectPath; // 지정된 페이지로 이동하여 상태 확실히 초기화
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, setAccessToken: handleSetAccessToken, setRefreshToken: handleSetRefreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
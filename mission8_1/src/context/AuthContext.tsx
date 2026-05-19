import { useContext, useState, createContext, type PropsWithChildren, useEffect, useCallback, useMemo } from "react";
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

    const updateToken = useCallback((
        type: 'access' | 'refresh', 
        token: string | null,
        storageOps: { set: (v: any) => void, remove: () => void }
    ) => {
        if (token) {
            storageOps.set(token);
        } else {
            storageOps.remove();
        }
        if (type === 'access') setAccessToken(token);
        else setRefreshToken(token);
    }, []);

    const handleSetAccessToken = useCallback((token: string | null) => {
        updateToken('access', token, { set: setAccessTokeninStorage, remove: removeAccessTokenFromStorage });
    }, [updateToken, setAccessTokeninStorage, removeAccessTokenFromStorage]);

    const handleSetRefreshToken = useCallback((token: string | null) => {
        updateToken('refresh', token, { set: setRefreshTokeninStorage, remove: removeRefreshTokenFromStorage });
    }, [updateToken, setRefreshTokeninStorage, removeRefreshTokenFromStorage]);

    // 다른 탭에서 로그아웃/로그인 시 상태 동기화
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            const keys = {
                [LOCAL_STORAGE_KEY.accessToken]: setAccessToken,
                [LOCAL_STORAGE_KEY.refreshToken]: setRefreshToken,
            };

            const updateAction = keys[event.key as keyof typeof keys];
            if (!updateAction) return;

            try {
                let newToken = null;
                if (event.newValue) {
                    try {
                        newToken = JSON.parse(event.newValue);
                    } catch {
                        newToken = event.newValue;
                    }
                }
                updateAction(newToken);

                if (event.key === LOCAL_STORAGE_KEY.accessToken && !newToken) {
                    window.location.href = "/";
                }
            } catch (error) {
                console.error(`Storage sync error for ${event.key}:`, error);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = useCallback(async (signinData: RequestSigninDto): Promise<boolean> => {
        try {
            const data = await postSignin(signinData);

            if (data && data.data) {
                const newAccessToken: string = data.data.accessToken;
                const newRefreshToken: string = data.data.refreshToken;

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
    }, [handleSetAccessToken, handleSetRefreshToken]);

    const logout = useCallback(async (redirectPath: string = "/") => {
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
    }, [handleSetAccessToken, handleSetRefreshToken]);

    const value = useMemo(() => ({
        accessToken,
        refreshToken,
        setAccessToken: handleSetAccessToken,
        setRefreshToken: handleSetRefreshToken,
        login,
        logout
    }), [accessToken, refreshToken, handleSetAccessToken, handleSetRefreshToken, login, logout]);

    return (
        <AuthContext.Provider value={value}>
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
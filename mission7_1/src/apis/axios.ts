import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean; // 요청 재시도 여부
}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지합니다.
let refreshPromise: Promise<string> | null = null;

const BASE_URL = 'http://localhost:8000';

export const axiosInstance = axios.create({
    baseURL: BASE_URL
});

// 리프레시 요청만을 위한 별도의 인스턴스 (메인 인스턴스의 인터셉터와 충돌 방지)
const refreshInstance = axios.create({
    baseURL: BASE_URL
});

// 요청 인터셉터 : 모든 요청 전에 accessToken을 Authorization 헤더에 자동으로 추가
axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    // accessToken이 존재하면 Authorization 헤더에 Bearer 토큰으로 추가
    if (accessToken) {
        config.headers = config.headers || {};
        // useLocalStorage가 JSON.stringify를 사용하므로 저장된 값에서 따옴표 제거가 필요함
        const cleanToken = accessToken.replace(/^"(.*)"$/, "$1");
        config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
},
    (error) => Promise.reject(error),
);

// 응답 인터셉터 : 401에러 발생 -> refresh 토큰으로 accessToken 재발급 
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: CustomInternalAxiosRequestConfig = error.config;

        // 401에러면서, 아직 재시도 하지 않은 요청인 경우 처리
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
            const refreshToken = getRefreshToken();

            // 리프레시 토큰이 없거나, 리프레시 요청 자체가 401 에러를 반환하는 경우
            if (!refreshToken || originalRequest.url === "/v1/auth/refresh") {
                const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

                removeAccessToken();
                removeRefreshToken();

                // 무한 루프 방지: 현재 페이지가 로그인 페이지가 아닐 때만 리다이렉트
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }

            // 재시도 플래그 설정
            originalRequest._retry = true;

            // 이미 리프레시 요청이 진행 중이면, 해당 Promise를 재사용하여 동시 요청 처리
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    try {
                        const { data } = await refreshInstance.post("/v1/auth/refresh", {
                            refresh: refreshToken,
                        });

                        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;

                        const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                        const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                        
                        setAccessToken(newAccessToken);
                        setRefreshToken(newRefreshToken);

                        return newAccessToken;
                    } catch (refreshError) {
                        const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                        const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

                        removeAccessToken();
                        removeRefreshToken();

                        if (window.location.pathname !== "/login") {
                            window.location.href = "/login";
                        }
                        throw refreshError;
                    } finally {
                        refreshPromise = null;
                    }
                })();
            }

            // 진행 중인 refreshPromise가 해결될 때까지 기다린 후 원본 요청 재시도
            return refreshPromise.then((newAccessToken) => {
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            });
        }
        return Promise.reject(error);
    },
);
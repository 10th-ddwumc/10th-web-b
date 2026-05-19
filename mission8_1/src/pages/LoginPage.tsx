import { validateSignin, type UserSigninformaion } from "../utils/validate.ts";
import useForm from "../hooks/useForm.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

const LoginPage = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    // 이미 로그인된 상태라면 접근 차단 및 리다이렉트
    useEffect(() => {
        if (accessToken) {
            navigate(from, { replace: true });
        }
    }, [accessToken, navigate, from]);

    const memoizedValidate = useCallback((values: UserSigninformaion) => {
        return validateSignin(values);
    }, []);

    const { values, errors, touched, getInputProps } = useForm<UserSigninformaion>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: memoizedValidate,
    });

    const loginMutation = useMutation({
        mutationFn: (signinData: UserSigninformaion) => login(signinData),
        onSuccess: (success) => {
            if (success) {
                navigate(from, { replace: true });
            }
        },
        onError: (error) => {
            alert("로그인 중 오류가 발생했습니다.");
            console.error("Login error:", error);
        }
    });

    const handleSubmit = () => {
        loginMutation.mutate(values);
    }

    const handleGoogleLogin = () => {
        // 원래 가려던 페이지 정보를 로컬 스토리지에 저장하여 리다이렉트 후에도 기억하게 함
        localStorage.setItem("login_redirect", from);
        window.location.href = 'http://localhost:8000' + "/v1/auth/google/login?prompt=select_account";
    }

    // 버튼 비활성화를 위한 로직
    const isDisabled =
        Object.values(errors || {}).some((error) => error && error.length > 0) || 
        Object.values(values).some((value) => value === '') ||
        loginMutation.isPending; 

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative w-[300px] flex items-center justify-center mb-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute left-0 p-1 text-gray-500 hover:text-[#807bff] transition-colors cursor-pointer"
                    aria-label="뒤로 가기"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="text-2xl font-bold mb-4 text-[#333]">LOG IN</div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="space-y-1">
                    <input
                        name="email"
                        {...getInputProps('email')}
                        className={`border w-[300px] p-[12px] focus:ring-2 focus:ring-[#807bff] outline-none rounded-xl transition-all
                            ${errors?.email && touched?.email ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                        type={"email"}
                        placeholder={"이메일"}
                    />
                    {errors?.email && touched?.email && (
                        <div className="text-red-500 text-xs px-1">{errors.email}</div>
                    )}
                </div>

                <div className="space-y-1">
                    <input
                        name="password"
                        {...getInputProps('password')}
                        className={`border w-[300px] p-[12px] focus:ring-2 focus:ring-[#807bff] outline-none rounded-xl transition-all
                            ${errors?.password && touched?.password ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                        type={"password"}
                        placeholder={"비밀번호"}
                    />
                    {errors?.password && touched?.password && (
                        <div className="text-red-500 text-xs px-1">{errors.password}</div>
                    )}
                </div>

                <button 
                    type='button' 
                    onClick={handleSubmit} 
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-200 disabled:bg-gray-300 disabled:shadow-none mt-2"
                >
                    {loginMutation.isPending ? "로그인 중..." : "로그인"}
                </button>

                <div className="flex items-center gap-2 my-2">
                    <div className="h-[1px] bg-gray-200 flex-1"></div>
                    <span className="text-gray-400 text-sm">OR</span>
                    <div className="h-[1px] bg-gray-200 flex-1"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    구글 로그인
                </button>
            </div>
        </div>
    )
}

export default LoginPage;

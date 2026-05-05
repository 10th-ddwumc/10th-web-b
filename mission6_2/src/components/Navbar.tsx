import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth";
import { getMyInfo } from "../apis/auth";
import { useEffect } from "react";

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { accessToken, logout } = useAuth();
    const [data, setdata] = useState<ResponseMyInfoDto | null>(null);

    useEffect(() => {
            const getData = async () => {
                if (!accessToken) return;
                try {
                    const response = await getMyInfo();
                    setdata(response);
                } catch (error) {
                    console.error("내 정보 불러오기 실패:", error);
                }
            }
            getData();
        }, [accessToken]);

    return (
            <nav className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <button onClick={onMenuClick} className="md:hidden">
                    <svg width="30" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                    </svg>
                </button>
                <Link to="/" className="font-bold text-lg tracking-wide">
                    SYOON PAGE
                </Link>

                <div className="flex items-center gap-3">
                {!accessToken && (
                    <>
                    <Link 
                        to="/login" 
                        className="bg-white text-blue-600 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors shadow-sm"
                    >
                        로그인
                    </Link>
                    <Link 
                        to="/signup" 
                        className="bg-white text-blue-600 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors shadow-sm"
                    >
                        회원가입
                    </Link>
                    </>
                )}
                {accessToken && (
                    <>
                    <span className="text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
                        {data?.data?.name} 님 환영합니다.
                    </span>
                    <button onClick={logout} className="bg-white text-blue-600 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors shadow-sm">
                        로그아웃
                    </button>
                    </>
                )}
                </div>
            </nav>
    );
};
         
export default Navbar;
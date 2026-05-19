import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LogOut, User as UserIcon } from "lucide-react";

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { accessToken, logout } = useAuth();

    const { data: myInfo } = useQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfo,
        enabled: !!accessToken,
    });

    const logoutMutation = useMutation({
        mutationFn: () => logout(),
    });

    return (
        <nav className="sticky top-0 z-20 bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick} 
                    className="md:hidden p-1 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Menu"
                >
                    <svg width="30" height="30" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                    </svg>
                </button>
                <Link to="/" className="font-black text-xl tracking-tighter">
                    SYOON PAGE
                </Link>
            </div>

            <div className="flex items-center gap-3">
                {!accessToken ? (
                    <div className="flex gap-2">
                        <Link 
                            to="/login" 
                            className="bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-all"
                        >
                            로그인
                        </Link>
                        <Link 
                            to="/signup" 
                            className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all shadow-lg shadow-blue-800/20"
                        >
                            회원가입
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/my" className="hidden sm:flex items-center gap-2 hover:text-white/80 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
                                {myInfo?.data.avatar ? (
                                    <img src={myInfo.data.avatar} alt={myInfo.data.name} className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={16} />
                                )}
                            </div>
                            <span className="text-sm font-bold">
                                {myInfo?.data.name}님
                            </span>
                        </Link>
                        <button 
                            onClick={() => logoutMutation.mutate()} 
                            disabled={logoutMutation.isPending}
                            className="bg-white/10 hover:bg-red-500/20 p-2 rounded-xl transition-all text-white"
                            title="로그아웃"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};
         
export default Navbar;
import { Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav className="bg-blue-600 text-white p-4 flex items-center justify-between">
                
                <Link to="/" className="font-bold text-lg tracking-wide">
                    SYOON PAGE
                </Link>

                <div className="flex items-center gap-3">
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
                </div>
            </nav>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-gray-100 p-4 text-center text-gray-500">
                푸터
            </footer>
        </div>
    )
}

export default HomeLayout;
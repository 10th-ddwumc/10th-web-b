import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../apis/auth";
import { Search, User, LogOut, Trash2, X } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout, accessToken } = useAuth();
  const [search, setSearch] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const withdrawMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      alert("탈퇴 처리가 완료되었습니다.");
      logout("/login");
    },
    onError: () => alert("탈퇴 처리에 실패했습니다."),
  });

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/?search=${search}`);
    onClose?.();
  };

  const handleMyPage = () => {
    navigate("/my");
    onClose?.();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="relative mb-6">
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="검색어 입력"
          className="w-full p-3 pl-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-all"
        />
        <Search className="absolute left-3 top-3.5 text-white/50" size={18} />
      </div>

      <nav className="space-y-2 flex-1">
        <button 
          className="w-full p-3 flex items-center gap-3 text-white hover:bg-white/10 rounded-xl transition-all"
          onClick={handleSearch}
        >
          <Search size={20} /> 검색 실행
        </button>
        <button 
          className="w-full p-3 flex items-center gap-3 text-white hover:bg-white/10 rounded-xl transition-all"
          onClick={handleMyPage}
        >
          <User size={20} /> 마이페이지
        </button>
      </nav>

      {accessToken && (
        <div className="mt-auto space-y-2 pt-6 border-t border-white/10">
          <button 
            className="w-full p-3 flex items-center gap-3 text-red-200 hover:bg-red-500/20 rounded-xl transition-all"
            onClick={() => setShowWithdrawModal(true)}
          >
            <Trash2 size={20} /> 탈퇴하기
          </button>
          <button 
            className="w-full p-3 flex items-center gap-3 text-white/70 hover:bg-white/10 rounded-xl transition-all"
            onClick={() => logout()}
          >
            <LogOut size={20} /> 로그아웃
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="h-full w-64 bg-blue-600 p-6 hidden md:flex flex-col border-r border-white/10 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
          <aside className="fixed left-0 top-0 w-72 h-full bg-blue-600 z-50 flex flex-col p-6 animate-in slide-in-from-left duration-300 md:hidden">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-black text-white">SYOON.</h1>
              <button onClick={onClose} className="text-white/70 hover:text-white"><X size={24} /></button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* 탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">정말 탈퇴하시겠습니까?</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                취소
              </button>
              <button 
                onClick={() => withdrawMutation.mutate()}
                disabled={withdrawMutation.isPending}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:bg-gray-300"
              >
                {withdrawMutation.isPending ? "처리 중..." : "예, 탈퇴합니다"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
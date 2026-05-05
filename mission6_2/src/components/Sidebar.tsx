import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(`/?search=${search}`);
  };

  const handleMyPage = () => {
    navigate("/my");
    onClose?.();
  };

  return (
    <>
    <aside className="w-50 h-screen bg-blue-600 p-5 flex flex-col hidden md:flex w-20 p-4">
      <button className="p-2 bg-white text-blue-600 rounded" onClick ={handleSearch}>
        검색
      </button>

      <button className="p-2 bg-white text-blue-600 rounded mt-2" onClick={handleMyPage}>
        MyPage
      </button>
    </aside>

    {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

         <aside className="fixed left-0 top-0 w-64 h-full bg-blue-600 z-50 flex flex-col p-4">
          <button className="m-5 p-2 bg-white text-blue-600 rounded hover:bg-blue-200" onClick ={handleSearch}>
            검색
          </button>

         <button className="m-5 p-2 bg-white text-blue-600 rounded mt-2 hover:bg-blue-200" onClick={handleMyPage}>
           MyPage
         </button>
        </aside>
        </>
    )}
    </>
  );
}
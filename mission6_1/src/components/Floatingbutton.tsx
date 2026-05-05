import { useNavigate } from "react-router-dom";

export default function FloatingButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/create")}
      className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full text-2xl shadow-lg"
    >
      +
    </button>
  );
}